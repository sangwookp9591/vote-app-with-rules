'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { fetchStream, updateStream } from '../api/streams';
import type { Stream } from '@/entities/stream/model/types';
import ChatWidget from '@/widgets/ChatWidget/ChatWidget';
import * as styles from './StreamRoom.css';
import Image from 'next/image';
import socket from '@/shared/api/socketClient';
import { useSession } from 'next-auth/react';
// hls.js 타입 에러 방지: 타입 선언 파일이 없으므로 아래 @ts-expect-error 사용
import Hls from 'hls.js';

// (LiveKit, WebRTC, SRS WebRTC Publish 관련 코드/주석/함수/변수/버튼 완전 제거)

export default function StreamRoom() {
  const params = useParams();
  const streamId = params?.id as string;
  const { data: session } = useSession();
  const user = session?.user;
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [viewerCount, setViewerCount] = useState(0);

  // isStreamer 변수를 useEffect보다 위에 선언
  const isStreamer = user?.id === stream?.streamerId;

  useEffect(() => {
    if (!streamId) return;
    fetchStream(streamId)
      .then(setStream)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [streamId]);

  useEffect(() => {
    if (!stream) return;
    const handler = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'viewerCount' && data.roomId === stream.id) {
          setViewerCount(data.count);
        }
      } catch {}
    };
    socket.addEventListener('message', handler);
    return () => socket.removeEventListener('message', handler);
  }, [stream]);

  const handleEnd = async () => {
    if (!stream) return;
    setActionLoading(true);
    setActionError('');
    try {
      const updated = await updateStream(stream.id, {
        isLive: false,
        endedAt: new Date().toISOString(),
      });
      setStream(updated);
    } catch (e: unknown) {
      if (
        e &&
        typeof e === 'object' &&
        'message' in e &&
        typeof (e as { message?: string }).message === 'string'
      ) {
        setActionError((e as { message?: string }).message!);
      } else {
        setActionError('방송 종료 실패');
      }
    } finally {
      setActionLoading(false);
    }
  };

  // HLS 플레이어용 ref
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!stream?.isLive || !stream?.streamKey) return;
    if (!videoRef.current) return;
    if (user?.id === stream.streamerId) return; // 스트리머는 HLS 플레이어 안 보임
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(`http://localhost:8080/live/${stream.streamKey}.m3u8`);
      hls.attachMedia(videoRef.current);
      return () => hls.destroy();
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = `http://localhost:8080/live/${stream.streamKey}.m3u8`;
    }
  }, [stream, user?.id]);

  // SRS WebRTC Publish 미리보기용 ref
  const localPreviewRef = useRef<HTMLVideoElement>(null);
  // 방송 중일 때 스트리머가 자신의 송출 화면을 방송방에서 볼 수 있도록 미리보기 연결
  useEffect(() => {
    if (!isStreamer || !stream?.isLive) return;
    // 브라우저에서 getUserMedia로 로컬 미리보기 연결
    if (localPreviewRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localPreviewRef.current!.srcObject = stream;
        })
        .catch(() => {});
    }
  }, [isStreamer, stream?.isLive]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!stream) return <div>방송방 정보를 찾을 수 없습니다.</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.titleRow}>
        {stream.title}
        {stream.isLive && <span className={styles.liveBadge}>LIVE</span>}
      </h2>
      <div className={styles.description}>{stream.description}</div>
      <div className={styles.streamerRow}>
        <b>스트리머:</b> {stream?.streamer?.nickname}
        {stream?.streamer?.profileImageUrl && (
          <Image
            src={stream?.streamer?.profileImageUrl}
            alt="프로필"
            width={32}
            height={32}
            className={styles.profileImg}
          />
        )}
      </div>
      <div className={styles.statusRow}>
        <b>상태:</b> {stream?.isLive ? <span style={{ color: 'green' }}>LIVE</span> : '오프라인'}
      </div>
      <div className={styles.viewersRow}>
        <b>시청자 수:</b> {viewerCount}
      </div>
      {/* 방송 시작/종료 버튼 (스트리머만 노출) */}
      {isStreamer && (
        <div className={styles.buttonRow}>
          {stream.isLive ? (
            <button
              onClick={handleEnd}
              disabled={actionLoading}
              className={styles.actionButton}
              data-variant="end"
            >
              {actionLoading ? '종료 중...' : '방송 종료'}
            </button>
          ) : null}
          {actionError && <div className={styles.actionError}>{actionError}</div>}
        </div>
      )}
      {/* OBS Studio 송출 안내 및 자동화 UX 개선 */}
      <div style={{ background: '#eaf6ff', padding: 16, borderRadius: 8, margin: '16px 0' }}>
        <h4>OBS Studio로 방송 송출을 권장합니다</h4>
        <div style={{ marginBottom: 8 }}>
          <b>RTMP 서버:</b> <code>rtmp://localhost:1935/live</code>
          <button
            type="button"
            style={{ marginLeft: 8 }}
            onClick={() => navigator.clipboard.writeText('rtmp://localhost:1935/live')}
          >
            복사
          </button>
        </div>
        <div style={{ marginBottom: 8 }}>
          <b>스트림키:</b> <code>{stream?.streamKey}</code>
          <button
            type="button"
            style={{ marginLeft: 8 }}
            onClick={() => navigator.clipboard.writeText(stream?.streamKey || '')}
          >
            복사
          </button>
        </div>
        <div style={{ marginBottom: 8 }}>
          <a href="https://obsproject.com/ko/download" target="_blank" rel="noopener noreferrer">
            OBS Studio 다운로드
          </a>
        </div>
        <div style={{ marginBottom: 8 }}>
          <button
            type="button"
            onClick={() => {
              // OBS 설정 파일(.json) 자동 생성 및 다운로드
              const obsProfile = {
                settings: {
                  service: 'Custom',
                  server: 'rtmp://localhost:1935/live',
                  key: stream?.streamKey || '',
                },
              };
              const blob = new Blob([JSON.stringify(obsProfile, null, 2)], {
                type: 'application/json',
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `obs-profile-${stream?.streamKey || 'stream'}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            OBS 설정 파일 다운로드
          </button>
        </div>
        <div style={{ fontSize: 13, color: '#555' }}>
          <b>설정법:</b> OBS 실행 → 설정 → 방송 → 위 정보 입력 → 방송 시작!
          <br />
          <span style={{ color: '#888' }}>
            {'OBS 설정 파일을 다운로드해 프로필 가져오기로 불러오면 더 빠르게 설정할 수 있습니다'}
          </span>
        </div>
        <div
          style={{ background: '#eee', padding: 10, borderRadius: 6, fontSize: 13, marginTop: 12 }}
        >
          <b>ffmpeg 송출 예시:</b>
          <br />
          <div style={{ wordBreak: 'break-all', display: 'block' }}>
            {
              'ffmpeg -re -f avfoundation -framerate 30 -i "0:0" -c:v libx264 -preset veryfast -b:v 2500k -c:a aac -b:a 128k -f flv rtmp://localhost:1935/live/stream?.streamKey'
            }
          </div>
          <span style={{ color: '#888' }}>
            {
              'Mac 내장 카메라/마이크 송출 예시, 실제 장치 번호는 ffmpeg -f avfoundation -list_devices true -i 로 확인'
            }
          </span>
        </div>
      </div>
      {/* 방송이 진행 중일 때 스트리머/시청자 모두에게 HLS 플레이어 노출 */}
      {stream.isLive && (
        <div style={{ margin: '16px 0' }}>
          {/* 스트리머에게만 안내 문구 노출 */}
          {isStreamer && (
            <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>
              이 화면은 실제 방송 송출 미리보기(HLS 기준, 약간의 지연 있음)입니다.
            </div>
          )}
          <video
            ref={videoRef}
            controls
            autoPlay
            style={{ width: '100%', maxWidth: 800 }}
            src={`http://localhost:8080/live/${stream.streamKey}.m3u8`}
          />
        </div>
      )}
      {/* 채팅 등 부가 기능은 그대로 유지 */}
      <ChatWidget stream={stream} user={user?.nickname || ''} />
    </div>
  );
}
