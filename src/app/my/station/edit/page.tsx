import StreamerStationEditForm from '@/features/streamer-profile/ui/StreamerStationEditForm';

export default function MyStationEditPage() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '32px 0 24px 0' }}>
        내 방송국 정보 수정
      </h1>
      <StreamerStationEditForm />
    </div>
  );
}
