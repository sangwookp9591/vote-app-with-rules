'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  type: string;
}

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch(() => setError('알림을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  const handleRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch {
      alert('알림 읽음 처리에 실패했습니다.');
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      alert('알림 삭제에 실패했습니다.');
    }
  };

  function getNotificationIcon(type: string) {
    switch (type) {
      case 'TEAM_INVITATION':
        return '👥';
      case 'TEAM_KICK':
        return '❌';
      case 'TEAM_INVITATION_RESPONSE':
        return '✅';
      case 'TEAM_LEAVE_REQUEST':
        return '🚪';
      case 'TOURNAMENT_START':
        return '🏁';
      case 'TOURNAMENT_END':
        return '🏆';
      case 'VOTE_START':
        return '🗳️';
      case 'VOTE_END':
        return '📊';
      default:
        return '🔔';
    }
  }
  function getNotificationColor(type: string) {
    switch (type) {
      case 'TEAM_INVITATION':
        return '#e6f7ff';
      case 'TEAM_KICK':
        return '#fff1f0';
      case 'TEAM_INVITATION_RESPONSE':
        return '#f6ffed';
      default:
        return '#f8fbff';
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

  if (!session?.user) {
    return <div style={{ padding: 32 }}>로그인이 필요합니다.</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>알림함</h1>
      {loading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div style={{ color: '#ff4f9f' }}>{error}</div>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#aaa', fontSize: 16, margin: '48px 0' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔕</div>
          <div>알림이 없습니다.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: n.isRead ? getNotificationColor(n.type) : '#bae0ff',
                border: n.type === 'TEAM_KICK' ? '2px solid #ff4f4f' : '1px solid #e0e7ef',
                borderRadius: 10,
                padding: 16,
                position: 'relative',
                boxShadow: n.type === 'TEAM_KICK' ? '0 0 8px #ff4f4f33' : undefined,
              }}
            >
              <span style={{ fontSize: 28 }}>{getNotificationIcon(n.type)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{n.title}</div>
                <div style={{ fontSize: 13, color: '#555', margin: '2px 0 4px 0' }}>
                  {n.content}
                </div>
                <div style={{ fontSize: 12, color: '#aaa' }}>{timeAgo(n.createdAt)}</div>
              </div>
              {n.type === 'TEAM_INVITATION' && !n.isRead && (
                <Link
                  href="/my/teams"
                  style={{
                    background: '#4f9fff',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontWeight: 600,
                    fontSize: 13,
                    marginRight: 6,
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                  onClick={() => handleRead(n.id)}
                >
                  초대 확인
                </Link>
              )}
              {!n.isRead && (
                <button
                  onClick={() => handleRead(n.id)}
                  style={{
                    background: '#4f9fff',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontWeight: 600,
                    fontSize: 13,
                    marginRight: 6,
                    cursor: 'pointer',
                  }}
                >
                  읽음
                </button>
              )}
              <button
                onClick={() => handleDelete(n.id)}
                style={{
                  background: '#eee',
                  color: '#ff4f4f',
                  border: 'none',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Link href="/" style={{ color: '#4f9fff', textDecoration: 'underline' }}>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
