'use client';

import styles from './Navbar.module.css';
import ThemeToggle from '../../shared/ui/ThemeToggle';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { io, Socket } from 'socket.io-client';

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
  type: string;
  link?: string;
}

export default function Navbar({ onSidebarToggle, sidebarOpen }: NavbarProps) {
  const { data: session } = useSession();
  const user = session?.user as UserWithProfile;

  // 알림 상태 (실제 구현 시 fetch로 대체)
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // 알림 fetch (실제 구현)
  useEffect(() => {
    if (!user) return;
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch(() => setNotifications([]));
  }, [user]);

  // socket.io 연결 (최상위에서 1회만)
  useEffect(() => {
    if (!user) return;
    if (socketRef.current) return;
    const socket = io({ path: '/api/socket', transports: ['websocket'] });
    socketRef.current = socket;
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      // 실무 패턴: 로그인한 유저의 userId로 room join
      if (user && user.email) {
        socket.emit('join', user.email); // user.id가 있으면 user.id 사용
      }
      // 테스트: 서버에 ping 보내기
      socket.emit('ping');
    });
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    socket.on('pong', () => {
      console.log('서버로부터 pong 수신!');
    });
    // 실시간 알림 수신 핸들러
    socket.on('notification', (notification: NotificationItem) => {
      setNotifications((prev) => [notification, ...prev]);
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
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

  function getNotificationIcon(type: string) {
    switch (type) {
      case 'TEAM_INVITATION':
        return '👥';
      case 'TEAM_INVITATION_RESPONSE':
        return '✅';
      case 'TEAM_LEAVE_REQUEST':
        return '🚪';
      default:
        return '🔔';
    }
  }

  function timeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}초 전`;
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return date.toLocaleDateString('ko-KR');
  }

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
                <div
                  style={{ textAlign: 'center', padding: '32px 0', color: '#aaa', fontSize: 15 }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🔕</div>
                  <div>알림이 없습니다.</div>
                </div>
              ) : (
                notifications.map((n: NotificationItem, i) => (
                  <div
                    key={n.id}
                    className={clsx(styles.notificationItem, !n.isRead && 'unread')}
                    onClick={() => handleNotificationClick(n.id, n.link)}
                    style={{
                      background: n.isRead ? undefined : 'rgba(79,159,255,0.07)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      cursor: 'pointer',
                      borderBottom:
                        i !== notifications.length - 1 ? '1px solid #f0f0f0' : undefined,
                      padding: '12px 10px',
                      transition: 'background 0.15s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f0f6ff')}
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = n.isRead ? '' : 'rgba(79,159,255,0.07)')
                    }
                  >
                    <span style={{ fontSize: 22, marginTop: 2 }}>
                      {getNotificationIcon((n as NotificationItem).type)}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{n.title}</div>
                      <div style={{ fontSize: 13, color: '#555', margin: '2px 0 4px 0' }}>
                        {n.content}
                      </div>
                      <div style={{ fontSize: 12, color: '#aaa' }}>{timeAgo(n.createdAt)}</div>
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
