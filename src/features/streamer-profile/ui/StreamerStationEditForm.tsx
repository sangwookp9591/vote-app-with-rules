'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { fetchMyStation, updateMyStation } from '../api/streamerProfile';

type FormState = {
  message?: string;
  error?: string;
  description?: string;
};

// form action 함수: 서버/클라이언트에서 폼 제출 처리
async function formAction(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const description = formData.get('description') as string;
    await updateMyStation({ description });
    return { message: '방송국 정보가 저장되었습니다!', description };
  } catch (e: unknown) {
    if (
      e &&
      typeof e === 'object' &&
      'message' in e &&
      typeof (e as { message?: string }).message === 'string'
    ) {
      return { error: (e as { message?: string }).message! };
    }
    return { error: '저장 실패' };
  }
}

// 제출 버튼 (로딩 상태 표시)
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        background: '#4a90e2',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        padding: '10px 24px',
        fontWeight: 700,
        fontSize: 16,
        cursor: 'pointer',
      }}
    >
      {pending ? '저장 중...' : '저장'}
    </button>
  );
}

export default function StreamerStationEditForm() {
  const [state, formActionDispatch] = useFormState<FormState, FormData>(formAction, {});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 최초 로딩 시 description 불러오기
  useEffect(() => {
    fetchMyStation()
      .then((data) => {
        if (textareaRef.current) {
          textareaRef.current.value = data.description || '';
        }
      })
      .catch(() => {});
  }, []);

  return (
    <form action={formActionDispatch} style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>방송국 소개글 수정</h2>
      {state.error && <div style={{ color: 'red', marginBottom: 12 }}>{state.error}</div>}
      {state.message && <div style={{ color: 'green', marginBottom: 12 }}>{state.message}</div>}
      <textarea
        name="description"
        ref={textareaRef}
        rows={5}
        style={{
          width: '100%',
          fontSize: 16,
          padding: 12,
          borderRadius: 8,
          border: '1px solid #ccc',
          marginBottom: 16,
        }}
        placeholder="방송국 소개글을 입력하세요"
        defaultValue={state.description}
      />
      <SubmitButton />
    </form>
  );
}
