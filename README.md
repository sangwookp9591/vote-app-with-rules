# Vote App with Rules

실시간 소켓 알림 기능이 포함된 투표 애플리케이션입니다.

## 🚀 빠른 시작

### 로컬 개발 환경

1. **의존성 설치**

```bash
npm install
```

2. **환경변수 설정**

```bash
cp .env.example .env.local
```

`.env.local` 파일을 편집하여 필요한 환경변수를 설정하세요.

3. **데이터베이스 설정**

```bash
# Prisma 마이그레이션 실행
npx prisma migrate dev

# 시드 데이터 생성 (선택사항)
npx prisma db seed
```

4. **개발 서버 실행**

```bash
npm run dev
```

애플리케이션이 `http://localhost:3000`에서 실행됩니다.

### Docker 환경

1. **환경변수 파일 생성**

```bash
cp .env.example .env
```

`.env` 파일을 편집하여 Docker 환경에 맞는 설정을 구성하세요.

2. **Docker Compose로 실행**

```bash
# 모든 서비스 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 특정 서비스만 재시작
docker-compose restart app
```

3. **개별 서비스 관리**

```bash
# 앱 서비스만 빌드
docker-compose build app

# 소켓 서버만 재시작
docker-compose restart socket-server

# 모든 서비스 중지
docker-compose down
```

## 📁 프로젝트 구조

```
vote-app-with-rules/
├── src/
│   ├── app/                 # Next.js 앱 라우터
│   ├── entities/            # 도메인 엔티티 (타입, 모델)
│   ├── features/            # 비즈니스 로직 및 UI
│   ├── widgets/             # 주요 UI 블록
│   └── shared/              # 공유 리소스 (컴포넌트, 유틸리티)
├── server/
│   └── socket-server.js     # 실시간 소켓 서버
│   └── notification-server.js # 실시간 알림 서버
├── prisma/
│   └── schema.prisma        # 데이터베이스 스키마
├── docker-compose.yml       # Docker Compose 설정
├── Dockerfile              # 메인 앱 Dockerfile
└── Dockerfile.socket       # 소켓 서버 Dockerfile
```

## 🔧 주요 기능

- **실시간 알림**: WebSocket을 통한 실시간 팀 초대 및 알림
- **투표 시스템**: 토너먼트 및 팀 관리
- **인증 시스템**: NextAuth.js를 통한 소셜 로그인
- **데이터베이스**: Prisma ORM과 PostgreSQL
- **캐싱**: Redis를 통한 세션 및 데이터 캐싱

## 🛠️ 개발 도구

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Node.js, Prisma ORM
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: NextAuth.js
- **Real-time**: WebSocket (Socket.io)

## 🔍 문제 해결

### 로컬에서 로그인이 안 되는 경우

1. 환경변수가 올바르게 설정되었는지 확인
2. 데이터베이스 마이그레이션이 완료되었는지 확인
3. Redis 서버가 실행 중인지 확인

### Docker에서 연결 오류가 발생하는 경우

1. 모든 서비스가 정상적으로 시작되었는지 확인

```bash
docker-compose ps
```

2. 로그를 확인하여 오류 원인 파악

```bash
docker-compose logs app
docker-compose logs socket-server
```

3. 데이터베이스 마이그레이션 실행

```bash
docker-compose exec app npx prisma migrate deploy
```

## 📝 환경변수

주요 환경변수들:

```env
# 데이터베이스
DATABASE_URL="postgresql://username:password@localhost:5432/vote_app"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# 소셜 로그인 (Kakao, Google 등)
KAKAO_CLIENT_ID="your-kakao-client-id"
KAKAO_CLIENT_SECRET="your-kakao-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
