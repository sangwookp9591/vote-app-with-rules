import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import * as styles from './PersonalizedRecommendations.css';

interface Recommendation {
  streamerId: string;
  nickname: string;
  profileImageUrl?: string;
  score: number;
  reason: string;
}

export default function PersonalizedRecommendations() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [recommended, setRecommended] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/recommendations/personalized?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setRecommended(data.recommended || []))
      .catch(() => setError('추천 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (!userId) {
    return (
      <div style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>
        로그인하면 나만을 위한 추천을 볼 수 있습니다.
      </div>
    );
  }
  if (loading) return <div>개인화 추천 불러오는 중...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!recommended.length)
    return (
      <div style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>
        아직 추천할 스트리머가 없습니다.
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.title}>🎯 나만을 위한 추천</div>
      <div className={styles.cardList}>
        {recommended.map((rec) => (
          <div key={rec.streamerId} className={styles.card}>
            <img
              src={rec.profileImageUrl || '/images/lol.png'}
              alt={rec.nickname}
              className={styles.profileImage}
            />
            <div className={styles.nickname}>{rec.nickname}</div>
            <div className={styles.reason}>{rec.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
