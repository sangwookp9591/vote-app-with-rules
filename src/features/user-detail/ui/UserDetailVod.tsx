import Image from 'next/image';
import * as styles from './UserDetailVod.css';

interface VodItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  viewCount: number;
  createdAt: string;
  link: string;
}

interface UserDetailVodProps {
  vods: VodItem[];
}

export default function UserDetailVod({ vods }: UserDetailVodProps) {
  return (
    <section>
      <h2 className={styles.vodTitle}>VOD</h2>
      <div className={styles.vodGrid}>
        {vods.map((vod) => (
          <a
            className={styles.vodCard}
            href={vod.link}
            key={vod.id}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.thumbnailWrapper}>
              <Image
                src={vod.thumbnailUrl}
                alt={vod.title}
                className={styles.thumbnail}
                width={100}
                height={60}
              />
              <span className={styles.duration}>{vod.duration}</span>
              <span className={styles.replayLabel}>다시보기</span>
            </div>
            <div className={styles.vodInfo}>
              <div className={styles.vodTitleText}>{vod.title}</div>
              <div className={styles.vodMeta}>
                <span>조회수 {vod.viewCount.toLocaleString()}</span>
                <span>{vod.createdAt}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
