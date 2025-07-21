import * as styles from './UserDetailCard.css';
import { UserDetail } from '../../../entities/user/detail/model/types';
import Image from 'next/image';

export default function UserDetailCard({ userDetail }: { userDetail: UserDetail }) {
  const {
    id,
    nickname,
    profileImageUrl,
    // badges,
    followerCount,
    // likeCount,
    // description,
    // bannerImageUrl,
    // snsLinks,
  } = userDetail || {};

  return (
    <div className={styles.userDetailCard}>
      {/* 배너 */}
      <div className={styles.banner}>
        {/* <img src={bannerImageUrl} alt="배너" className={styles.bannerImg} /> */}
        <Image
          src={profileImageUrl || '/images/default-profile.png'}
          alt="프로필"
          width={56}
          height={56}
          className={styles.bannerImg}
        />
      </div>
      {/* 프로필, 닉네임, 뱃지 */}
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
          <div className={styles.badges}>
            {/* {badges?.map((badge) => (
              <span className={styles.badge({ type: badge.type })} key={badge.type}>
                {badge.label}
              </span>
            ))} */}
          </div>
        </div>
      </div>
      {/* 통계 */}
      <div className={styles.stats}>
        <span>⭐ {followerCount}</span>
        <span>👍 {32}</span>
        {/* like count */}
      </div>
      {/* 소개글 */}
      <div className={styles.description}>{'description'}</div>
      {/* SNS 링크 */}
      <div className={styles.snsLinks}>
        {/* {snsLinks?.map((link) => (
          <a href={link.url} target="_blank" rel="noopener noreferrer" key={link.type}>
            <img src={link.icon} alt={link.type} className={styles.snsIcon} />
          </a>
        ))} */}
      </div>
    </div>
  );
}
