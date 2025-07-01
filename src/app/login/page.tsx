'use client';

import { useState, FormEvent } from 'react';
import SocialLoginButtons from '../signup/SocialLoginButtons';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    // next-auth credentials provider로 로그인 시도
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (res?.ok) {
      setSuccess('로그인 성공!');
      router.push('/'); // 메인화면으로 이동
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 12,
          padding: 32,
          minWidth: 320,
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        }}
      >
        <h2 style={{ marginBottom: 24, textAlign: 'center' }}>로그인</h2>
        <label style={{ display: 'block', marginBottom: 8 }}>
          이메일
          <input
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              marginTop: 4,
              marginBottom: 16,
              padding: 8,
              borderRadius: 6,
              border: '1px solid var(--input-border)',
              background: 'var(--input-bg)',
              color: 'var(--input-text)',
            }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: 8 }}>
          비밀번호
          <input
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              marginTop: 4,
              marginBottom: 16,
              padding: 8,
              borderRadius: 6,
              border: '1px solid var(--input-border)',
              background: 'var(--input-bg)',
              color: 'var(--input-text)',
            }}
          />
        </label>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 6,
              background: 'var(--primary, #4f9fff)',
              color: 'var(--button-text)',
              border: 'none',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              marginTop: 8,
            }}
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
          <SocialLoginButtons />
        </div>
      </form>
    </main>
  );
}
