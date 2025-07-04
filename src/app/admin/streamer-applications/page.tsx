'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import {
  adminWrapper,
  pageTitle,
  applicationCard,
  userInfo,
  userAvatar,
  userDetails,
  userName,
  userEmail,
  applicationMeta,
  statusBadge,
  statusPending,
  statusApproved,
  statusRejected,
  applicationDate,
  actionButtons,
  approveButton,
  rejectButton,
  loadingState,
  emptyState,
} from './page.css';
import Image from 'next/image';

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
                <Image
                  src={application.user.profileImageUrl}
                  alt={application.user.nickname}
                  width={40}
                  height={40}
                  style={{ borderRadius: '50%' }}
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
