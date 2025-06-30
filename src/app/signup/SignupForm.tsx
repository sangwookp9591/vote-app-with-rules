'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signupAction, type SignupFormState } from './actions';

export default function SignupForm() {
  const [state, formAction] = useFormState<SignupFormState, FormData>(signupAction, {});

  return (
    <form
      action={formAction}
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
          name="email"
          type="email"
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
          name="nickname"
          type="text"
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
          name="password"
          type="password"
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
        <input name="isStreamer" type="checkbox" style={{ marginRight: 8 }} />
        스트리머로 신청합니다
      </label>
      {state?.error && <div style={{ color: 'red', marginBottom: 12 }}>{state.error}</div>}
      {state?.success && <div style={{ color: 'green', marginBottom: 12 }}>{state.success}</div>}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
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
      disabled={pending}
    >
      {pending ? '가입 중...' : '회원가입'}
    </button>
  );
}
