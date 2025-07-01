import styles from './Navbar.module.css';
import ThemeToggle from '../../shared/ui/ThemeToggle';
import Link from 'next/link';

interface NavbarProps {
  onSidebarToggle?: () => void;
  sidebarOpen?: boolean;
}

export default function Navbar({ onSidebarToggle, sidebarOpen }: NavbarProps) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        {onSidebarToggle && (
          <button
            className={styles.sidebarToggle}
            onClick={onSidebarToggle}
            aria-label={sidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
            style={{ marginRight: 12 }}
          >
            ≡
          </button>
        )}
        <span className={styles.logo}>LoL SWL</span>
        <ul className={styles.menu}>
          <li>
            <a href="#">홈</a>
          </li>
          <li>
            <a href="#">토너먼트</a>
          </li>
          <li>
            <a href="#">인기 스트리머</a>
          </li>
        </ul>
      </div>
      <div className={styles.right}>
        <button className={styles.iconButton} aria-label="알림">
          <span role="img" aria-label="알림">
            🔔
          </span>
        </button>
        <Link href={'/login'} className={styles.authButton}>
          로그인
        </Link>
        <Link href={'/signup'} className={styles.authButton}>
          회원가입
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
