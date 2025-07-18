import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

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
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎯 나만을 위한 추천</div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
        {recommended.map((rec) => (
          <div
            key={rec.streamerId}
            style={{
              minWidth: 140,
              background: '#f7faff',
              border: '1px solid #e0e7ef',
              borderRadius: 12,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 2px 8px #e0e7ef33',
            }}
          >
            <img
              src={rec.profileImageUrl || '/images/lol.png'}
              alt={rec.nickname}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                marginBottom: 8,
                objectFit: 'cover',
              }}
            />
            <div style={{ fontWeight: 600, fontSize: 15 }}>{rec.nickname}</div>
            <div style={{ color: '#4f9fff', fontSize: 13, margin: '4px 0' }}>{rec.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
