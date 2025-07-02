'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const LOL_TIERS = [
  'IRON',
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'EMERALD',
  'DIAMOND',
  'MASTER',
  'GRANDMASTER',
  'CHALLENGER',
];
const LOL_POSITIONS = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];
const VALORANT_TIERS = [
  'IRON',
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'DIAMOND',
  'ASCENDANT',
  'IMMORTAL',
  'RADIANT',
];
const VALORANT_POSITIONS = ['DUELIST', 'SENTINEL', 'INITIATOR', 'CONTROLLER'];

export default function StreamerProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lolProfile, setLolProfile] = useState<any>(null);
  const [valorantProfile, setValorantProfile] = useState<any>(null);
  const [form, setForm] = useState({
    lol: {
      nickname: '',
      tier: 'GOLD',
      rank: 1,
      position: 'MID',
      mainChampions: '',
      winRate: '',
      gamesPlayed: '',
    },
    valorant: {
      nickname: '',
      tier: 'GOLD',
      position: 'DUELIST',
      mainAgents: '',
      role: '',
      winRate: '',
      gamesPlayed: '',
    },
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/streamers/profile');
        if (!res.ok) throw new Error('프로필 조회 실패');
        const data = await res.json();
        if (data.lolProfile) {
          setLolProfile(data.lolProfile);
          setForm((f) => ({
            ...f,
            lol: {
              ...f.lol,
              ...data.lolProfile,
              mainChampions: (data.lolProfile.mainChampions || []).join(', '),
            },
          }));
        }
        if (data.valorantProfile) {
          setValorantProfile(data.valorantProfile);
          setForm((f) => ({
            ...f,
            valorant: {
              ...f.valorant,
              ...data.valorantProfile,
              mainAgents: (data.valorantProfile.mainAgents || []).join(', '),
            },
          }));
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (game: 'lol' | 'valorant', field: string, value: any) => {
    setForm((f) => ({ ...f, [game]: { ...f[game], [field]: value } }));
  };

  const handleSubmit = async (game: 'lol' | 'valorant') => {
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      const payload: any = { ...form[game] };
      if (game === 'lol') {
        payload.mainChampions = form.lol.mainChampions
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
        payload.rank = Number(payload.rank);
        payload.winRate = payload.winRate ? Number(payload.winRate) : undefined;
        payload.gamesPlayed = payload.gamesPlayed ? Number(payload.gamesPlayed) : undefined;
      } else if (game === 'valorant') {
        payload.mainAgents = form.valorant.mainAgents
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
        payload.winRate = payload.winRate ? Number(payload.winRate) : undefined;
        payload.gamesPlayed = payload.gamesPlayed ? Number(payload.gamesPlayed) : undefined;
      }
      const res = await fetch('/api/streamers/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game, profile: payload }),
      });
      if (!res.ok) throw new Error('저장 실패');
      setSuccess('저장되었습니다!');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24 }}>
        스트리머 게임별 프로필
      </h1>
      {loading ? (
        <div>로딩 중...</div>
      ) : (
        <>
          {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          {success && <div style={{ color: 'green', marginBottom: 16 }}>{success}</div>}

          {/* LoL 프로필 */}
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 12 }}>LoL 프로필</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                placeholder="LoL 닉네임"
                value={form.lol.nickname}
                onChange={(e) => handleChange('lol', 'nickname', e.target.value)}
              />
              <select
                value={form.lol.tier}
                onChange={(e) => handleChange('lol', 'tier', e.target.value)}
              >
                {LOL_TIERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                max={4}
                placeholder="랭크(1~4)"
                value={form.lol.rank}
                onChange={(e) => handleChange('lol', 'rank', e.target.value)}
              />
              <select
                value={form.lol.position}
                onChange={(e) => handleChange('lol', 'position', e.target.value)}
              >
                {LOL_POSITIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                placeholder="주요 챔피언 (쉼표로 구분)"
                value={form.lol.mainChampions}
                onChange={(e) => handleChange('lol', 'mainChampions', e.target.value)}
              />
              <input
                type="number"
                step="0.01"
                placeholder="승률(%)"
                value={form.lol.winRate}
                onChange={(e) => handleChange('lol', 'winRate', e.target.value)}
              />
              <input
                type="number"
                placeholder="플레이한 게임 수"
                value={form.lol.gamesPlayed}
                onChange={(e) => handleChange('lol', 'gamesPlayed', e.target.value)}
              />
              <button onClick={() => handleSubmit('lol')} disabled={saving}>
                LoL 프로필 저장
              </button>
            </div>
          </section>

          {/* Valorant 프로필 */}
          <section>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 12 }}>
              Valorant 프로필
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                placeholder="Valorant 닉네임"
                value={form.valorant.nickname}
                onChange={(e) => handleChange('valorant', 'nickname', e.target.value)}
              />
              <select
                value={form.valorant.tier}
                onChange={(e) => handleChange('valorant', 'tier', e.target.value)}
              >
                {VALORANT_TIERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                value={form.valorant.position}
                onChange={(e) => handleChange('valorant', 'position', e.target.value)}
              >
                {VALORANT_POSITIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                placeholder="주요 에이전트 (쉼표로 구분)"
                value={form.valorant.mainAgents}
                onChange={(e) => handleChange('valorant', 'mainAgents', e.target.value)}
              />
              <input
                placeholder="역할 (예: IGL, Support)"
                value={form.valorant.role}
                onChange={(e) => handleChange('valorant', 'role', e.target.value)}
              />
              <input
                type="number"
                step="0.01"
                placeholder="승률(%)"
                value={form.valorant.winRate}
                onChange={(e) => handleChange('valorant', 'winRate', e.target.value)}
              />
              <input
                type="number"
                placeholder="플레이한 게임 수"
                value={form.valorant.gamesPlayed}
                onChange={(e) => handleChange('valorant', 'gamesPlayed', e.target.value)}
              />
              <button onClick={() => handleSubmit('valorant')} disabled={saving}>
                Valorant 프로필 저장
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
