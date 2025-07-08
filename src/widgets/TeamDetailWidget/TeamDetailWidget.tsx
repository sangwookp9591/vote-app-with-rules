'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { TeamMember, TeamDetail } from '@/entities/team/model/types';
import TeamMemberManager from '@/features/teams/ui/TeamMemberManager';

export default function TeamDetailWidget() {
  const params = useParams();
  const { data: session } = useSession();
  const tournamentId = params?.id as string;
  const teamId = params?.teamId as string;

  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = session?.user;
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
        setMembers(data.members);
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
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 32 }}>
      {/* 팀 정보 카드 */}
      <div
        style={{
          background: 'linear-gradient(90deg, #e6f0ff 0%, #f8fbff 100%)',
          borderRadius: 18,
          padding: 32,
          marginBottom: 32,
          boxShadow: '0 2px 16px #e6f0ff55',
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: '#4f9fff22',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            fontWeight: 800,
            color: '#4f9fff',
          }}
        >
          {team.name[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#222' }}>{team.name}</div>
          <div style={{ color: '#888', marginTop: 6, fontSize: 15 }}>
            {team.description || '설명 없음'}
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: '#4f9fff', fontWeight: 600 }}>
            팀장: {team.leader?.nickname} <span style={{ fontSize: 18 }}>👑</span>
          </div>
        </div>
      </div>

      {/* 멤버 목록 카드 */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          marginBottom: 32,
          boxShadow: '0 2px 12px #e0e7ef33',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 18 }}>팀 멤버</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 18,
          }}
        >
          {members.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#f8fbff',
                borderRadius: 12,
                padding: '12px 16px',
                boxShadow: m.isLeader ? '0 0 0 2px #4f9fff55' : undefined,
                border: m.isLeader ? '2px solid #4f9fff' : '1px solid #e0e7ef',
              }}
            >
              {m.user.profileImageUrl ? (
                <Image
                  src={m.user.profileImageUrl}
                  alt="프로필"
                  width={40}
                  height={40}
                  style={{ borderRadius: '50%', border: m.isLeader ? '2px solid #4f9fff' : 'none' }}
                />
              ) : (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#e0e7ef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 18,
                    color: '#4f9fff',
                    border: m.isLeader ? '2px solid #4f9fff' : 'none',
                  }}
                >
                  {m.user.nickname[0]}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#222' }}>
                  {m.user.nickname} {m.isLeader && <span style={{ fontSize: 18 }}>👑</span>}
                </div>
                <div style={{ marginTop: 2 }}>
                  <span
                    style={{
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 팀 관리 패널 (팀장만) */}
      <TeamMemberManager
        members={members}
        isLeader={!!isLeader}
        onStatusChange={handleStatusChange}
        onKick={handleKick}
      />
    </div>
  );
}
