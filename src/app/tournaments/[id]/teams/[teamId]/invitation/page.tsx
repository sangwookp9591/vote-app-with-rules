'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

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

  useEffect(() => {
    if (!tournamentId || !teamId) return;
    setLoading(true);
    fetch(`/api/tournaments/${tournamentId}/teams/${teamId}`)
      .then((res) => res.json())
      .then((data) => setTeam(data))
      .catch(() => setError('팀 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [tournamentId, teamId]);

  const handleAccept = async () => {
    // TODO: 실제 수락 API 연동
    alert('수락 처리 (API 연동 필요)');
    router.push('/my/teams');
  };
  const handleReject = async () => {
    // TODO: 실제 거절 API 연동
    alert('거절 처리 (API 연동 필요)');
    router.push('/notifications');
  };

  if (loading) return <div style={{ padding: 32 }}>로딩 중...</div>;
  if (error) return <div style={{ padding: 32, color: '#ff4f4f' }}>{error}</div>;
  if (!team) return <div style={{ padding: 32 }}>팀 정보를 찾을 수 없습니다.</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16 }}>팀 초대 상세</h1>
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
              <span>{m.user.nickname}</span>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <button
          onClick={handleAccept}
          style={{
            background: '#4f9fff',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          수락
        </button>
        <button
          onClick={handleReject}
          style={{
            background: '#eee',
            color: '#ff4f4f',
            border: 'none',
            borderRadius: 6,
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          거절
        </button>
      </div>
    </div>
  );
}
