This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# vote-app-with-rules

# Next.js 15 + Docker + PostgreSQL + Prisma + CI 연동 가이드

이 프로젝트는 Next.js 15, Docker, PostgreSQL, Prisma, 그리고 GitHub Actions 기반의 CI(자동화 테스트/빌드) 환경을 함께 사용합니다.

---

## Code Quality & Test Automation (Husky, lint-staged, Jest, React Testing Library)

### 1. 커밋 전 자동화 (Husky + lint-staged)

- 커밋 전에 **lint(ESLint)**와 **포맷(Prettier)**이 자동으로 실행됩니다.
- 관련 설정: `package.json`의 `lint-staged`, `.husky/pre-commit` hook
- 커밋 시 코드 스타일/버그를 자동으로 잡아줍니다.

### 2. 테스트 (Jest + React Testing Library)

- 모든 테스트는 **Jest**와 **React Testing Library**로 작성되어 있습니다.
- 테스트 실행: `npm test` 또는 `npx jest`
- 테스트 코드는 `src/app/__tests__` 등에서 관리됩니다.
- 사용자 관점의 컴포넌트 테스트가 가능합니다.

### 3. 실행 예시

```bash
# 테스트 실행
npm test

# 커밋 시 자동 lint/format (husky + lint-staged)
git add .
git commit -m "feat: something"
```

---

## 0. GitHub Actions 기반 CI(자동화) 파이프라인

- `.github/workflows/ci.yml` 파일로 CI 파이프라인이 구축되어 있습니다.
- main 브랜치에 push 또는 pull request가 발생하면 아래 단계가 자동으로 실행됩니다:
  1. 코드 체크아웃
  2. Node.js 20 환경 세팅
  3. 의존성 설치(`npm ci`)
  4. Lint(`npm run lint`)
  5. Test(`npm test`)
  6. Build(`npm run build`)
- 모든 단계가 성공해야 PR이 머지되거나, 배포가 진행될 수 있습니다.
- 실행 결과는 GitHub 저장소의 **Actions** 탭에서 확인할 수 있습니다.

---

## 1. Docker 환경에서 실행하기

### 1-1. Docker 빌드 및 실행

```bash
docker-compose up --build
```

- Next.js 앱: http://localhost:3000
- PostgreSQL DB: localhost:5432 (컨테이너 내부에서는 db:5432)

### 1-2. 컨테이너 중지

```bash
docker-compose down
```

---

## 2. Prisma 설정 및 마이그레이션

### 2-1. Prisma 모델 정의

`prisma/schema.prisma` 파일에 모델을 정의하세요.

### 2-2. 마이그레이션 적용

```bash
npx prisma migrate dev
```

---

## 3. DB 연결 확인 (Prisma Studio)

Prisma가 DB에 정상적으로 연결되는지 확인하려면 아래 명령어를 실행하세요:

```bash
npx prisma studio
```

- 브라우저가 열리면 DB 연결이 정상적으로 된 것입니다.
- 테이블/데이터를 직접 확인할 수 있습니다.
- 에러가 발생하면 `.env`의 `DATABASE_URL` 또는 DB 컨테이너 상태를 확인하세요.

---

## 4. 환경 변수

`.env` 파일에 아래와 같이 DB 연결 정보를 설정합니다:

```
DATABASE_URL="postgres://postgres:postgres@localhost:5432/mydb"
```

Docker 환경에서는 자동으로 `docker-compose.yml`의 환경변수가 사용됩니다.

---

## 5. 주요 파일 설명

- `Dockerfile`: Next.js 앱의 Docker 빌드/실행 설정
- `docker-compose.yml`: Next.js 앱과 PostgreSQL DB를 함께 실행
- `prisma/schema.prisma`: Prisma 모델 및 DB 연결 설정
- `.env`: 로컬 개발용 환경 변수
- `.github/workflows/ci.yml`: GitHub Actions 기반 CI 파이프라인 설정

---

## 6. 기타

- Prisma Client를 새로 빌드하려면 `npx prisma generate`를 실행하세요.
- DB 접속 정보, 포트 등은 필요에 따라 수정 가능합니다.

---

## 환경 변수 고도화 관리

- 환경별로 `.env.development`, `.env.production` 파일을 사용해 개발/운영 환경을 분리합니다.
- 예시 파일은 `.env.example`에서 확인할 수 있습니다.
- 환경 변수는 Next.js에서 자동으로 로드되며, 코드에서는 `process.env.환경변수명`으로 접근합니다.
- 예시:
  ```ts
  // 환경 변수 사용 예시
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  ```
- 운영 환경에서는 `.env.production`을, 개발 환경에서는 `.env.development`를 사용하세요.
- 민감 정보가 외부에 노출되지 않도록 `.env*` 파일은 git에 커밋하지 않습니다.

---

## Storybook 사용법

- UI 컴포넌트 시각적 테스트 및 문서화를 위해 Storybook을 사용합니다.
- 실행:
  ```bash
  npm run storybook
  ```
- 브라우저에서 http://localhost:6006 에 접속해 컴포넌트 스토리를 확인할 수 있습니다.
- 예시: src/features/counter/ui/Counter.stories.tsx

---

문의사항은 이슈로 남겨주세요.

---

## Vercel 배포 자동화 및 Prisma(DB) 연동 안내

### 1. Vercel 배포 자동화

- https://vercel.com 에서 "New Project" → GitHub 저장소를 선택해 연동하면 main 브랜치에 push될 때마다 자동으로 배포됩니다.
- 별도 GitHub Actions 설정 없이도 Vercel이 자동으로 빌드/배포를 관리합니다.

### 2. 환경 변수(DB 접속 정보) 등록

- Vercel 대시보드 > 프로젝트 > Settings > Environment Variables에서 아래와 같이 등록하세요:
  - `DATABASE_URL=postgres://user:password@db-host:5432/mydb`
  - (필요시) `NEXT_PUBLIC_API_URL` 등도 등록

### 3. Prisma 마이그레이션/seed 관리

- Vercel 배포와 별도로, 클라우드 DB에 직접 마이그레이션/seed를 적용해야 합니다.
- 예시:
  ```bash
  npx prisma migrate deploy
  npx prisma db seed
  ```
- (운영 환경에서는 DB 마이그레이션을 자동화할 때 주의가 필요합니다)

### 4. 참고

- Vercel은 서버리스 환경이므로, DB는 Supabase, Neon, AWS RDS 등 외부 클라우드 DB를 사용해야 합니다.
- Prisma Client는 Vercel 빌드 단계에서 자동 생성됩니다.

---

## Sentry 에러 트래킹 연동

- 운영 중 발생하는 에러를 실시간으로 감지/모니터링하기 위해 Sentry를 연동합니다.
- Sentry 프로젝트를 생성하고 DSN을 발급받아 환경변수에 등록하세요.
  - `.env.production` 등:
    - `SENTRY_DSN=발급받은 DSN`
    - `NEXT_PUBLIC_SENTRY_DSN=발급받은 DSN`
- 클라이언트/서버 모두에서 에러가 Sentry로 전송됩니다.
- 자세한 설정은 `sentry.client.config.ts`, `sentry.server.config.ts` 참고
- [Sentry 공식 문서](https://docs.sentry.io/platforms/javascript/guides/nextjs/) 참고

---
