'use client';

import * as styles from './UserDetailCard.css';
import { UserDetail } from '../../../entities/user/detail/model/types';
import Image from 'next/image';
import StreamCard from '@/features/streams/ui/StreamCard';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUserStreams } from '../../streams/api/userStreams'; // 경로 수정
import Link from 'next/link';
import { FaInstagram, FaYoutube, FaFacebook, FaStar } from 'react-icons/fa';
import { fetchCheckFollower, fetchFollowToggle } from '@/features/follow/api/follow';
import { useSession } from 'next-auth/react';

export default function UserDetailCard({ userDetail }: { userDetail: UserDetail }) {
  const queryClient = useQueryClient();
  const { id, nickname, profileImageUrl, followerCount, streamer } = userDetail || {};

  console.log('streamer : ', streamer);
  const [hoveredStreamKey, setHoveredStreamKey] = useState<string | null>(null);
  const [followerCountState, setFollowerCountState] = useState(followerCount || 0);
  const [isFollower, setIsFollower] = useState(false);
  const { data: session } = useSession();
  // userId로 해당 사용자의 방송 목록을 가져옴
  const { data: streams, isLoading } = useQuery({
    queryKey: ['userStreams', id],
    queryFn: () => fetchUserStreams(id),
    enabled: !!id,
  });

  const { data: checkFollow } = useQuery({
    queryKey: ['checkFollow', session?.user?.id, streamer?.id],
    queryFn: () => fetchCheckFollower({ userId: session?.user?.id, streamerId: id }),
    enabled: !!session?.user?.id && !!streamer?.id,
  });

  useEffect(() => {
    if (checkFollow?.isFollower) {
      setIsFollower(checkFollow?.isFollower);
    }
  }, [checkFollow?.isFollower]);

  const followToggleMutation = useMutation({
    mutationFn: () => fetchFollowToggle({ userId: session?.user?.id, streamerId: id }),
    onSuccess: () => {
      //토글 후 팔로우 상태를 갱신
      queryClient.invalidateQueries({
        queryKey: ['checkFollow', session?.user?.id, id],
      });
    },
    onError: () => {
      console.log('팔로우 상태 변경에 실패했습니다.');
    },
  });

  const handleToggleFollow = () => {
    if (!session?.user?.id || !id) {
      console.log('로그인 필요');
      return;
    }
    console.log('isFollower : ', isFollower);
    if (isFollower) {
      setFollowerCountState((prev) => (prev === 0 ? 0 : prev - 1));
      setIsFollower(false);
    } else {
      setFollowerCountState((prev) => prev + 1);
      setIsFollower(true);
    }
    followToggleMutation.mutate();
  };

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
              src={streamer?.bannerImageUrl || '/images/attactontitan.jpg'}
              alt="배너"
              fill // 부모를 꽉 채움
              className={styles.bannerImg}
              priority
              sizes="100vw"
            />
          </div>
          {/* SNS 링크 */}
          <div className={styles.snsLinks}>
            {streamer?.snsLinks?.map((sns) => {
              console.log('sns : ', sns);
              return (
                <Link href={sns?.url} key={sns?.id}>
                  <div className={styles.snsIcon}>
                    {sns?.type === 'INSTA' && (
                      <FaInstagram size={30} color="#FFFFFF" fill="#FFFFFF" />
                    )}
                    {sns?.type === 'YOUTUBE' && (
                      <FaYoutube size={30} color="#FFFFFF" fill="#FFFFFF" />
                    )}
                    {sns?.type === 'FACEBOOK' && (
                      <FaFacebook size={30} color="#FFFFFF" fill="#FFFFFF" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        {/* 통계 */}
        {/* 소개글 */}
        <div className={styles.bottomSection}>
          <div className={styles.description}>{streamer?.description || '소개글이 없습니다.'}</div>
          <div className={styles.stats} onClick={handleToggleFollow}>
            <FaStar
              className={styles.starIcon}
              size={25}
              color="inherit"
              fill={isFollower ? '#FFF099' : '#FFFFFF'}
            />
            <div
              style={{
                fontSize: '1rem',
              }}
            >
              {followerCountState}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
