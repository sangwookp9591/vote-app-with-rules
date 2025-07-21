'use client';

import { useState, useRef, useEffect } from 'react';
import * as styles from './Navbar.css';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/features/user/api/user';

interface NavbarDropdownProps {
  userId: string | undefined;
}

export default function NavbarDropdown({ userId }: NavbarDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId || ''),
    enabled: !!userId,
  });

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className={styles.dropdownWrapper} ref={dropdownRef}>
      <button
        className={styles.dropdownButton}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        내 메뉴 ▼
      </button>
      {open && (
        <div className={styles.dropdownMenu}>
          {user?.streamer && (
            <Link href="/my/station/edit" className={styles.dropdownItem}>
              내 방송국 수정
            </Link>
          )}
          <Link href="/my/profile/edit" className={styles.dropdownItem}>
            내 정보 수정
          </Link>
        </div>
      )}
    </div>
  );
}
