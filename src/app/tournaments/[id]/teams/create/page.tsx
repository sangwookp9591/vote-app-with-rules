'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { style } from '@vanilla-extract/css';

// CSS 스타일
const createTeamWrapper = style({
  maxWidth: '800px',
  margin: '0 auto',
  padding: '2rem',
});

const formTitle = style({
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '2rem',
  color: 'var(--foreground)',
});

const formGroup = style({
  marginBottom: '1.5rem',
});

const formLabel = style({
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 600,
  color: 'var(--foreground)',
});

const formInput = style({
  width: '100%',
  padding: '0.75rem',
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  fontSize: '1rem',
  backgroundColor: 'var(--card-bg)',
  color: 'var(--foreground)',
  transition: 'border-color 0.2s ease',
  ':focus': {
    outline: 'none',
    borderColor: '#4f9fff',
  },
});

const memberSelector = style({
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  padding: '1rem',
  backgroundColor: 'var(--card-bg)',
  minHeight: '200px',
});

const memberList = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '0.5rem',
  marginBottom: '1rem',
});

const memberItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem',
  border: '1px solid var(--card-border)',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    borderColor: '#4f9fff',
    backgroundColor: 'rgba(79, 159, 255, 0.05)',
  },
  selectors: {
    '&.selected': {
      borderColor: '#4f9fff',
      backgroundColor: 'rgba(79, 159, 255, 0.1)',
    },
  },
});

const memberAvatar = style({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: 'var(--accent-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'white',
});

const memberInfo = style({
  flex: 1,
});

const memberName = style({
  fontWeight: 600,
  fontSize: '0.875rem',
});

const memberEmail = style({
  fontSize: '0.75rem',
  color: 'var(--muted-foreground)',
});

const styleSelectedMembers = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginTop: '1rem',
});

const selectedMemberTag = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.25rem 0.5rem',
  backgroundColor: 'rgba(79, 159, 255, 0.1)',
  border: '1px solid rgba(79, 159, 255, 0.2)',
  borderRadius: '4px',
  fontSize: '0.875rem',
});

const removeButton = style({
  background: 'none',
  border: 'none',
  color: '#ff4f4f',
  cursor: 'pointer',
  fontSize: '1rem',
  padding: '0',
  width: '16px',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const teamSizeInfo = style({
  padding: '0.75rem',
  backgroundColor: 'rgba(79, 159, 255, 0.1)',
  border: '1px solid rgba(79, 159, 255, 0.2)',
  borderRadius: '8px',
  marginBottom: '1rem',
  fontSize: '0.875rem',
  color: '#4f9fff',
  fontWeight: 600,
});

const buttonGroup = style({
  display: 'flex',
  gap: '1rem',
  marginTop: '2rem',
});

const submitButton = style({
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(79, 159, 255, 0.3)',
  },
  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
  },
});

const cancelButton = style({
  background: 'transparent',
  color: 'var(--muted-foreground)',
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-block',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  ':hover': {
    backgroundColor: 'var(--gray-alpha-100)',
    borderColor: 'var(--foreground)',
  },
});

const errorMessage = style({
  color: '#ff4f4f',
  fontSize: '0.875rem',
  marginTop: '0.5rem',
});

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
          teamName,
          teamDescription,
          memberIds: selectedMembers,
        }),
      });
      if (!res.ok) throw new Error('팀 생성 실패');
      await queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
      router.push(`/tournaments/${tournamentId}/teams`);
    } catch (e) {
      setError((e as Error).message);
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
    <div className={createTeamWrapper}>
      <h1 className={formTitle}>팀 생성</h1>
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
          <div className={teamSizeInfo}>
            {tournament.gameType} 토너먼트 - 팀원 {tournament.teamSize}명 필요
          </div>
          <form onSubmit={handleSubmit}>
            <div className={formGroup}>
              <label htmlFor="teamName" className={formLabel}>
                팀 이름 *
              </label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className={formInput}
                placeholder="팀 이름을 입력하세요"
                required
              />
            </div>
            <div className={formGroup}>
              <label htmlFor="teamDescription" className={formLabel}>
                팀 소개 *
              </label>
              <textarea
                id="teamDescription"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                className={formInput}
                placeholder="팀을 소개해 주세요"
                required
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div className={formGroup}>
              <label className={formLabel}>
                팀원 선택 ({selectedMembers.length}/{tournament.teamSize})
              </label>
              <div className={memberSelector}>
                <div className={memberList}>
                  {users?.map((user) => (
                    <div
                      key={user.id}
                      className={`${memberItem} ${selectedMembers.includes(user.id) ? 'selected' : ''}`}
                      onClick={() => handleMemberToggle(user.id)}
                    >
                      <div className={memberAvatar}>
                        {user.profileImageUrl ? (
                          <img
                            src={user.profileImageUrl}
                            alt={user.nickname}
                            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                          />
                        ) : (
                          user.nickname.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className={memberInfo}>
                        <div className={memberName}>{user.nickname}</div>
                        <div className={memberEmail}>{user.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedMembers.length > 0 && (
                  <div className={styleSelectedMembers}>
                    <strong>선택된 팀원:</strong>
                    {selectedMembers.map((memberId) => {
                      const user = users?.find((u) => u.id === memberId);
                      return (
                        <div key={memberId} className={selectedMemberTag}>
                          <span>{user?.nickname}</span>
                          <button
                            type="button"
                            className={removeButton}
                            onClick={() => handleMemberToggle(memberId)}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {error && <div className={errorMessage}>{error}</div>}
            <div className={buttonGroup}>
              <Link href={`/tournaments/${tournamentId}`} className={cancelButton}>
                취소
              </Link>
              <button
                type="submit"
                className={submitButton}
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
