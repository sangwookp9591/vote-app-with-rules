import { signIn } from 'next-auth/react';

export default function SocialLoginButtons() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
      <button
        type="button"
        onClick={() => signIn('google')}
        style={{
          background: '#fff',
          color: '#222',
          border: '1px solid #eee',
          borderRadius: 6,
          padding: 10,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <img
          src="/google.svg"
          alt="Google"
          style={{ width: 20, height: 20, verticalAlign: 'middle', marginRight: 8 }}
        />
        구글로 시작하기
      </button>
      <button
        type="button"
        onClick={() => signIn('kakao')}
        style={{
          background: '#fee500',
          color: '#222',
          border: 'none',
          borderRadius: 6,
          padding: 10,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <img
          src="/kakao.svg"
          alt="Kakao"
          style={{ width: 20, height: 20, verticalAlign: 'middle', marginRight: 8 }}
        />
        카카오로 시작하기
      </button>
    </div>
  );
}
