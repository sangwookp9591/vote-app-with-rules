'use client';
import { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface NotificationItem {
  id: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  type: string;
  link?: string | null;
}

export default function NotificationsList() {
  // const { data: session } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/notifications');
        if (!res.ok) throw new Error('알림 조회 실패');
        const data = await res.json();
        setNotifications(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : '알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const handleRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch {}
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>알림</h1>
      {loading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div style={{ color: '#ff4f9f' }}>{error}</div>
      ) : notifications.length === 0 ? (
        <div>알림이 없습니다.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map((n) => (
            <li
              key={n.id}
              style={{
                background: n.isRead ? '#f8fbff' : '#e6f0ff',
                borderRadius: 12,
                marginBottom: 16,
                padding: '18px 20px',
                boxShadow: '0 2px 8px #e0e7ef33',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
              onClick={() => {
                handleRead(n.id);
                if (n.link) router.push(n.link);
              }}
            >
              <div style={{ fontWeight: 700, color: '#222', fontSize: 16 }}>{n.title}</div>
              <div style={{ color: '#888', fontSize: 14 }}>{n.content}</div>
              <div style={{ color: '#aaa', fontSize: 12 }}>
                {new Date(n.createdAt).toLocaleString('ko-KR')}
              </div>
              {!n.isRead && (
                <span style={{ color: '#4f9fff', fontWeight: 600, fontSize: 13 }}>새 알림</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
