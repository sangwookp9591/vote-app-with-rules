'use client';

import { useState } from 'react';
import FadeModal from './FadeModal';

export default function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main style={{ padding: 40 }}>
      <button onClick={() => setIsOpen(true)}>모달 열기</button>
      <FadeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </main>
  );
}
