'use client';

import { useState } from 'react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [isStreamer, setIsStreamer] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // 간단한 유효성 검사
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setError('올바른 이메일을 입력하세요.');
      return;
    }
    if (nickname.length < 2) {
      setError('닉네임은 2자 이상이어야 합니다.');
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    // TODO: 실제 회원가입 API 연동
    setSuccess('회원가입이 완료되었습니다! (API 연동 예정)');
  };

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
        <h2 style={{ marginBottom: 24, textAlign: 'center' }}>회원가입</h2>
        <label style={{ display: 'block', marginBottom: 8 }}>
          이메일
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          닉네임
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <input
            type="checkbox"
            checked={isStreamer}
            onChange={(e) => setIsStreamer(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          스트리머로 신청합니다
        </label>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
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
        >
          회원가입
        </button>
      </form>
    </main>
  );
}
