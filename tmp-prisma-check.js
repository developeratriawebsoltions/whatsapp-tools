const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.user.create({
  data: {
    name: 'Debug',
    email: 'debug' + Date.now() + '@example.com',
    password: 'x',
    role: 'USER',
  },
})
  .then((r) => {
    console.log('ok', r);
    return prisma.$disconnect();
  })
  .catch((err) => {
    console.error(JSON.stringify(err, null, 2));
    return prisma.$disconnect();
  });
