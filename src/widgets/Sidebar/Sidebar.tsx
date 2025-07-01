'use client';

import styles from './Sidebar.module.css';

const menu = [
  { label: '홈', href: '#' },
  { label: '토너먼트', href: '/tournaments' },
  { label: '인기 스트리머', href: '#' },
  { label: '팀 관리', href: '#' },
];

export default function Sidebar({ open }: { open: boolean }) {
  if (!open) return null;

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.logo}>LoL SWL</div>
        <nav className={styles.menu}>
          {menu.map((item) => (
            <a key={item.label} href={item.href} className={styles.menuItem}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className={styles.bottom}>
        <button className={styles.utilButton}>설정</button>
        <button className={styles.utilButton}>로그아웃</button>
      </div>
    </aside>
  );
}
