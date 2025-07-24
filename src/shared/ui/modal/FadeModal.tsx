// components/FadeModal.tsx
'use client';

import { useState, useEffect } from 'react';
import * as styles from './modal.css';

interface FadeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FadeModal({ isOpen, onClose }: FadeModalProps) {
  const [visible, setVisible] = useState(isOpen);
  const [animation, setAnimation] = useState(styles.fadeInAnimation);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimation(styles.fadeInAnimation);
    } else {
      setAnimation(styles.fadeOutAnimation);
      // 애니메이션 끝난 후에 모달 숨김
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} ${animation}`} onClick={(e) => e.stopPropagation()}>
        <h2>페이드 인/아웃 모달</h2>
        <p>이 모달은 열리고 닫힐 때 부드럽게 나타나고 사라집니다.</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
