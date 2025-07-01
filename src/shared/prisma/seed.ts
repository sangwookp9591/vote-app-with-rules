import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 예시: User, Post 등 seed 데이터 생성
  // const user = await prisma.user.upsert({
  //   where: { email: 'alice@example.com' },
  //   update: {},
  //   create: {
  //     email: 'alice@example.com',
  //     name: 'Alice',
  //     posts: {
  //       create: [{ title: 'Hello World', content: 'This is my first post!' }],
  //     },
  //   },
  // });
  // console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
