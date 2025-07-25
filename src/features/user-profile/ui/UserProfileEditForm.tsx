'use client';

import { useFormStatus } from 'react-dom';
import * as styles from './UserProfileEditForm.css';
import Image from 'next/image';
import { useActionState, useRef, useState } from 'react';
import { User } from '@/entities/user';
import { updateMyProfile, UpdateProfileState } from '../api/userProfile';

export default function UserProfileEditForm({ user }: { user: User }) {
  const [state, formAction] = useActionState<UpdateProfileState, FormData>(updateMyProfile, {});
  const [preview, setPreview] = useState<string | undefined>(user?.profileImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ email: user?.email, nickname: user?.nickname });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(undefined);
    }
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <form action={formAction} className={styles.formStyle}>
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
        <input
          name="email"
          type="email"
          required
          className={styles.inputStyle}
          disabled={true}
          value={formData?.email}
        />
      </label>
      <label className={styles.labelStyle}>
        닉네임
        <input
          name="nickname"
          type="text"
          required
          onChange={handleOnChange}
          className={styles.inputStyle}
          value={formData?.nickname}
        />
      </label>
      <input name="userId" type="hidden" value={user?.id} />
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
