'use client';

import { useSession } from 'next-auth/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { style } from '@vanilla-extract/css';

// CSS 스타일
const applicationWrapper = style({
  maxWidth: '600px',
  margin: '0 auto',
  padding: '2rem',
});

const pageTitle = style({
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '2rem',
  textAlign: 'center',
  color: 'var(--foreground)',
});

const applicationCard = style({
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: '12px',
  padding: '2rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});

const applicationForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
});

const formGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const formLabel = style({
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--foreground)',
});

const formTextarea = style({
  width: '100%',
  padding: '0.75rem',
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  fontSize: '1rem',
  backgroundColor: 'var(--background)',
  color: 'var(--foreground)',
  resize: 'vertical',
  minHeight: '120px',
  transition: 'border-color 0.2s ease',
  ':focus': {
    outline: 'none',
    borderColor: '#4f9fff',
    boxShadow: '0 0 0 3px rgba(79, 159, 255, 0.1)',
  },
});

const submitButton = style({
  background: 'linear-gradient(45deg, #4f9fff, #ff4f9f)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '1rem 2rem',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(79, 159, 255, 0.4)',
  },
  ':disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
  },
});

const statusCard = style({
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: '12px',
  padding: '2rem',
  textAlign: 'center',
});

const statusTitle = style({
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: '1rem',
  color: 'var(--foreground)',
});

const statusBadge = style({
  display: 'inline-block',
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  marginBottom: '1rem',
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

const statusMessage = style({
  fontSize: '1rem',
  color: 'var(--muted-foreground)',
  lineHeight: 1.5,
});

const errorMessage = style({
  color: '#dc3545',
  fontSize: '0.9rem',
  marginTop: '0.5rem',
});

const successMessage = style({
  color: '#28a745',
  fontSize: '0.9rem',
  marginTop: '0.5rem',
});

interface StreamerApplication {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user: {
    id: string;
    email: string;
    nickname: string;
  };
}

export default function StreamerApplicationPage() {
  const { data: session } = useSession();
  const [motivation, setMotivation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 로그인 확인
  if (!session?.user?.id) {
    return <div>로그인이 필요합니다.</div>;
  }

  // 기존 신청 상태 조회
  const { data: existingApplication, refetch } = useQuery<StreamerApplication>({
    queryKey: ['streamer-application', session.user.id],
    queryFn: async () => {
      const res = await fetch(`/api/streamer-applications?userId=${session.user.id}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('신청 상태 조회 실패');
      return res.json();
    },
    enabled: !!session.user.id,
  });

  // 스트리머 신청 뮤테이션
  const applyMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/streamer-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '신청 실패');
      }

      return res.json();
    },
    onSuccess: () => {
      setSuccess('스트리머 신청이 완료되었습니다!');
      setError('');
      refetch();
    },
    onError: (error: Error) => {
      setError(error.message);
      setSuccess('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!motivation.trim()) {
      setError('신청 동기를 입력해주세요.');
      return;
    }

    applyMutation.mutate();
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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '스트리머 신청이 접수되었습니다. 관리자 검토 후 결과를 알려드리겠습니다.';
      case 'APPROVED':
        return '축하합니다! 스트리머 신청이 승인되었습니다. 이제 토너먼트를 생성할 수 있습니다.';
      case 'REJECTED':
        return '죄송합니다. 스트리머 신청이 거절되었습니다.';
      default:
        return '';
    }
  };

  // 이미 신청한 경우 상태 표시
  if (existingApplication) {
    return (
      <div className={applicationWrapper}>
        <h1 className={pageTitle}>스트리머 신청</h1>
        <div className={statusCard}>
          <h2 className={statusTitle}>신청 상태</h2>
          <div className={getStatusBadgeClass(existingApplication.status)}>
            {getStatusText(existingApplication.status)}
          </div>
          <p className={statusMessage}>{getStatusMessage(existingApplication.status)}</p>
          <p className={statusMessage}>
            신청일: {new Date(existingApplication.createdAt).toLocaleDateString('ko-KR')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={applicationWrapper}>
      <h1 className={pageTitle}>스트리머 신청</h1>
      <div className={applicationCard}>
        <form onSubmit={handleSubmit} className={applicationForm}>
          <div className={formGroup}>
            <label htmlFor="motivation" className={formLabel}>
              스트리머 신청 동기 *
            </label>
            <textarea
              id="motivation"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              className={formTextarea}
              placeholder="스트리머가 되고 싶은 이유와 계획을 자세히 작성해주세요..."
              required
            />
          </div>

          {error && <div className={errorMessage}>{error}</div>}
          {success && <div className={successMessage}>{success}</div>}

          <button type="submit" className={submitButton} disabled={applyMutation.isPending}>
            {applyMutation.isPending ? '신청 중...' : '스트리머 신청하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
