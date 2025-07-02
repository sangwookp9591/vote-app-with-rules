'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { style } from '@vanilla-extract/css';

// CSS 스타일
const adminWrapper = style({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem',
});

const pageTitle = style({
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '2rem',
  color: 'var(--foreground)',
});

const applicationCard = style({
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: '12px',
  padding: '1.5rem',
  marginBottom: '1rem',
  transition: 'all 0.2s ease',
  ':hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
});

const userInfo = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1rem',
});

const userAvatar = style({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: 'var(--primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  fontWeight: 600,
  color: 'white',
  overflow: 'hidden',
});

const userDetails = style({
  flex: 1,
});

const userName = style({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: 'var(--foreground)',
  marginBottom: '0.25rem',
});

const userEmail = style({
  fontSize: '0.9rem',
  color: 'var(--muted-foreground)',
});

const applicationMeta = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
});

const statusBadge = style({
  padding: '0.25rem 0.75rem',
  borderRadius: '20px',
  fontSize: '0.8rem',
  fontWeight: 600,
  textTransform: 'uppercase',
});

const statusPending = style({
  backgroundColor: 'rgba(255, 193, 7, 0.2)',
  color: '#856404',
});

const statusApproved = style({
  backgroundColor: 'rgba(40, 167, 69, 0.2)',
  color: '#155724',
});

const statusRejected = style({
  backgroundColor: 'rgba(220, 53, 69, 0.2)',
  color: '#721c24',
});

const applicationDate = style({
  fontSize: '0.9rem',
  color: 'var(--muted-foreground)',
});

const actionButtons = style({
  display: 'flex',
  gap: '0.5rem',
});

const approveButton = style({
  background: 'linear-gradient(45deg, #28a745, #20c997)',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '0.5rem 1rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3)',
  },
  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
  },
});

const rejectButton = style({
  background: 'linear-gradient(45deg, #dc3545, #fd7e14)',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '0.5rem 1rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(220, 53, 69, 0.3)',
  },
  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
  },
});

const loadingState = style({
  textAlign: 'center',
  padding: '4rem 2rem',
  color: 'var(--muted-foreground)',
});

const emptyState = style({
  textAlign: 'center',
  padding: '4rem 2rem',
  color: 'var(--muted-foreground)',
});

interface StreamerApplication {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user: {
    id: string;
    email: string;
    nickname: string;
    profileImageUrl?: string;
  };
}

export default function StreamerApplicationsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<string | null>(null);

  // 스트리머 신청 목록 조회
  const { data: applications, isLoading } = useQuery<StreamerApplication[]>({
    queryKey: ['streamer-applications'],
    queryFn: async () => {
      const res = await fetch('/api/admin/streamer-applications');
      if (!res.ok) throw new Error('스트리머 신청 목록 조회 실패');
      return res.json();
    },
  });

  // 승인/거절 뮤테이션
  const processApplicationMutation = useMutation({
    mutationFn: async ({
      applicationId,
      action,
    }: {
      applicationId: string;
      action: 'approve' | 'reject';
    }) => {
      const res = await fetch('/api/admin/streamer-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          action,
          reviewerId: session?.user?.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '처리 실패');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streamer-applications'] });
      setProcessingId(null);
    },
    onError: (error: Error) => {
      alert(error.message);
      setProcessingId(null);
    },
  });

  const handleAction = (applicationId: string, action: 'approve' | 'reject') => {
    setProcessingId(applicationId);
    processApplicationMutation.mutate({ applicationId, action });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return `${statusBadge} ${statusPending}`;
      case 'APPROVED':
        return `${statusBadge} ${statusApproved}`;
      case 'REJECTED':
        return `${statusBadge} ${statusRejected}`;
      default:
        return statusBadge;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '대기중';
      case 'APPROVED':
        return '승인됨';
      case 'REJECTED':
        return '거절됨';
      default:
        return status;
    }
  };

  // 관리자 권한 확인
  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    return <div>관리자 권한이 필요합니다.</div>;
  }

  if (isLoading) {
    return <div className={loadingState}>로딩 중...</div>;
  }

  if (!applications || applications.length === 0) {
    return <div className={emptyState}>스트리머 신청이 없습니다.</div>;
  }

  return (
    <div className={adminWrapper}>
      <h1 className={pageTitle}>스트리머 신청 관리</h1>

      {applications.map((application) => (
        <div key={application.id} className={applicationCard}>
          <div className={userInfo}>
            <div className={userAvatar}>
              {application.user.profileImageUrl ? (
                <img
                  src={application.user.profileImageUrl}
                  alt={application.user.nickname}
                  style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                />
              ) : (
                application.user.nickname.charAt(0).toUpperCase()
              )}
            </div>
            <div className={userDetails}>
              <div className={userName}>{application.user.nickname}</div>
              <div className={userEmail}>{application.user.email}</div>
            </div>
          </div>

          <div className={applicationMeta}>
            <span className={getStatusBadgeClass(application.status)}>
              {getStatusText(application.status)}
            </span>
            <span className={applicationDate}>
              {new Date(application.createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>

          {application.status === 'PENDING' && (
            <div className={actionButtons}>
              <button
                className={approveButton}
                onClick={() => handleAction(application.id, 'approve')}
                disabled={processingId === application.id}
              >
                {processingId === application.id ? '처리 중...' : '승인'}
              </button>
              <button
                className={rejectButton}
                onClick={() => handleAction(application.id, 'reject')}
                disabled={processingId === application.id}
              >
                {processingId === application.id ? '처리 중...' : '거절'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
