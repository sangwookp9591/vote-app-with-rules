import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStream } from '../api/streams';

export default function StreamCreateForm({ streamerId }: { streamerId: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const stream = await createStream({ title, description, streamerId });
      router.push(`/streams/${stream.id}`);
    } catch (e: unknown) {
      if (
        e &&
        typeof e === 'object' &&
        'message' in e &&
        typeof (e as { message?: string }).message === 'string'
      ) {
        setError((e as { message?: string }).message!);
      } else {
        setError('방송방 생성 실패');
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
    </form>
  );
}
