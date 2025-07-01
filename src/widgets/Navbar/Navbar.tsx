'use client';

import styles from './Navbar.module.css';
import ThemeToggle from '../../shared/ui/ThemeToggle';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

interface NavbarProps {
  onSidebarToggle?: () => void;
  sidebarOpen?: boolean;
}

type UserWithProfile = {
  email?: string;
  name?: string;
  nickname?: string;
  profileImageUrl?: string;
};

export default function Navbar({ onSidebarToggle, sidebarOpen }: NavbarProps) {
  const { data: session } = useSession();
  const user = session?.user as UserWithProfile;
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        {onSidebarToggle && (
          <button
            className={styles.sidebarToggle}
            onClick={onSidebarToggle}
            aria-label={sidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
            style={{ marginRight: 12 }}
          >
            ≡
          </button>
        )}
        <span className={styles.logo}>LoL SWL</span>
        <ul className={styles.menu}>
          <li>
            <a href="#">홈</a>
          </li>
          <li>
            <a href="#">토너먼트</a>
          </li>
          <li>
            <a href="#">인기 스트리머</a>
          </li>
        </ul>
      </div>
      <div className={styles.right}>
        <button className={styles.iconButton} aria-label="알림">
          <span role="img" aria-label="알림">
            🔔
          </span>
        </button>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user?.profileImageUrl && (
              <img
                src={user.profileImageUrl}
                alt="프로필"
                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
            <span style={{ fontWeight: 600 }}>{user?.nickname || user?.name || user?.email}</span>
            <button
              className={styles.authButton}
              onClick={() => signOut({ callbackUrl: '/' })}
              style={{ marginLeft: 8 }}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <>
            <Link href={'/login'} className={styles.authButton}>
              로그인
            </Link>
            <Link href={'/signup'} className={styles.authButton}>
              회원가입
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
