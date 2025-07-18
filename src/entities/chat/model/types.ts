// 채팅 로그 타입
export interface ChatLog {
  id: string; // 채팅 로그 고유 ID
  userId: string; // 채팅을 보낸 유저 ID
  streamId: string; // 채팅이 작성된 방송 ID
  message: string; // 채팅 메시지
  sentAt: string; // 채팅 전송 시각(ISO 문자열)
}
