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

# Next.js 15 + Docker + PostgreSQL + Prisma 연동 가이드

이 프로젝트는 Next.js 15, Docker, PostgreSQL, Prisma를 함께 사용합니다.

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

---

## 6. 기타

- Prisma Client를 새로 빌드하려면 `npx prisma generate`를 실행하세요.
- DB 접속 정보, 포트 등은 필요에 따라 수정 가능합니다.

---

문의사항은 이슈로 남겨주세요.
