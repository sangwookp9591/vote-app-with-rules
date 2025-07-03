'use client';

import styles from './Navbar.module.css';
import ThemeToggle from '../../shared/ui/ThemeToggle';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

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

interface NotificationItem {
  id: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export default function Navbar({ onSidebarToggle, sidebarOpen }: NavbarProps) {
  const { data: session } = useSession();
  const user = session?.user as UserWithProfile;

  // 알림 상태 (실제 구현 시 fetch로 대체)
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 더미 fetch (실제 구현 시 /api/notifications fetch)
  useEffect(() => {
    if (!user) return;
    // 예시: 최근 3개 알림
    setNotifications([
      {
        id: '1',
        title: '팀 신청 승인',
        content: '팀장이 신청을 승인했습니다.',
        isRead: false,
        createdAt: new Date().toISOString(),
        link: '/tournaments/123/teams/456',
      },
      {
        id: '2',
        title: '팀 초대',
        content: '팀장으로부터 초대를 받았습니다.',
        isRead: true,
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
        link: '/tournaments/123/teams/456',
      },
    ]);
  }, [user]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (id: string, link?: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setDropdownOpen(false);
    if (link) window.location.href = link;
  };

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
            <Link href="/">홈</Link>
          </li>
          <li>
            <Link href="/tournaments">토너먼트</Link>
          </li>
          <li>
            <a href="#">인기 스트리머</a>
          </li>
        </ul>
      </div>
      <div className={styles.right}>
        <div style={{ position: 'relative' }}>
          <button
            className={styles.iconButton}
            aria-label="알림"
            onClick={() => setDropdownOpen((v) => !v)}
            style={{ position: 'relative' }}
          >
            <span role="img" aria-label="알림">
              🔔
            </span>
            {unreadCount > 0 && <span className={styles.badge} />}
          </button>
          {dropdownOpen && (
            <div className={styles.notificationDropdown} ref={dropdownRef}>
              {notifications.length === 0 ? (
                <div className={styles.emptyNotification}>알림이 없습니다.</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={clsx(styles.notificationItem, !n.isRead && 'unread')}
                    onClick={() => handleNotificationClick(n.id, n.link)}
                    style={{ background: n.isRead ? undefined : 'rgba(79,159,255,0.07)' }}
                  >
                    <div>
                      <div className={styles.notificationTitle}>{n.title}</div>
                      <div className={styles.notificationContent}>{n.content}</div>
                      <div className={styles.notificationTime}>
                        {new Date(n.createdAt).toLocaleString('ko-KR')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
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
