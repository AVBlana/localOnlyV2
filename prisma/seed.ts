import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.experience.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  const host = await prisma.user.upsert({
    where: { email: "host@example.com" },
    update: { role: Role.HOST },
    create: {
      name: "Host Demo",
      email: "host@example.com",
      role: Role.HOST,
    },
  });

  await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: { role: Role.CLIENT },
    create: {
      name: "Client Demo",
      email: "client@example.com",
      role: Role.CLIENT,
    },
  });

  await prisma.experience.createMany({
    data: [
      {
        title: "Wine tasting in Tuscany",
        location: "Italy",
        price: 120,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1523365280197-f1783db9fe62",
        description: "Explore Tuscany's vineyards with a local expert.",
        userId: host.id,
      },
      {
        title: "Surf camp in Bali",
        location: "Indonesia",
        price: 200,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        description: "Learn to surf on Bali's famous waves with local guides.",
        userId: host.id,
      },
    ],
  });

  console.log("✅ Database seeded!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

