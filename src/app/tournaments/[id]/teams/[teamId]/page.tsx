'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface TeamMember {
  id: string;
  user: {
    id: string;
    nickname: string;
    profileImageUrl?: string;
  };
  isLeader: boolean;
  inviteStatus: 'ACCEPTED' | 'PENDING' | 'REJECTED';
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

export default function TeamDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const tournamentId = params?.id as string;
  const teamId = params?.teamId as string;

  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = session?.user;
  const [showManage, setShowManage] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>(team?.members || []);

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

  // 멤버 상태 변경(승인/거절)
  const handleStatusChange = async (memberId: string, inviteStatus: 'ACCEPTED' | 'REJECTED') => {
    try {
      const res = await fetch(
        `/api/tournaments/${tournamentId}/teams/${teamId}/members/${memberId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inviteStatus }),
        },
      );
      if (!res.ok) throw new Error('상태 변경 실패');
      setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, inviteStatus } : m)));
    } catch {
      alert('상태 변경에 실패했습니다.');
    }
  };
  // 멤버 추방
  const handleKick = async (memberId: string) => {
    if (!confirm('정말로 이 멤버를 추방하시겠습니까?')) return;
    try {
      const res = await fetch(
        `/api/tournaments/${tournamentId}/teams/${teamId}/members/${memberId}`,
        {
          method: 'DELETE',
        },
      );
      if (!res.ok) throw new Error('추방 실패');
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch {
      alert('추방에 실패했습니다.');
    }
  };

  if (loading) return <div style={{ padding: 32 }}>로딩 중...</div>;
  if (error) return <div style={{ padding: 32, color: '#ff4f4f' }}>{error}</div>;
  if (!team) return <div style={{ padding: 32 }}>팀 정보를 찾을 수 없습니다.</div>;

  const isLeader = team && team.members.find((m) => m.isLeader && m.user.id === user?.id);

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
          {members.map((m) => (
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
              {isLeader && !m.isLeader && (
                <>
                  {m.inviteStatus === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(m.id, 'ACCEPTED')}
                        style={{
                          marginLeft: 8,
                          background: '#4f9fff',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          padding: '4px 12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        승인
                      </button>
                      <button
                        onClick={() => handleStatusChange(m.id, 'REJECTED')}
                        style={{
                          marginLeft: 4,
                          background: '#eee',
                          color: '#ff4f4f',
                          border: 'none',
                          borderRadius: 6,
                          padding: '4px 12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        거절
                      </button>
                    </>
                  )}
                  {m.inviteStatus === 'ACCEPTED' && (
                    <button
                      onClick={() => handleKick(m.id)}
                      style={{
                        marginLeft: 8,
                        background: '#eee',
                        color: '#ff4f4f',
                        border: 'none',
                        borderRadius: 6,
                        padding: '4px 12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      추방
                    </button>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      {isLeader && (
        <div style={{ marginTop: 32 }}>
          <button
            onClick={() => setShowManage((v) => !v)}
            style={{
              background: showManage ? '#222' : '#4f9fff',
              color: 'white',
              borderRadius: 6,
              padding: '10px 24px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {showManage ? '팀 관리 닫기' : '팀 관리'}
          </button>
          {showManage && (
            <div
              style={{
                border: '1.5px solid #e0e7ef',
                borderRadius: 12,
                padding: 18,
                marginTop: 16,
              }}
            >
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>팀원 관리</h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {members.map((m) => (
                  <li
                    key={m.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}
                  >
                    <span style={{ fontWeight: 600 }}>
                      {m.user.nickname}
                      {m.isLeader && ' 👑'}
                    </span>
                    <span style={{ marginLeft: 8 }}>
                      {m.inviteStatus === 'ACCEPTED'
                        ? '수락'
                        : m.inviteStatus === 'PENDING'
                          ? '대기'
                          : '거절'}
                    </span>
                    {!m.isLeader && (
                      <>
                        {m.inviteStatus === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(m.id, 'ACCEPTED')}
                              style={{
                                marginLeft: 8,
                                background: '#4f9fff',
                                color: 'white',
                                border: 'none',
                                borderRadius: 6,
                                padding: '4px 12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              승인
                            </button>
                            <button
                              onClick={() => handleStatusChange(m.id, 'REJECTED')}
                              style={{
                                marginLeft: 4,
                                background: '#eee',
                                color: '#ff4f4f',
                                border: 'none',
                                borderRadius: 6,
                                padding: '4px 12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              거절
                            </button>
                          </>
                        )}
                        {m.inviteStatus === 'ACCEPTED' && (
                          <button
                            onClick={() => handleKick(m.id)}
                            style={{
                              marginLeft: 8,
                              background: '#eee',
                              color: '#ff4f4f',
                              border: 'none',
                              borderRadius: 6,
                              padding: '4px 12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            추방
                          </button>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div style={{ marginTop: 32 }}>
        <Link
          href={`/tournaments/${tournamentId}/teams`}
          style={{ color: '#4f9fff', textDecoration: 'underline' }}
        >
          팀 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
