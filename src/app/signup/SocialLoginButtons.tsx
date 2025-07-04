import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function SocialLoginButtons() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
      <button
        type="button"
        onClick={() => signIn('google')}
        style={{
          width: '100%',
          background: '#fff',
          color: '#222',
          border: '1px solid #eee',
          borderRadius: 6,
          padding: 10,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src="/images/button/google_logo.svg"
          alt="구글 로그인"
          width={222}
          height={49}
          style={{ marginRight: 8 }}
        />
        구글로 시작하기
      </button>
      <button
        type="button"
        onClick={() => signIn('kakao')}
        style={{
          width: '100%',
          background: '#fee500',
          color: '#222',
          border: 'none',
          borderRadius: 6,
          padding: 10,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src="/images/button/kakao_login_large_wide.png"
          alt="카카오 로그인"
          width={222}
          height={49}
          style={{ marginRight: 8 }}
        />
        카카오로 시작하기
      </button>
    </div>
  );
}
