'use client';

import { useFormStatus } from 'react-dom';
import * as styles from './UserProfileEditForm.css';
import Image from 'next/image';
import { useActionState, useRef, useState } from 'react';
import { updateProfileAction, UpdateProfileState } from './actions';

export default function UserProfileEditForm() {
  const [state, formAction] = useActionState<UpdateProfileState, FormData>(updateProfileAction, {});
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }

  return (
    <form action={formAction} className={styles.formStyle}>
      {/* <Image src="/globe.svg" alt="Signup" width={64} height={64} className={imageStyle} /> */}
      {/* <h2 className={titleStyle}>회원가입</h2> */}
      <div className={styles.profileImageUploadWrapperStyle}>
        <label className={styles.profileImageLabelStyle} htmlFor="profileImage">
          {preview ? (
            <Image
              src={preview}
              alt="미리보기"
              className={styles.profileImagePreviewStyle}
              width={80}
              height={80}
            />
          ) : (
            <span style={{ color: '#aaa', fontSize: 14 }}></span>
          )}
          <input
            id="profileImage"
            name="profileImage"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className={styles.profileImageInputStyle}
          />
        </label>
      </div>
      <label className={styles.labelStyle}>
        이메일
        <input name="email" type="email" required className={styles.inputStyle} />
      </label>
      <label className={styles.labelStyle}>
        닉네임
        <input name="nickname" type="text" required className={styles.inputStyle} />
      </label>
      <label className={styles.labelStyle}>
        비밀번호
        <input name="password" type="password" required className={styles.inputStyle} />
      </label>
      <label className={styles.checkboxLabelStyle}>
        <input name="isStreamer" type="checkbox" className={styles.checkboxInputStyle} />
        스트리머로 신청합니다
      </label>
      {state?.error && <div className={styles.errorStyle}>{state.error}</div>}
      {state?.success && <div className={styles.successStyle}>{state.success}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.submitButtonStyle} disabled={pending}>
      {pending ? '수정 중...' : '수정'}
    </button>
  );
}
