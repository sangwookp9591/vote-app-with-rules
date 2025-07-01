'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signupAction, type SignupFormState } from './actions';
import {
  formStyle,
  labelStyle,
  inputStyle,
  checkboxLabelStyle,
  checkboxInputStyle,
  errorStyle,
  successStyle,
  submitButtonStyle,
  profileImageUploadWrapperStyle,
  profileImageInputStyle,
  profileImageLabelStyle,
  profileImagePreviewStyle,
} from './signup.css';
import React, { useRef, useState } from 'react';
import SocialLoginButtons from './SocialLoginButtons';

export default function SignupForm() {
  const [state, formAction] = useActionState<SignupFormState, FormData>(signupAction, {});
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
    <form action={formAction} className={formStyle}>
      {/* <Image src="/globe.svg" alt="Signup" width={64} height={64} className={imageStyle} /> */}
      {/* <h2 className={titleStyle}>회원가입</h2> */}
      <div className={profileImageUploadWrapperStyle}>
        <label className={profileImageLabelStyle} htmlFor="profileImage">
          {preview ? (
            <img src={preview} alt="미리보기" className={profileImagePreviewStyle} />
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
            className={profileImageInputStyle}
          />
        </label>
      </div>
      <label className={labelStyle}>
        이메일
        <input name="email" type="email" required className={inputStyle} />
      </label>
      <label className={labelStyle}>
        닉네임
        <input name="nickname" type="text" required className={inputStyle} />
      </label>
      <label className={labelStyle}>
        비밀번호
        <input name="password" type="password" required className={inputStyle} />
      </label>
      <label className={checkboxLabelStyle}>
        <input name="isStreamer" type="checkbox" className={checkboxInputStyle} />
        스트리머로 신청합니다
      </label>
      {state?.error && <div className={errorStyle}>{state.error}</div>}
      {state?.success && <div className={successStyle}>{state.success}</div>}
      <SubmitButton />
      <SocialLoginButtons />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={submitButtonStyle} disabled={pending}>
      {pending ? '가입 중...' : '회원가입'}
    </button>
  );
}
