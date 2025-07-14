import { useEffect, useRef } from 'react';
import { Room, createLocalVideoTrack, createLocalAudioTrack } from 'livekit-client';

export default function LiveKitBroadcaster({
  roomName,
  userName,
  token,
  onConnected,
}: {
  roomName: string;
  userName: string;
  token: string;
  onConnected?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let currentRoom: Room | null = null;
    (async () => {
      const wsUrl = 'ws://localhost:7880';
      const room = new Room();
      currentRoom = room;
      await room.connect(wsUrl, token);
      const videoTrack = await createLocalVideoTrack();
      const audioTrack = await createLocalAudioTrack();
      await room.localParticipant.publishTrack(videoTrack);
      await room.localParticipant.publishTrack(audioTrack);
      if (videoRef.current) {
        videoTrack.attach(videoRef.current);
      }
      onConnected?.();
    })();
    return () => {
      if (currentRoom) {
        currentRoom.disconnect();
      }
    };
  }, [roomName, userName, token, onConnected]);

  return (
    <div>
      <video ref={videoRef} autoPlay muted style={{ width: 400, borderRadius: 8 }} />
      <div>LiveKit 송출 중...</div>
    </div>
  );
}
