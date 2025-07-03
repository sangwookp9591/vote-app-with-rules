'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import * as styles from './teams.css';

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
    <div className={styles.wrapper}>
      <h1 className={styles.title}>팀 목록</h1>
      <div className={styles.topBar}>
        <Link href={`/tournaments/${tournamentId}/teams/create`} className={styles.createButton}>
          팀 생성하기
        </Link>
      </div>
      {loading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : teams.length === 0 ? (
        <div>아직 생성된 팀이 없습니다.</div>
      ) : (
        <div className={styles.grid}>
          {teams.map((team) => (
            <div key={team.id} className={styles.card}>
              <div className={styles.teamName}>{team.name}</div>
              <div className={styles.teamDesc}>{team.description || '-'}</div>
              <div className={styles.leaderRow}>
                <span className={styles.leaderLabel}>팀장</span>
                {team.leader?.profileImageUrl ? (
                  <img
                    src={team.leader.profileImageUrl}
                    alt={team.leader.nickname}
                    className={styles.leaderAvatar}
                  />
                ) : (
                  <span className={styles.leaderAvatar}>
                    {team.leader?.nickname?.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className={styles.leaderName}>{team.leader?.nickname}</span>
              </div>
              <div className={styles.memberCount}>팀원 수: {team.members.length}</div>
              <Link
                href={`/tournaments/${tournamentId}/teams/${team.id}/apply`}
                className={styles.applyButton}
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
