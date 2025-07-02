'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import * as styles from '../apply.css';
import type { CSSProperties, FormEvent, ChangeEvent } from 'react';

const LOL_TIERS = [
  { value: 'IRON', label: 'IRON', icon: '/public/images/iron.webp' },
  { value: 'BRONZE', label: 'BRONZE', icon: '/public/images/bronze.webp' },
  { value: 'SILVER', label: 'SILVER', icon: '/public/images/silver.webp' },
  { value: 'GOLD', label: 'GOLD', icon: '/public/images/gold.webp' },
  { value: 'PLATINUM', label: 'PLATINUM', icon: '/public/images/platinum.webp' },
  { value: 'EMERALD', label: 'EMERALD', icon: '/public/images/emerald.webp' },
  { value: 'DIAMOND', label: 'DIAMOND', icon: '/public/images/diamond.webp' },
  { value: 'MASTER', label: 'MASTER', icon: '/public/images/master.webp' },
  { value: 'GRANDMASTER', label: 'GRANDMASTER', icon: '/public/images/grandmaster.webp' },
  { value: 'CHALLENGER', label: 'CHALLENGER', icon: '/public/images/challenger.webp' },
];
const LOL_POSITIONS = [
  { value: 'TOP', label: '탑', icon: '/public/svg/top.svg' },
  { value: 'JUNGLE', label: '정글', icon: '/public/svg/jgl.svg' },
  { value: 'MID', label: '미드', icon: '/public/svg/mid.svg' },
  { value: 'ADC', label: '원딜', icon: '/public/svg/bot.svg' },
  { value: 'SUPPORT', label: '서폿', icon: '/public/svg/spt.svg' },
];

interface Tournament {
  id: string;
  gameType: string;
  // ... add more fields as needed
}

interface FormState {
  nickname?: string;
  tier?: string;
  rank?: number;
  position?: string;
  mainChampions?: string[];
}

const scrollSelectorColumn: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  overflowY: 'auto',
  maxHeight: 320,
  paddingRight: 4,
  marginBottom: 8,
  scrollbarWidth: 'thin',
};

