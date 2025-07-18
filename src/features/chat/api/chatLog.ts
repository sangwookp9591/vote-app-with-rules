// 채팅 로그 저장 API 함수
// 서버에 채팅 로그를 저장한다.
export async function saveChatLog({
  userId,
  streamId,
  message,
}: {
  userId: string;
  streamId: string;
  message: string;
}) {
  try {
    const response = await fetch('/api/chat/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, streamId, message }),
    });
    if (!response.ok) {
      // 한글 주석: 서버에서 에러 응답 시 예외 발생
      throw new Error('채팅 로그 저장 실패');
    }
    return await response.json();
  } catch {
    // 한글 주석: 네트워크 또는 기타 에러 처리
    throw new Error('채팅 로그 저장 중 오류 발생');
  }
}
