'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Team {
  id: string;
  name: string;
  description?: string;
  members: { id: string; user: { id: string; nickname: string; profileImageUrl?: string } }[];
}

export default function TeamInvitationPage() {
  const router = useRouter();
  const params = useParams();
  const { id: tournamentId, teamId } = params as { id: string; teamId: string };
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (!tournamentId || !teamId) return;
    setLoading(true);
    fetch(`/api/tournaments/${tournamentId}/teams/${teamId}`)
      .then((res) => res.json())
      .then((data) => setTeam(data))
      .catch(() => setError('팀 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [tournamentId, teamId]);

  const myMember = team?.members.find((m) => m.user.id === user?.id);
  const myMemberId = myMember?.id;

  const handleAccept = async () => {
    if (!myMemberId) return alert('내 팀 멤버 정보를 찾을 수 없습니다.');
    try {
      const res = await fetch(
        `/api/tournaments/${tournamentId}/teams/${teamId}/members/${myMemberId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inviteStatus: 'ACCEPTED' }),
        },
      );
      if (!res.ok) throw new Error('수락 실패');
      alert('팀 초대를 수락했습니다!');
      setTimeout(() => router.push('/my/teams'), 100);
    } catch {
      alert('수락 처리에 실패했습니다.');
    }
  };
  const handleReject = async () => {
    if (!myMemberId) return alert('내 팀 멤버 정보를 찾을 수 없습니다.');
    try {
      const res = await fetch(
        `/api/tournaments/${tournamentId}/teams/${teamId}/members/${myMemberId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inviteStatus: 'REJECTED' }),
        },
      );
      if (!res.ok) throw new Error('거절 실패');
      alert('팀 초대를 거절했습니다.');
      setTimeout(() => router.push('/notifications'), 100);
    } catch {
      alert('거절 처리에 실패했습니다.');
    }
  };

  if (loading) return <div style={{ padding: 32 }}>로딩 중...</div>;
  if (error) return <div style={{ padding: 32, color: '#ff4f4f' }}>{error}</div>;
  if (!team) return <div style={{ padding: 32 }}>팀 정보를 찾을 수 없습니다.</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16 }}>팀 초대 상세</h1>
      <div style={{ marginBottom: 24 }}>
        <Link
          href={`/tournaments/${tournamentId}/teams/${teamId}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {team.name}
          </div>
          <div
            style={{ color: '#888', marginTop: 4, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {team.description || '설명 없음'}
          </div>
        </Link>
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
                <Link
                  href={`/tournaments/${tournamentId}/teams/${teamId}`}
                  style={{ display: 'inline-block' }}
                >
                  <Image
                    src={m.user.profileImageUrl}
                    alt="프로필"
                    width={32}
                    height={32}
                    style={{ borderRadius: '50%', cursor: 'pointer' }}
                  />
                </Link>
              )}
              <Link
                href={`/tournaments/${tournamentId}/teams/${teamId}`}
                style={{ color: '#4f9fff', textDecoration: 'underline', cursor: 'pointer' }}
              >
                {m.user.nickname}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 32, justifyContent: 'center' }}>
        <button
          type="button"
          onClick={handleAccept}
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: '#4f9fff',
            color: 'white',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 18,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #4f9fff22',
            border: 'none',
            transition: 'background 0.2s',
            userSelect: 'none',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#357ae8')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#4f9fff')}
        >
          수락하기
        </button>
        <button
          type="button"
          onClick={handleReject}
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: '#eee',
            color: '#ff4f4f',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 18,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #ff4f4f22',
            border: 'none',
            transition: 'background 0.2s',
            userSelect: 'none',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#ffd6d6')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#eee')}
        >
          거절하기
        </button>
      </div>
    </div>
  );
}
