import Link from 'next/link';
import Image from 'next/image';
import type { Stream } from '@/entities/stream/model/types';
import * as styles from './StreamList.css';
import { Dispatch, SetStateAction } from 'react';

interface StreamCardProps {
  stream: Stream;
  viewerCount: number;
  hoveredStreamKey: string | null;
  setHoveredStreamKey: Dispatch<SetStateAction<string | null>>;
}

// HLS 미리보기 영상 경로 생성 함수
const getHlsUrl = (streamKey: string) => `http://localhost:8080/live/${streamKey}.m3u8`;
const DEFAULT_THUMBNAIL = '/images/lol.png'; // 기본 썸네일

export default function StreamCard({
  stream,
  viewerCount,
  hoveredStreamKey,
  setHoveredStreamKey,
}: StreamCardProps) {
  return (
    <Link
      href={`/streams/${stream.id}`}
      className={styles.card}
      onMouseEnter={() => setHoveredStreamKey(stream.streamKey)}
      onMouseLeave={() => setHoveredStreamKey(null)}
    >
      {/* 썸네일 또는 hover 시 미리보기 */}
      <div className={styles.thumbnail}>
        {/* LIVE 뱃지 */}
        {stream.isLive && <span className={styles.liveBadge}>LIVE</span>}
        {hoveredStreamKey === stream.streamKey ? (
          // hover 시 HLS 미리보기 영상 (음소거, 자동재생, 반복)
          <video
            src={getHlsUrl(stream.streamKey)}
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 0,
              background: '#000',
            }}
            // 에러 발생 시 썸네일로 fallback 처리(간단 예시)
            onError={(e) => {
              // 비디오 로딩 실패 시 썸네일로 대체
              (e.currentTarget as HTMLVideoElement).style.display = 'none';
            }}
          />
        ) : (
          // 썸네일 이미지 (실시간 캡처)
          <Image
            // src={getThumbnailUrl(stream.streamKey)}
            src={''}
            alt="썸네일"
            fill
            className={styles.thumbnailImg}
            sizes="(max-width: 600px) 100vw, 400px"
            priority
            // 썸네일 로딩 실패 시 기본 이미지로 대체
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = DEFAULT_THUMBNAIL;
            }}
          />
        )}
      </div>
      {/* 방송 제목 */}
      <div className={styles.title}>{stream.title}</div>
      {/* --- 카테고리 뱃지 표시 (vanilla-extract 적용) --- */}
      <div className={styles.categoryBadgeRow}>
        {/* 대분류 뱃지 */}
        <span className={styles.categoryTypeBadge} title="카테고리 대분류">
          {stream.categoryType === 'GAME'
            ? '게임'
            : stream.categoryType === 'RADIO'
              ? '보이는 라디오'
              : stream.categoryType === 'SPORTS'
                ? '스포츠'
                : stream.categoryType}
        </span>
        {/* 소분류 뱃지 */}
        <span className={styles.categoryDetailBadge} title="카테고리 소분류">
          {stream.categoryDetail}
        </span>
      </div>
      {/* 스트리머/시청자수 */}
      <div className={styles.infoRow}>
        <div className={styles.profile}>
          <Image
            src={stream?.streamer?.profileImageUrl || '/images/default-profile.png'}
            alt="프로필"
            width={28}
            height={28}
            className={styles.profileImg}
          />
          <span className={styles.nickname}>{stream?.streamer?.nickname}</span>
        </div>
        <div className={styles.viewers}>
          <span role="img" aria-label="시청자">
            👁️
          </span>
          {viewerCount}
        </div>
      </div>
    </Link>
  );
}
