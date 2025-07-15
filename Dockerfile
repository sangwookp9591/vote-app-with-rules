# 1. Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app

# Git 의존성을 위해 git 설치
RUN apk add --no-cache git

COPY package.json package-lock.json* ./
RUN npm ci

# 2. Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# prisma 폴더도 복사 (마이그레이션 및 Prisma Client 생성을 위해 필요)
COPY ./prisma ./prisma
RUN npm run build && npx prisma generate

# 3. Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# prisma 폴더도 복사 (운영 환경에서 Prisma Client가 schema 참조 가능하도록)
COPY --from=builder /app/prisma ./prisma
# 썸네일 자동화 스크립트 복사
COPY --from=builder /app/thumbnail-capture.js ./thumbnail-capture.js

# ffmpeg 설치 (alpine용)
RUN apk add --no-cache ffmpeg

EXPOSE 3000

# 썸네일 자동화 스크립트와 앱을 동시에 실행 (백그라운드)
CMD node thumbnail-capture.js & npm start 