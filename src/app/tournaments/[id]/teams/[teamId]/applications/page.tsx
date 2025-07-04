'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Application {
  id: string;
  user: {
    id: string;
    nickname: string;
    profileImageUrl?: string;
  };
  selfIntroduction: string;
  messageToTeam?: string;
  status: string;
  createdAt: string;
}

export default function TeamApplicationsPage() {
  const params = useParams();
  const tournamentId = params?.id as string;
  const teamId = params?.teamId as string;
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/tournaments/${tournamentId}/teams/${teamId}/applications`);
        if (!res.ok) throw new Error('신청 내역 조회 실패');
        const data = await res.json();
        setApplications(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : '알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    }
    if (tournamentId && teamId) fetchApplications();
  }, [tournamentId, teamId]);

  const handleAction = async (applicationId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(
        `/api/tournaments/${tournamentId}/teams/${teamId}/applications/${applicationId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        },
      );
      if (!res.ok) throw new Error('처리 실패');
      setToast(action === 'approve' ? '신청을 승인했습니다.' : '신청을 거절했습니다.');
      setApplications((prev) =>
        prev.map((a) =>
          a.id === applicationId
            ? { ...a, status: action === 'approve' ? 'APPROVED' : 'REJECTED' }
            : a,
        ),
      );
      setTimeout(() => setToast(null), 2000);
    } catch (e) {
      setToast(e instanceof Error ? e.message : '알 수 없는 오류');
      setTimeout(() => setToast(null), 2000);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 24 }}>팀 신청 관리</h1>
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 30,
            left: 0,
            right: 0,
            zIndex: 1000,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              background: '#222',
              color: '#fff',
              padding: '10px 24px',
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            {toast}
          </span>
        </div>
      )}
      {loading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div style={{ color: '#ff4f9f' }}>{error}</div>
      ) : applications.length === 0 ? (
        <div>아직 신청 내역이 없습니다.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {applications.map((app) => (
            <div
              key={app.id}
              style={{
                background: '#f8fbff',
                borderRadius: 12,
                padding: 18,
                boxShadow: '0 2px 8px rgba(79,159,255,0.07)',
                border: '1.5px solid #e0e7ef',
                display: 'flex',
                gap: 18,
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: '#e0e7ef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {app.user.profileImageUrl ? (
                  <Image
                    src={app.user.profileImageUrl}
                    alt="프로필"
                    width={40}
                    height={40}
                    style={{ borderRadius: '50%' }}
                  />
                ) : (
                  app.user.nickname.charAt(0).toUpperCase()
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 4 }}>
                  {app.user.nickname}
                </div>
                <div style={{ color: '#4f9fff', fontWeight: 600, marginBottom: 2 }}>
                  자기소개: {app.selfIntroduction}
                </div>
                {app.messageToTeam && (
                  <div style={{ color: '#888', fontSize: 13 }}>
                    팀에 하고 싶은 말: {app.messageToTeam}
                  </div>
                )}
                <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>
                  {new Date(app.createdAt).toLocaleString('ko-KR')}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 90 }}>
                {app.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => handleAction(app.id, 'approve')}
                      style={{
                        background: '#4f9fff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '7px 0',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleAction(app.id, 'reject')}
                      style={{
                        background: '#ff4f9f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '7px 0',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      거절
                    </button>
                  </>
                ) : (
                  <span
                    style={{
                      color: app.status === 'APPROVED' ? '#4f9fff' : '#ff4f9f',
                      fontWeight: 700,
                    }}
                  >
                    {app.status === 'APPROVED' ? '승인됨' : '거절됨'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
