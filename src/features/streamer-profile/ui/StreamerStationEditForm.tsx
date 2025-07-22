'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import * as styles from './StreamerStationEditForm.css';
import { fetchMyStation, updateMyStation } from '../api/streamerProfile';
import Image from 'next/image';

type FormState = {
  message?: string;
  error?: string;
  description?: string;
  bannerImageUrl?: string;
};

// 배너 이미지 업로드 API 호출
async function uploadBannerImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/uploads/banner', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('배너 이미지 업로드 실패');
  const data = await res.json();
  return data.url; // 업로드된 이미지의 URL
}

// form action 함수: 서버/클라이언트에서 폼 제출 처리
async function formAction(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const description = formData.get('description') as string;
    let bannerImageUrl = formData.get('bannerImageUrl') as string | undefined;
    // 파일이 새로 선택된 경우 업로드
    const file = formData.get('bannerFile') as File;
    if (file && file.size > 0) {
      bannerImageUrl = await uploadBannerImage(file);
    }
    await updateMyStation({ description, bannerImageUrl });
    return { message: '방송국 정보가 저장되었습니다!', description, bannerImageUrl };
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={styles.submitButton}>
      {pending ? '저장 중...' : '저장'}
    </button>
  );
}

export default function StreamerStationEditForm() {
  const [state, formActionDispatch] = useFormState<FormState, FormData>(formAction, {});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [bannerPreview, setBannerPreview] = useState<string | undefined>(undefined);

  // 최초 로딩 시 description, bannerImageUrl 불러오기
  useEffect(() => {
    fetchMyStation()
      .then((data) => {
        if (textareaRef.current) {
          textareaRef.current.value = data.description || '';
        }
        setBannerPreview(data.bannerImageUrl);
      })
      .catch(() => {});
  }, []);

  // 파일 선택 시 미리보기
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form action={formActionDispatch} style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>방송국 정보 수정</h2>
      {state.error && <div style={{ color: 'red', marginBottom: 12 }}>{state.error}</div>}
      {state.message && <div style={{ color: 'green', marginBottom: 12 }}>{state.message}</div>}

      {/* 배너 이미지 미리보기 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>배너 이미지</div>

        <label className={styles.bannerImageStyle} htmlFor="bannerFile">
          {bannerPreview && (
            <Image
              src={bannerPreview}
              alt="배너 미리보기"
              className={styles.bannerPreview}
              fill // 부모를 꽉 채움
              priority
              sizes="100vw"
            />
          )}
          <input
            type="file"
            id="bannerFile"
            name="bannerFile"
            className={styles.bannerImageInput}
            accept="image/*"
            onChange={handleBannerChange}
          />
        </label>
        {/* 기존 이미지 URL도 hidden으로 전달 */}
        <input type="hidden" name="bannerImageUrl" value={bannerPreview || ''} />
      </div>

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
