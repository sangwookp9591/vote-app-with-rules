// thumbnail-capture.js
// 방송 썸네일을 자동으로 생성하는 Node.js 스크립트
// 1. /api/streams에서 현재 방송 중인 streamKey 목록을 받아옴
// 2. 각 방송의 HLS 스트림에서 ffmpeg로 썸네일을 5초마다 생성
// 3. public/thumbnails/{streamKey}.jpg로 저장

import fetch from 'node-fetch';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const HLS_BASE_URL = 'http://localhost:8080/live'; // SRS HLS 서버 주소
const THUMBNAIL_DIR = path.join(process.cwd(), 'public', 'thumbnails');
const STREAMS_API_URL = 'http://localhost:3000/api/streams'; // Next.js API 주소

// 썸네일 폴더가 없으면 생성
if (!fs.existsSync(THUMBNAIL_DIR)) {
  fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
}

// 현재 방송 중인 streamKey 목록을 받아오는 함수
async function getStreamKeys() {
  try {
    const res = await fetch(STREAMS_API_URL);
    const streams = await res.json();
    // isLive && streamKey가 있는 방송만 추출
    return streams.filter((s) => s.isLive && s.streamKey).map((s) => s.streamKey);
  } catch (err) {
    console.error('방송 목록 조회 실패:', err);
    return [];
  }
}

// 각 방송의 썸네일을 생성하는 함수
async function captureThumbnails() {
  const streamKeys = await getStreamKeys();
  for (const key of streamKeys) {
    const hlsUrl = `${HLS_BASE_URL}/${key}.m3u8`;
    const outPath = path.join(THUMBNAIL_DIR, `${key}.jpg`);
    // ffmpeg로 썸네일 생성 (1프레임만 캡처)
    const cmd = `ffmpeg -y -i "${hlsUrl}" -vframes 1 "${outPath}" -loglevel error`;
    exec(cmd, (err) => {
      if (err) {
        // 방송이 없으면 에러가 날 수 있음(무시 가능)
        // console.error(`썸네일 생성 실패: ${key}`, err);
      } else {
        console.log(`썸네일 생성 완료: ${outPath}`);
      }
    });
  }
}

// 5초마다 반복 실행
setInterval(captureThumbnails, 5000);
// 최초 1회 즉시 실행
captureThumbnails();
