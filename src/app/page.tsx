import { Metadata } from 'next';
import styles from './page.module.css';
import ThemeToggle from '../shared/ui/ThemeToggle';

export const metadata: Metadata = {
  title: 'LoL SWL | 메인',
  description: 'PSW 리그오브레전드 상욱 리그 투표 시스템',
};

export default function Home() {
  return (
    <main className={styles.main}>
      <ThemeToggle />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>LoL SWL</h1>
          <p className={styles.subtitle}>PSW 최고의 리그오브레전드 상욱 리그</p>
          <div className={styles.cta}>
            <button className={styles.primaryButton}>토너먼트 참가</button>
            <button className={styles.secondaryButton}>투표하기</button>
          </div>
        </div>
      </section>

      {/* Active Tournaments Section */}
      <section className={styles.tournaments}>
        <h2 className={styles.sectionTitle}>진행중인 토너먼트</h2>
        <div className={styles.tournamentGrid}>
          {/* Tournament cards will be mapped here */}
          <div className={styles.tournamentCard}>
            <div className={styles.streamerInfo}>
              <div className={styles.streamerAvatar}></div>
              <span className={styles.streamerName}>PSW상욱</span>
            </div>
            <h3 className={styles.tournamentTitle}>제 1회 LoL SWL</h3>
            <div className={styles.tournamentStats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>참가팀</span>
                <span className={styles.statValue}>8팀</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>현재 투표수</span>
                <span className={styles.statValue}>12,345</span>
              </div>
            </div>
            <div className={styles.tournamentStatus}>
              <span className={styles.statusBadge}>투표중</span>
              <span className={styles.timeRemaining}>23:45:12 남음</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Streamers Section */}
      <section className={styles.streamers}>
        <h2 className={styles.sectionTitle}>인기 스트리머</h2>
        <div className={styles.streamerGrid}>
          {/* Streamer cards will be mapped here */}
          <div className={styles.streamerCard}>
            <div className={styles.streamerAvatar}></div>
            <div className={styles.streamerInfo}>
              <h3 className={styles.streamerName}>PSW상욱</h3>
              <p className={styles.streamerStats}>토너먼트 3회 개최</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>참여 방법</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>팀 구성</h3>
            <p className={styles.stepDescription}>5명의 팀원을 모아 팀을 구성하세요</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>토너먼트 참가</h3>
            <p className={styles.stepDescription}>원하는 PSW의 LoL SWL에 참가하세요</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>투표 참여</h3>
            <p className={styles.stepDescription}>좋아하는 팀에 투표하고 응원하세요</p>
          </div>
        </div>
      </section>
    </main>
  );
}
