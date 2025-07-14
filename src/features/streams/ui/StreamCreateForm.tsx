import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStream, StartStreamResponse } from '../api/streams';

export default function StreamCreateForm({ streamerId }: { streamerId: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
      const result = await createStream({ title, description, streamerId });
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

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}
    >
      <h3>방송 시작</h3>
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
