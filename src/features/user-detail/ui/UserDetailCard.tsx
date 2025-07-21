'use client';

import * as styles from './UserDetailCard.css';
import { UserDetail } from '../../../entities/user/detail/model/types';
import Image from 'next/image';
import StreamCard from '@/features/streams/ui/StreamCard';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserStreams } from '../../streams/api/userStreams'; // 경로 수정
import { style } from '@vanilla-extract/css';

export default function UserDetailCard({ userDetail }: { userDetail: UserDetail }) {
  const { id, nickname, profileImageUrl, followerCount } = userDetail || {};
  const [hoveredStreamKey, setHoveredStreamKey] = useState<string | null>(null);

  // userId로 해당 사용자의 방송 목록을 가져옴
  const { data: streams, isLoading } = useQuery({
    queryKey: ['userStreams', id],
    queryFn: () => fetchUserStreams(id),
    enabled: !!id,
  });

  return (
    <div className={styles.cardContainer}>
      <div className={styles.leftSection}>
        {/* 프로필, 닉네임, 뱃지 */}
        <div className={styles.userInfoCard}>
          <div className={styles.profileSection}>
            <Image
              src={profileImageUrl || '/images/default-profile.png'}
              alt="프로필"
              width={56}
              height={56}
              className={styles.profileImg}
            />
            <div>
              <div className={styles.nickname}>{nickname || id}</div>
              <div className={styles.badges}></div>
            </div>
          </div>
          {/* 방송 목록 */}
          {isLoading && <div>방송 정보를 불러오는 중...</div>}
        </div>
        <div>
          {streams && streams.length > 0
            ? streams.map((stream) => (
                <StreamCard
                  key={stream.id}
                  stream={stream}
                  viewerCount={stream.viewers}
                  hoveredStreamKey={hoveredStreamKey}
                  setHoveredStreamKey={setHoveredStreamKey}
                />
              ))
            : !isLoading && <div>진행한 방송이 없습니다.</div>}
        </div>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.userBannerCard}>
          {/* 배너 */}
          <div className={styles.banner}>
            <Image
              src={'/images/attactontitan.jpg'}
              alt="배너"
              fill // 부모를 꽉 채움
              className={styles.bannerImg}
              priority
              sizes="100vw"
            />
          </div>
          {/* SNS 링크 */}
          <div className={styles.snsLinks}></div>
        </div>
        {/* 통계 */}
        {/* 소개글 */}
        <div className={styles.bottomSection}>
          <div className={styles.description}>{'description'}</div>
          <div className={styles.stats}>
            <span>⭐ {followerCount}</span>
            <span>👍 {32}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
