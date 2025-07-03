'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as styles from './apply.css';

export default function TeamApplyPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params?.id as string;
  const teamId = params?.teamId as string;
  const [selfIntro, setSelfIntro] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!selfIntro.trim()) {
      setError('자기소개를 입력하세요.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/teams/${teamId}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selfIntroduction: selfIntro, messageToTeam: message }),
      });
      if (!res.ok) throw new Error('팀 신청 실패');
      setSuccess('신청이 완료되었습니다!');
      setTimeout(() => router.push(`/tournaments/${tournamentId}/teams`), 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>팀 신청</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="selfIntro" className={styles.label}>
            자기소개 <span style={{ color: '#ff4f9f' }}>*</span>
          </label>
          <textarea
            id="selfIntro"
            value={selfIntro}
            onChange={(e) => setSelfIntro(e.target.value)}
            placeholder="자신을 소개해 주세요"
            required
            rows={3}
            className={styles.textarea}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            팀에 하고 싶은 말
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="팀장/팀원에게 하고 싶은 말을 남겨보세요"
            rows={2}
            className={styles.textarea}
          />
        </div>
        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? '신청 중...' : '팀 신청하기'}
        </button>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
      </form>
    </div>
  );
}
