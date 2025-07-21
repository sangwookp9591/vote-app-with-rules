'use client';

import { useEffect, useState } from 'react';
import { fetchPopularStreamers } from '@/features/recommendation/api/popularStreamers';
import type { PopularStreamer } from '@/entities/streamer/model/types';
import * as styles from './PopularStreamers.css';
import Image from 'next/image';
import Link from 'next/link';

interface PopularStreamersProps {
  limit?: number; // 최대 노출 인원 (기본: 전체)
}

/**
 * 인기 스트리머 추천 섹션 (가로 스크롤 카드형)
 * - 최근 1주일간 시청자/팔로워/투표 기준 랭킹
 * - 1~3위 컬러 강조, 클릭 시 방송방 이동
 * - limit: 최대 노출 인원(사이드바 등에서 활용)
 */
export default function PopularStreamers({ limit }: PopularStreamersProps) {
  const [streamers, setStreamers] = useState<PopularStreamer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPopularStreamers()
      .then(setStreamers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const displayList = limit ? streamers.slice(0, limit) : streamers;

  if (loading) return <div className={styles.section}>인기 스트리머 불러오는 중...</div>;
  if (error)
    return (
      <div className={styles.section} style={{ color: 'red' }}>
        {error}
      </div>
    );
  if (!displayList.length)
    return <div className={styles.section}>최근 1주일간 인기 스트리머가 없습니다.</div>;

  return (
    <section className={styles.section}>
      <div className={styles.title}>
        <span role="img" aria-label="불꽃">
          🔥
        </span>{' '}
        인기 스트리머
      </div>
      <div className={styles.scrollRow}>
        {displayList.map((s, i) => (
          <Link
            key={s.id}
            href={`/user/${s.id}`}
            className={styles.card}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {/* 랭킹 순위 뱃지 */}
            <span className={i < 3 ? `${styles.rankBadge} ${styles.topRank}` : styles.rankBadge}>
              {i + 1}위
            </span>
            {/* 프로필 이미지 */}
            <Image
              src={s.profileImageUrl || '/images/default-profile.png'}
              alt="프로필"
              width={56}
              height={56}
              className={styles.profileImg}
            />
            {/* 닉네임 */}
            <div className={styles.nickname}>{s.nickname}</div>
            {/* 통계 */}
            <div className={styles.stats}>
              <span title="최근 1주일간 시청자 수">👁️ {s.viewerCount}</span>
              <span title="최근 1주일간 팔로워 수">🤝 {s.followerCount}</span>
              <span title="최근 1주일간 투표 수">👍 {s.voteCount}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