export default function TournamentApplyPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const tournamentId = params?.id as string;
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormState>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [championInput, setChampionInput] = useState('');
  const [championTags, setChampionTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchTournament() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/tournaments/${tournamentId}`);
        if (!res.ok) throw new Error('토너먼트 정보 조회 실패');
        const data = await res.json();
        setTournament(data);
      } catch (e: unknown) {
        if (e instanceof Error) setError(e.message);
        else setError('알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    }
    fetchTournament();
  }, [tournamentId]);

  useEffect(() => {
    if (form.mainChampions) {
      setChampionTags(
        Array.isArray(form.mainChampions)
          ? form.mainChampions
          : String(form.mainChampions)
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
      );
    }
  }, [form.mainChampions]);

  const handleChange = (field: keyof FormState, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user?.id, gameData: form }),
      });
      if (!res.ok) throw new Error('신청 실패');
      setSuccess('신청이 완료되었습니다!');
      setTimeout(() => router.push(`/tournaments/${tournamentId}`), 1200);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError('알 수 없는 오류');
    } finally {
      setSubmitting(false);
    }
  };

  const addChampionTag = () => {
    const value = championInput.trim();
    if (value && !championTags.includes(value)) {
      const next = [...championTags, value];
      setChampionTags(next);
      setForm((f) => ({ ...f, mainChampions: next }));
      setChampionInput('');
    }
  };
  const removeChampionTag = (tag: string) => {
    const next = championTags.filter((c) => c !== tag);
    setChampionTags(next);
    setForm((f) => ({ ...f, mainChampions: next }));
  };

  // 게임별 폼 렌더링
  const renderGameForm = () => {
    if (!tournament) return null;
    if (tournament.gameType === 'LOL') {
      return (
        <form
          className={styles.formCard}
          style={{
            boxShadow: '0 8px 32px rgba(79,159,255,0.10)',
            background: 'rgba(255,255,255,0.95)',
            border: 'none',
            padding: '2.5rem 2rem',
            maxWidth: 540,
          }}
          onSubmit={handleSubmit}
        >
          <div
            className={styles.formTitle}
            style={{ fontSize: '2rem', marginBottom: 32, letterSpacing: -1 }}
          >
            토너먼트 참가 신청
          </div>
          <div style={{ marginBottom: 28 }}>
            <div
              className={styles.fieldLabel}
              style={{
                fontSize: '1.1rem',
                marginBottom: 10,
                letterSpacing: -0.5,
                color: '#4f9fff',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <svg
                width="20"
                height="20"
                fill="#4f9fff"
                viewBox="0 0 20 20"
                style={{ marginRight: 4 }}
              >
                <circle cx="10" cy="7" r="4" />
                <path d="M2 18c0-3.313 3.134-6 7-6s7 2.687 7 6" />
              </svg>
              LoL 닉네임
            </div>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                placeholder="소환사명을 입력하세요"
                value={form.nickname || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange('nickname', e.target.value)
                }
                style={{
                  width: '100%',
                  fontSize: '1.15rem',
                  padding: '1rem 1.2rem 1rem 2.8rem',
                  borderRadius: 12,
                  border: '1.5px solid #e0e7ef',
                  background: '#f8fbff',
                  boxShadow: '0 2px 8px rgba(79,159,255,0.07)',
                  outline: 'none',
                  transition: 'border 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => (e.target.style.border = '2px solid #4f9fff')}
                onBlur={(e) => (e.target.style.border = '1.5px solid #e0e7ef')}
              />
              <svg
                width="22"
                height="22"
                fill="#b3d4ff"
                viewBox="0 0 20 20"
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                <circle cx="10" cy="7" r="4" />
                <path d="M2 18c0-3.313 3.134-6 7-6s7 2.687 7 6" />
              </svg>
            </div>
          </div>
          <div style={{ marginBottom: 28 }}>
            <div className={styles.fieldLabel} style={{ fontSize: '1.1rem', marginBottom: 10 }}>
              티어
            </div>
            <div style={scrollSelectorColumn}>
              {LOL_TIERS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className={styles.iconButton}
                  data-active={form.tier === t.value}
                  style={{
                    minWidth: 90,
                    flexDirection: 'row',
                    alignItems: 'center',
                    border: form.tier === t.value ? '2.5px solid #4f9fff' : '1.5px solid #e0e7ef',
                    background: form.tier === t.value ? 'rgba(79,159,255,0.10)' : '#f8fbff',
                    boxShadow: form.tier === t.value ? '0 2px 8px rgba(79,159,255,0.10)' : 'none',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: form.tier === t.value ? '#4f9fff' : '#222',
                    transition: 'all 0.15s',
                    height: 54,
                    justifyContent: 'flex-start',
                    gap: 14,
                    paddingLeft: 12,
                  }}
                  onClick={() => handleChange('tier', t.value)}
                >
                  <img
                    src={t.icon.replace('/public', '')}
                    alt={t.label}
                    style={{ width: 32, height: 32, marginRight: 0 }}
                  />
                  <span style={{ fontWeight: 700, fontSize: '1.08rem' }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 28 }}>
            {form.tier === 'MASTER' || form.tier === 'GRANDMASTER' || form.tier === 'CHALLENGER' ? (
              <>
                <div
                  className={styles.fieldLabel}
                  style={{ fontSize: '1.1rem', marginBottom: 10, color: '#ff4f9f' }}
                >
                  점수
                </div>
                <input
                  type="number"
                  min={0}
                  max={2000}
                  placeholder="점수 입력"
                  style={{
                    width: 140,
                    fontSize: '1.1rem',
                    padding: '0.8rem 1.2rem',
                    borderRadius: 10,
                    border: '1.5px solid #e0e7ef',
                    background: '#f8fbff',
                  }}
                  value={form.rank || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange('rank', Number(e.target.value))
                  }
                />
              </>
            ) : (
              <>
                <div className={styles.fieldLabel} style={{ fontSize: '1.1rem', marginBottom: 10 }}>
                  랭크(1~4)
                </div>
                <input
                  type="number"
                  min={1}
                  max={4}
                  style={{
                    width: 80,
                    fontSize: '1.1rem',
                    padding: '0.8rem 1.2rem',
                    borderRadius: 10,
                    border: '1.5px solid #e0e7ef',
                    background: '#f8fbff',
                  }}
                  value={form.rank || 1}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange('rank', Number(e.target.value))
                  }
                />
              </>
            )}
          </div>
          <div style={{ marginBottom: 28 }}>
            <div className={styles.fieldLabel} style={{ fontSize: '1.1rem', marginBottom: 10 }}>
              포지션
            </div>
            <div style={scrollSelectorColumn}>
              {LOL_POSITIONS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={styles.iconButton}
                  data-active={form.position === p.value}
                  style={{
                    minWidth: 90,
                    flexDirection: 'row',
                    alignItems: 'center',
                    border:
                      form.position === p.value ? '2.5px solid #ff4f9f' : '1.5px solid #e0e7ef',
                    background: form.position === p.value ? 'rgba(255,79,159,0.10)' : '#f8fbff',
                    boxShadow:
                      form.position === p.value ? '0 2px 8px rgba(255,79,159,0.10)' : 'none',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: form.position === p.value ? '#ff4f9f' : '#222',
                    transition: 'all 0.15s',
                    height: 54,
                    justifyContent: 'flex-start',
                    gap: 14,
                    paddingLeft: 12,
                  }}
                  onClick={() => handleChange('position', p.value)}
                >
                  <img
                    src={p.icon.replace('/public', '')}
                    alt={p.label}
                    style={{ width: 32, height: 32, marginRight: 0 }}
                  />
                  <span style={{ fontWeight: 700, fontSize: '1.08rem' }}>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 28 }}>
            <div className={styles.fieldLabel} style={{ fontSize: '1.1rem', marginBottom: 10 }}>
              주요 챔피언
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                alignItems: 'center',
                background: '#f8fbff',
                borderRadius: 10,
                padding: '10px 12px',
                border: '1.5px solid #e0e7ef',
              }}
            >
              {championTags.map((tag) => (
                <span
                  key={tag}
                  className={styles.chip}
                  style={{
                    background: 'linear-gradient(90deg,#4f9fff22,#ff4f9f22)',
                    color: '#4f9fff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    padding: '6px 16px',
                    borderRadius: 16,
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    className={styles.chipRemove}
                    style={{ color: '#ff4f9f', fontWeight: 900, fontSize: '1.2em', marginLeft: 8 }}
                    onClick={() => removeChampionTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                placeholder="주요 챔피언 추가"
                value={championInput}
                style={{
                  minWidth: 120,
                  fontSize: '1.05rem',
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setChampionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addChampionTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={addChampionTag}
                className={styles.iconButton}
                style={{
                  border: '1.5px solid #4f9fff',
                  background: '#fff',
                  color: '#4f9fff',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  borderRadius: 10,
                  padding: '8px 18px',
                  marginLeft: 4,
                }}
              >
                추가
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            style={{
              fontSize: '1.25rem',
              padding: '1.3rem 0',
              borderRadius: 16,
              marginTop: 40,
              boxShadow: '0 4px 18px rgba(79,159,255,0.13)',
              width: '100%',
              fontWeight: 800,
              letterSpacing: -1,
            }}
            disabled={submitting}
          >
            {submitting ? '신청 중...' : '신청하기'}
          </button>
          {error && <div style={{ color: '#ff4f9f', marginTop: 18, fontWeight: 700 }}>{error}</div>}
          {success && (
            <div style={{ color: '#4f9fff', marginTop: 18, fontWeight: 700 }}>{success}</div>
          )}
        </form>
      );
    }
    // TODO: 다른 게임 타입별 폼 추가
    return <div>아직 지원하지 않는 게임입니다.</div>;
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>토너먼트 참가 신청</h1>
      {loading ? <div>로딩 중...</div> : renderGameForm()}
    </div>
  );
}
