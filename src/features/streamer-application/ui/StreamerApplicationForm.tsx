'use client';

import {
  applicationWrapper,
  pageTitle,
  applicationCard,
  applicationForm,
  formGroup,
  formLabel,
  formTextarea,
  submitButton,
  statusCard,
  statusTitle,
  statusBadge,
  statusPending,
  statusApproved,
  statusRejected,
  statusMessage,
  errorMessage,
  successMessage,
} from '@/app/streamer-application/page.css';
import { useSession } from 'next-auth/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

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

export default function StreamerApplicationForm() {
  const { data: session } = useSession();
  const [selfIntro, setSelfIntro] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 신청 상태 조회
  const { data: application, refetch } = useQuery<StreamerApplication | null>(
    ['myStreamerApplication'],
    async () => {
      const res = await fetch('/api/streamer-applications/me');
      if (!res.ok) return null;
      return res.json();
    },
    { enabled: !!session?.user?.id },
  );

  // 신청 제출
  const mutation = useMutation(
    async () => {
      setError('');
      setSuccess('');
      setLoading(true);
      const res = await fetch('/api/streamer-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selfIntroduction: selfIntro }),
      });
      setLoading(false);
      if (!res.ok) throw new Error('신청 실패');
      setSuccess('신청이 완료되었습니다!');
      setSelfIntro('');
      refetch();
    },
    {
      onError: (e: any) => setError(e.message || '신청 실패'),
    },
  );

  return (
    <div className={applicationWrapper}>
      <h1 className={pageTitle}>스트리머 신청</h1>
      {application ? (
        <div className={statusCard}>
          <div className={statusTitle}>신청 상태</div>
          <div
            className={
              statusBadge +
              ' ' +
              (application.status === 'PENDING'
                ? statusPending
                : application.status === 'APPROVED'
                  ? statusApproved
                  : statusRejected)
            }
          >
            {application.status === 'PENDING'
              ? '대기중'
              : application.status === 'APPROVED'
                ? '승인됨'
                : '거절됨'}
          </div>
          <div className={statusMessage}>
            {application.status === 'PENDING'
              ? '관리자 검토 중입니다.'
              : application.status === 'APPROVED'
                ? '스트리머로 승인되었습니다!'
                : '신청이 거절되었습니다.'}
          </div>
        </div>
      ) : (
        <form
          className={applicationForm}
          onSubmit={async (e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className={formGroup}>
            <label htmlFor="selfIntro" className={formLabel}>
              자기소개 <span style={{ color: '#ff4f9f' }}>*</span>
            </label>
            <textarea
              id="selfIntro"
              value={selfIntro}
              onChange={(e) => setSelfIntro(e.target.value)}
              placeholder="자신을 소개해 주세요"
              required
              rows={3}
              className={formTextarea}
            />
          </div>
          <button type="submit" disabled={loading} className={submitButton}>
            {loading ? '신청 중...' : '신청하기'}
          </button>
          {error && <div className={errorMessage}>{error}</div>}
          {success && <div className={successMessage}>{success}</div>}
        </form>
      )}
    </div>
  );
}
