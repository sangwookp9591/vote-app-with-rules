'use client';

import styles from './Sidebar.module.css';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const menu = [
  { label: '홈', href: '#' },
  { label: '토너먼트', href: '/tournaments' },
  { label: '인기 스트리머', href: '#' },
  { label: '팀 관리', href: '#' },
  { label: '스트리머 승인', href: '/admin/streamer-applications' },
];

export default function Sidebar({ open }: { open: boolean }) {
  const { data: session } = useSession();
  const user = session?.user;
  const [leaderTeam, setLeaderTeam] = useState<{ tournamentId: string; teamId: string } | null>(
    null,
  );
  const router = useRouter();

  useEffect(() => {
    async function fetchLeaderTeam() {
      if (!user?.id) return;
      // 모든 토너먼트에서 내 팀을 찾는 API가 없다면, 예시로 하나의 토너먼트만 사용하거나, 서버에서 내 팀장 팀을 반환하는 API를 만드는 것이 좋음
      // 여기서는 예시로 /api/my/teams에서 내 팀 목록을 받아온다고 가정
      try {
        const res = await fetch('/api/my/teams');
        if (!res.ok) return;
        const data = await res.json();
        // [{ tournamentId, teamId, isLeader: true/false } ...]
        const myLeaderTeam = data.find((t: any) => t.isLeader);
        if (myLeaderTeam) {
          setLeaderTeam({ tournamentId: myLeaderTeam.tournamentId, teamId: myLeaderTeam.teamId });
        } else {
          setLeaderTeam(null);
        }
      } catch {
        setLeaderTeam(null);
      }
    }
    fetchLeaderTeam();
  }, [user?.id]);

  if (!open) return null;

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.logo}>LoL SWL</div>
        <nav className={styles.menu}>
          {menu.map((item) => (
            <a key={item.label} href={item.href} className={styles.menuItem}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className={styles.bottom}>
        <button className={styles.utilButton}>설정</button>
        <button className={styles.utilButton}>로그아웃</button>
      </div>
    </aside>
  );
}
