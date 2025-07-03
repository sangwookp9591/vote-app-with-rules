'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Team {
  id: string;
  name: string;
  description?: string;
  leader: {
    id: string;
    nickname: string;
    profileImageUrl?: string;
  };
  members: {
    id: string;
    nickname: string;
    profileImageUrl?: string;
  }[];
}

export default function TeamsPage() {
  const params = useParams();
  const tournamentId = params?.id as string;
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTeams() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/tournaments/${tournamentId}/teams`);
        if (!res.ok) throw new Error('팀 목록 조회 실패');
        const data = await res.json();
        setTeams(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : '알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    }
    if (tournamentId) fetchTeams();
  }, [tournamentId]);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>팀 목록</h1>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <Link
          href={`/tournaments/${tournamentId}/teams/create`}
          style={{
            background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '1rem',
          }}
        >
          팀 생성하기
        </Link>
      </div>
      {loading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div style={{ color: '#ff4f9f' }}>{error}</div>
      ) : teams.length === 0 ? (
        <div>아직 생성된 팀이 없습니다.</div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
          }}
        >
          {teams.map((team) => (
            <div
              key={team.id}
              style={{
                background: 'var(--card-bg, #f8fbff)',
                border: '1.5px solid var(--card-border, #e0e7ef)',
                borderRadius: 14,
                padding: 20,
                boxShadow: '0 2px 8px rgba(79,159,255,0.07)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                minHeight: 180,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 4 }}>
                {team.name}
              </div>
              <div style={{ color: '#888', fontSize: 13, marginBottom: 6 }}>
                {team.description || '-'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: '#4f9fff', fontWeight: 600 }}>팀장</span>
                {team.leader?.profileImageUrl ? (
                  <img
                    src={team.leader.profileImageUrl}
                    alt={team.leader.nickname}
                    style={{ width: 28, height: 28, borderRadius: '50%' }}
                  />
                ) : (
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
                    {team.leader?.nickname?.charAt(0).toUpperCase()}
                  </span>
                )}
                <span style={{ fontWeight: 600, fontSize: 14 }}>{team.leader?.nickname}</span>
              </div>
              <div style={{ fontSize: 13, color: '#888' }}>팀원 수: {team.members.length}</div>
              <Link
                href={`/tournaments/${tournamentId}/teams/${team.id}/apply`}
                style={{
                  marginTop: 10,
                  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: 8,
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '0.98rem',
                  textAlign: 'center',
                  display: 'inline-block',
                }}
              >
                팀 신청
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
