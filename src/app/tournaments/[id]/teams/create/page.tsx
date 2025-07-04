'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import * as styles from './createTeam.css';
import Image from 'next/image';

interface Tournament {
  id: string;
  title: string;
  gameType: string;
  teamSize: number;
}

interface User {
  id: string;
  nickname: string;
  email: string;
  profileImageUrl?: string;
}

export default function CreateTeamPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const tournamentId = params?.id as string;

  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // 토너먼트 정보 조회
  const { data: tournament } = useQuery<Tournament>({
    queryKey: ['tournament', tournamentId],
    queryFn: async () => {
      const res = await fetch(`/api/tournaments/${tournamentId}`);
      if (!res.ok) throw new Error('토너먼트 정보 조회 실패');
      return res.json();
    },
    enabled: !!tournamentId,
  });

  // 사용자 목록 조회 (실제로는 토너먼트 신청자들만 조회해야 함)
  const { data: users } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('사용자 목록 조회 실패');
      return res.json();
    },
  });

  // 토너먼트 신청 여부 확인
  const { data: myApplications, isLoading: loadingApplications } = useQuery({
    queryKey: ['myTournamentApplications', tournamentId, session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const res = await fetch(
        `/api/tournaments/${tournamentId}/applications?userId=${session.user.id}`,
      );
      if (!res.ok) throw new Error('신청 내역 조회 실패');
      return res.json();
    },
    enabled: !!tournamentId && !!session?.user?.id,
  });

  // 본인(팀장) 자동 선택
  useEffect(() => {
    if (session?.user?.id && users) {
      setSelectedMembers((prev) => {
        if (!prev.includes(session.user.id)) {
          return [session.user.id, ...prev];
        }
        return prev;
      });
    }
  }, [session?.user?.id, users]);

  // 팀원 검색 필터링
  useEffect(() => {
    if (!users) return;
    const q = search.trim().toLowerCase();
    setFilteredUsers(
      users.filter(
        (u) => u.nickname.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      ),
    );
  }, [users, search]);

  // 팀 생성 뮤테이션
  const createTeamMutation = useMutation({
    mutationFn: async (data: { name: string; members: string[] }) => {
      const res = await fetch(`/api/tournaments/${tournamentId}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          leaderId: session?.user?.id, // 현재 로그인한 사용자가 팀장
          members: data.members,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '팀 생성 실패');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', tournamentId] });
      router.push(`/tournaments/${tournamentId}`);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleMemberToggle = (userId: string) => {
    setSelectedMembers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        if (prev.length >= (tournament?.teamSize || 5)) {
          setError(`최대 ${tournament?.teamSize}명까지만 선택할 수 있습니다.`);
          return prev;
        }
        setError('');
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!teamName.trim()) {
      setError('팀명을 입력하세요.');
      return;
    }
    if (!teamDescription.trim()) {
      setError('팀 소개를 입력하세요.');
      return;
    }
    if (selectedMembers.length === 0) {
      setError('팀원을 1명 이상 선택하세요.');
      return;
    }
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teamName,
          leaderId: session?.user?.id,
          members: selectedMembers,
        }),
      });
      if (!res.ok) throw new Error('팀 생성 실패');
      await queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
      window.alert('팀이 성공적으로 생성되었습니다!');
      router.push(`/tournaments/${tournamentId}/teams`);
    } catch (e) {
      setError((e as Error).message);
      window.alert((e as Error).message);
    }
  };

  if (!session?.user?.id) {
    return <div>로그인이 필요합니다.</div>;
  }

  if (!tournament) {
    return <div>로딩 중...</div>;
  }

  // 신청 여부에 따라 조건부 렌더링
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>팀 생성</h1>
      {loadingApplications ? (
        <div>신청 내역을 확인 중...</div>
      ) : !myApplications || myApplications.length === 0 ? (
        <div style={{ color: '#ff4f9f', fontWeight: 600, fontSize: '1.1rem', margin: '2rem 0' }}>
          해당 토너먼트에 참가 신청을 완료해야 팀을 생성할 수 있습니다.
          <br />
          <Link
            href={`/tournaments/${tournamentId}/apply`}
            style={{
              color: '#4f9fff',
              textDecoration: 'underline',
              marginTop: 12,
              display: 'inline-block',
            }}
          >
            참가 신청하러 가기
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.teamSizeInfo}>
            {tournament.gameType} 토너먼트 - 팀원 {tournament.teamSize}명 필요
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="teamName" className={styles.label}>
                팀 이름 *
              </label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className={styles.input}
                placeholder="팀 이름을 입력하세요"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="teamDescription" className={styles.label}>
                팀 소개 *
              </label>
              <textarea
                id="teamDescription"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                className={styles.textarea}
                placeholder="팀을 소개해 주세요"
                required
                rows={3}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                팀원 선택 ({selectedMembers.length}/{tournament.teamSize})
              </label>
              <input
                type="text"
                placeholder="닉네임/이메일 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.input}
                style={{ marginBottom: 12 }}
              />
              <div className={styles.memberSelector}>
                <div className={styles.memberList}>
                  {filteredUsers.map((user) => {
                    const isSelf = user.id === session?.user?.id;
                    const isSelected = selectedMembers.includes(user.id);
                    return (
                      <div
                        key={user.id}
                        className={`${styles.memberItem} ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          if (!isSelf) handleMemberToggle(user.id);
                        }}
                        style={{
                          opacity: isSelf ? 0.6 : 1,
                          pointerEvents: isSelf ? 'none' : 'auto',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div className={styles.memberAvatar}>
                          {user.profileImageUrl ? (
                            <Image
                              src={user.profileImageUrl}
                              alt="프로필"
                              width={40}
                              height={40}
                              style={{ borderRadius: '50%' }}
                            />
                          ) : (
                            user.nickname.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className={styles.memberInfo}>
                          <div className={styles.memberName}>
                            {user.nickname}
                            {isSelf && (
                              <span style={{ marginLeft: 6, fontSize: 14, color: '#4f9fff' }}>
                                (나)
                              </span>
                            )}
                          </div>
                          <div className={styles.memberEmail}>{user.email}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedMembers.length > 0 && (
                  <div className={styles.selectedMembers}>
                    <strong>선택된 팀원:</strong>
                    {selectedMembers.map((memberId) => {
                      const user = users?.find((u) => u.id === memberId);
                      const isSelf = memberId === session?.user?.id;
                      return (
                        <div key={memberId} className={styles.selectedMemberTag}>
                          <span>
                            {user?.nickname}
                            {isSelf && (
                              <span style={{ marginLeft: 4, color: '#4f9fff' }}>(나)</span>
                            )}
                          </span>
                          {!isSelf && (
                            <button
                              type="button"
                              className={styles.removeButton}
                              onClick={() => handleMemberToggle(memberId)}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.buttonGroup}>
              <Link href={`/tournaments/${tournamentId}`} className={styles.cancelButton}>
                취소
              </Link>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={createTeamMutation.isPending}
              >
                {createTeamMutation.isPending ? '생성 중...' : '팀 생성'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
