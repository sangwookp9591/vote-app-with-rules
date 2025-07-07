'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface TeamMember {
  id: string;
  nickname: string;
  profileImageUrl?: string;
  status: string;
}

interface TeamDetail {
  id: string;
  name: string;
  leader: {
    id: string;
    nickname: string;
    profileImageUrl?: string;
  } | null;
  members: TeamMember[];
  description?: string;
}

interface Applicant {
  id: string;
  nickname: string;
  profileImageUrl?: string;
}

export default function TeamDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const tournamentId = params?.id as string;
  const teamId = params?.teamId as string;

  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // TODO: 실제 로그인 정보로 대체
  const isLeader = team && session?.user?.id && team.leader?.id === session.user.id;
  const [showInvite, setShowInvite] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [showManage, setShowManage] = useState(false);

  useEffect(() => {
    async function fetchTeam() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/tournaments/${tournamentId}/teams/${teamId}`);
        if (!res.ok) throw new Error('팀 정보를 불러올 수 없습니다.');
        const data = await res.json();
        setTeam(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : '알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    }
    if (tournamentId && teamId) fetchTeam();
  }, [tournamentId, teamId]);

  // 초대 모달 열기 시 신청자 목록 fetch
  const openInvite = async () => {
    setShowInvite(true);
    setInviteLoading(true);
    setInviteError('');
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/applications`);
      if (!res.ok) throw new Error('신청자 목록을 불러올 수 없습니다.');
      const data = await res.json();
      // 내 팀원(팀장 포함) id 목록
      const memberIds = [team?.leader?.id, ...(team?.members?.map((m) => m.id) || [])].filter(
        Boolean,
      );
      // 내 팀원이 아닌 신청자만 추출
      setApplicants(
        data
          .map((a: { user: Applicant }) => a.user)
          .filter((user: Applicant) => !memberIds.includes(user.id)),
      );
    } catch (e) {
      setInviteError(e instanceof Error ? e.message : '알 수 없는 오류');
    } finally {
      setInviteLoading(false);
    }
  };

  // 초대(실제 API 연동)
  const handleInvite = async (applicant: Applicant) => {
    if (!team) return;
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/teams/${teamId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: applicant.id }),
      });
      if (!res.ok) throw new Error('초대 실패');
      setTeam({
        ...team,
        members: [...team.members, { ...applicant, status: 'PENDING' }],
      });
      setShowInvite(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : '알 수 없는 오류');
    }
  };

  // 팀원 추방
  const handleKick = async (memberId: string) => {
    if (!team) return;
    if (!window.confirm('정말로 이 팀원을 추방하시겠습니까?')) return;
    try {
      const res = await fetch(
        `/api/tournaments/${tournamentId}/teams/${teamId}/members/${memberId}`,
        {
          method: 'DELETE',
        },
      );
      if (!res.ok) throw new Error('팀원 추방 실패');
      setTeam({
        ...team,
        members: team.members.filter((m) => m.id !== memberId),
      });
    } catch (e) {
      alert(e instanceof Error ? e.message : '알 수 없는 오류');
    }
  };

  if (loading) return <div style={{ padding: 32 }}>로딩 중...</div>;
  if (error) return <div style={{ padding: 32, color: '#ff4f4f' }}>{error}</div>;
  if (!team) return <div style={{ padding: 32 }}>팀 정보를 찾을 수 없습니다.</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16 }}>팀 상세</h1>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>{team.name}</div>
        <div style={{ color: '#888', marginTop: 4 }}>{team.description || '설명 없음'}</div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>팀 멤버</div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {team.members.map((m) => (
            <li
              key={m.id}
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}
            >
              {m.user.profileImageUrl && (
                <Image
                  src={m.user.profileImageUrl}
                  alt="프로필"
                  width={32}
                  height={32}
                  style={{ borderRadius: '50%' }}
                />
              )}
              <span style={{ fontWeight: 600 }}>
                {m.user.nickname}
                {m.isLeader && <span style={{ marginLeft: 6 }}>👑</span>}
              </span>
              <span
                style={{
                  marginLeft: 8,
                  padding: '2px 10px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600,
                  background:
                    m.inviteStatus === 'ACCEPTED'
                      ? '#e6f7ff'
                      : m.inviteStatus === 'PENDING'
                        ? '#fffbe6'
                        : '#ffeaea',
                  color:
                    m.inviteStatus === 'ACCEPTED'
                      ? '#1890ff'
                      : m.inviteStatus === 'PENDING'
                        ? '#faad14'
                        : '#ff4d4f',
                }}
              >
                {m.inviteStatus === 'ACCEPTED'
                  ? '수락'
                  : m.inviteStatus === 'PENDING'
                    ? '대기'
                    : '거절'}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontWeight: 600, color: '#4f9fff' }}>팀원</span>
        {isLeader && (
          <button
            style={{
              background: '#4f9fff',
              color: 'white',
              borderRadius: 6,
              padding: '4px 12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={openInvite}
          >
            팀원 초대
          </button>
        )}
      </div>
      <div style={{ marginTop: 32 }}>
        <Link
          href={`/tournaments/${tournamentId}/teams`}
          style={{ color: '#4f9fff', textDecoration: 'underline' }}
        >
          팀 목록으로 돌아가기
        </Link>
      </div>
      {/* 초대 모달 */}
      {showInvite && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.25)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowInvite(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 12,
              minWidth: 320,
              maxWidth: 400,
              padding: 24,
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>팀원 초대</h2>
            {inviteLoading ? (
              <div>로딩 중...</div>
            ) : inviteError ? (
              <div style={{ color: '#ff4f9f' }}>{inviteError}</div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  maxHeight: 300,
                  overflowY: 'auto',
                }}
              >
                {applicants.length === 0 ? (
                  <span style={{ color: '#aaa', fontSize: 13 }}>신청자가 없습니다.</span>
                ) : (
                  applicants.map((applicant) => {
                    const alreadyMember = team?.members.some((m) => m.id === applicant.id);
                    return (
                      <div
                        key={applicant.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: 6,
                          border: '1px solid #e0e7ef',
                          borderRadius: 8,
                        }}
                      >
                        <span
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: '#e0e7ef',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 15,
                          }}
                        >
                          {applicant.profileImageUrl ? (
                            <Image
                              src={applicant.profileImageUrl}
                              alt="프로필"
                              width={40}
                              height={40}
                              style={{ borderRadius: '50%' }}
                            />
                          ) : (
                            applicant.nickname.charAt(0).toUpperCase()
                          )}
                        </span>
                        <span style={{ fontWeight: 600 }}>{applicant.nickname}</span>
                        <button
                          style={{
                            marginLeft: 'auto',
                            background: alreadyMember ? '#eee' : '#4f9fff',
                            color: alreadyMember ? '#aaa' : 'white',
                            borderRadius: 6,
                            padding: '4px 12px',
                            fontWeight: 600,
                            border: 'none',
                            cursor: alreadyMember ? 'not-allowed' : 'pointer',
                          }}
                          disabled={alreadyMember}
                          onClick={() => handleInvite(applicant)}
                        >
                          {alreadyMember ? '이미 팀원' : '초대'}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}
            <button
              style={{
                marginTop: 18,
                width: '100%',
                background: '#eee',
                color: '#333',
                borderRadius: 6,
                padding: '6px 0',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => setShowInvite(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
