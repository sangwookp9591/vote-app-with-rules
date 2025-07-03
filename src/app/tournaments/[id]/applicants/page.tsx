'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import * as styles from './applicants.css';

interface Applicant {
  id: string;
  user: {
    id: string;
    email: string;
    nickname: string;
    profileImageUrl?: string;
  };
  gameData: {
    position?: string;
    tier?: string;
    [key: string]: unknown;
  };
  createdAt: string;
}

const LOL_TIERS = [
  { value: 'IRON', label: 'IRON', icon: '/images/iron.webp' },
  { value: 'BRONZE', label: 'BRONZE', icon: '/images/bronze.webp' },
  { value: 'SILVER', label: 'SILVER', icon: '/images/silver.webp' },
  { value: 'GOLD', label: 'GOLD', icon: '/images/gold.webp' },
  { value: 'PLATINUM', label: 'PLATINUM', icon: '/images/platinum.webp' },
  { value: 'EMERALD', label: 'EMERALD', icon: '/images/emerald.webp' },
  { value: 'DIAMOND', label: 'DIAMOND', icon: '/images/diamond.webp' },
  { value: 'MASTER', label: 'MASTER', icon: '/images/master.webp' },
  { value: 'GRANDMASTER', label: 'GRANDMASTER', icon: '/images/grandmaster.webp' },
  { value: 'CHALLENGER', label: 'CHALLENGER', icon: '/images/challenger.webp' },
];

function getTierInfo(tier?: string) {
  return LOL_TIERS.find((t) => t.value === tier) || null;
}

export default function ApplicantsPage() {
  const params = useParams();
  const tournamentId = params?.id as string;
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filtered, setFiltered] = useState<Applicant[]>([]);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('');
  const [tier, setTier] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchApplicants() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/tournaments/${tournamentId}/applications`);
        if (!res.ok) throw new Error('신청자 목록 조회 실패');
        const data = await res.json();
        setApplicants(data);
        setFiltered(data);
      } catch (e) {
        if (e instanceof Error) setError(e.message);
        else setError('알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    }
    if (tournamentId) fetchApplicants();
  }, [tournamentId]);

  useEffect(() => {
    let result = applicants;
    if (search) {
      result = result.filter((a) => a.user.nickname.toLowerCase().includes(search.toLowerCase()));
    }
    if (position) {
      result = result.filter((a) => a.gameData.position === position);
    }
    if (tier) {
      result = result.filter((a) => a.gameData.tier === tier);
    }
    setFiltered(result);
  }, [search, position, tier, applicants]);

  const changePositionToImg = (pos: string) => {
    if (pos === 'ADC') return `/svg/bot.svg`;
    else if (pos === 'SPT') return `/svg/spt.svg`;
    else if (pos === 'MID') return `/svg/mid.svg`;
    else if (pos === 'JDG') return `/svg/jdg.svg`;
    else return `/svg/top.svg`;
  };

  // 포지션/티어 옵션 추출 (중복 제거)
  const positionOptions = Array.from(
    new Set(applicants.map((a) => a.gameData.position).filter(Boolean)),
  );
  const tierOptions = Array.from(new Set(applicants.map((a) => a.gameData.tier).filter(Boolean)));

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>신청자 목록</h1>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="닉네임 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e0e7ef' }}
        />
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          style={{ padding: 8, borderRadius: 8, border: '1px solid #e0e7ef' }}
        >
          <option value="">포지션 전체</option>
          {positionOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          style={{ padding: 8, borderRadius: 8, border: '1px solid #e0e7ef' }}
        >
          <option value="">티어 전체</option>
          {tierOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div style={{ color: '#ff4f9f' }}>{error}</div>
      ) : filtered.length === 0 ? (
        <div>신청자가 없습니다.</div>
      ) : (
        <div className={styles.applicantsGrid}>
          {filtered.map((a) => (
            <div key={a.id} className={styles.applicantCard}>
              <div className={styles.avatar}>
                {a.user.profileImageUrl ? (
                  <img
                    src={a.user.profileImageUrl}
                    alt={a.user.nickname}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  a.user.nickname.charAt(0).toUpperCase()
                )}
              </div>
              <div className={styles.nickname}>{a.user.nickname}</div>
              <div className={styles.positionPill}>
                <span className={styles.position}>{'포지션'}</span>
                <img
                  src={changePositionToImg(a.gameData.position || '-')}
                  alt={a.gameData.position}
                  style={{ width: 24, height: 24, objectFit: 'contain', marginRight: 2 }}
                />
              </div>
              <div className={styles.tierPill}>
                {getTierInfo(a.gameData.tier)?.icon && (
                  <img
                    src={getTierInfo(a.gameData.tier)?.icon}
                    alt={a.gameData.tier}
                    style={{ width: 24, height: 24, objectFit: 'contain', marginRight: 2 }}
                  />
                )}
                <span className={styles.tier}>{a.gameData.tier || '-'}</span>
              </div>
              <div className={styles.createdAt}>
                {new Date(a.createdAt).toLocaleString('ko-KR')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
