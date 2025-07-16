import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStream, StartStreamResponse } from '../api/streams';

// --- 카테고리 대분류/소분류 옵션 정의 ---
const CATEGORY_OPTIONS = [
  {
    type: 'GAME',
    label: '게임',
    details: [
      { value: 'LOL', label: 'LOL' },
      { value: 'PUBG', label: 'PUBG' },
      { value: 'OVERWATCH', label: 'OVERWATCH' },
      { value: 'VALORANT', label: 'VALORANT' },
      { value: 'CS2', label: 'CS2' },
      { value: 'DOTA2', label: 'DOTA2' },
      { value: 'ETC', label: '기타' },
    ],
  },
  {
    type: 'RADIO',
    label: '보이는 라디오',
    details: [
      { value: '토크', label: '토크' },
      { value: '여행', label: '여행' },
      { value: '음악', label: '음악' },
      { value: '버츄얼', label: '버츄얼' },
    ],
  },
  {
    type: 'SPORTS',
    label: '스포츠',
    details: [
      { value: '축구', label: '축구' },
      { value: '농구', label: '농구' },
      { value: '야구', label: '야구' },
      { value: '당구', label: '당구' },
      { value: '탁구', label: '탁구' },
    ],
  },
];

export default function StreamCreateForm({ streamerId }: { streamerId: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // 카테고리 대분류/소분류 상태
  const [categoryType, setCategoryType] = useState('GAME');
  const [categoryDetail, setCategoryDetail] = useState('LOL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState<StartStreamResponse | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo(null);
    try {
      // 방송 생성 시 카테고리 정보도 함께 전달
      const result = await createStream({
        title,
        description,
        streamerId,
        categoryType: categoryType as 'GAME' | 'RADIO' | 'SPORTS',
        categoryDetail,
      });
      setInfo(result);
      setTimeout(() => {
        router.push(`/streams/${result.stream.id}`);
      }, 2000);
    } catch (e: unknown) {
      if (
        e &&
        typeof e === 'object' &&
        'message' in e &&
        typeof (e as { message?: string }).message === 'string'
      ) {
        setError((e as { message?: string }).message!);
      } else {
        setError('방송 시작 실패');
      }
    } finally {
      setLoading(false);
    }
  };

  // 선택된 대분류에 따른 소분류 옵션
  const selectedCategory = CATEGORY_OPTIONS.find((cat) => cat.type === categoryType);
  const detailOptions = selectedCategory ? selectedCategory.details : [];

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}
    >
      <h3>방송 시작</h3>
      {/* --- 카테고리 대분류 선택 --- */}
      <label style={{ fontWeight: 700, fontSize: 15 }}>
        카테고리 대분류
        <select
          value={categoryType}
          onChange={(e) => {
            setCategoryType(e.target.value);
            // 대분류 변경 시 소분류를 첫 번째 값으로 초기화
            const next = CATEGORY_OPTIONS.find((cat) => cat.type === e.target.value);
            setCategoryDetail(next?.details[0]?.value || '');
          }}
          required
          style={{ marginLeft: 8, padding: 6, borderRadius: 6, border: '1px solid #e0e7ef' }}
        >
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat.type} value={cat.type}>
              {cat.label}
            </option>
          ))}
        </select>
      </label>
      {/* --- 카테고리 소분류 선택 --- */}
      <label style={{ fontWeight: 700, fontSize: 15 }}>
        카테고리 소분류
        <select
          value={categoryDetail}
          onChange={(e) => setCategoryDetail(e.target.value)}
          required
          style={{ marginLeft: 8, padding: 6, borderRadius: 6, border: '1px solid #e0e7ef' }}
        >
          {detailOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
      <input
        type="text"
        placeholder="방송 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ padding: 8, borderRadius: 8, border: '1px solid #e0e7ef' }}
      />
      <textarea
        placeholder="방송 설명 (선택)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        style={{ padding: 8, borderRadius: 8, border: '1px solid #e0e7ef' }}
      />
      <button
        type="submit"
        disabled={loading || !title}
        style={{
          background: '#4f9fff',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 0',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        {loading ? '생성 중...' : '방송 시작'}
      </button>
      {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}
      {info && (
        <div style={{ background: '#f5f7fa', padding: 16, borderRadius: 8, marginTop: 16 }}>
          <h4>OBS Studio로 방송 송출을 권장합니다</h4>
          <div style={{ fontSize: 14, marginBottom: 8 }}>
            <b>RTMP 서버:</b> {info.rtmpUrl}
            <br />
            <b>스트림키:</b> {info.streamKey}
            <br />
            <b>시청 주소(HLS):</b> {info.hlsUrl}
          </div>
          <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>
            방송을 시작하면 시청자는 위 HLS 주소로 방송을 볼 수 있습니다.
            <br />
            <b>2초 후 방송방으로 자동 이동합니다.</b>
          </div>
          <div
            style={{
              background: '#eee',
              padding: 10,
              borderRadius: 6,
              fontSize: 13,
              marginBottom: 8,
            }}
          >
            <b>ffmpeg 송출 예시:</b>
            <br />
            <code style={{ wordBreak: 'break-all', display: 'block' }}>
              {
                'ffmpeg -re -f avfoundation -framerate 30 -i "0:0" -c:v libx264 -preset veryfast -b:v 2500k -c:a aac -b:a 128k -f flv info.rtmpUrl/info.streamKey'
              }
            </code>
            <span style={{ color: '#888' }}>
              {'OBS 설정 파일을 다운로드해 프로필 가져오기로 불러오면 더 빠르게 설정할 수 있습니다'}
            </span>
          </div>
          <div style={{ color: '#555', fontSize: 13 }}>
            <b>설정법:</b> OBS 실행 → 설정 → 방송 → 위 정보 입력 → 방송 시작!
          </div>
        </div>
      )}
    </form>
  );
}
