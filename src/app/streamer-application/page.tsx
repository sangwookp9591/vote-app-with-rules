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
} from './page.css';
import { useSession } from 'next-auth/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import StreamerApplicationForm from '@/features/streamer-application/ui/StreamerApplicationForm';

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
  return <StreamerApplicationForm />;
}
