import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Initial roles
const roles = [
  {name: "Administrator", description: "The administrator role", identifier: "admin"},
  {name: "Content creator", description: "A normal user", identifier: "user"}
]

// Main seeding function
async function main() {
  await prisma.role.createMany({
    data: roles,
    skipDuplicates: true, // prevents duplicates if  reseeded
  });

  console.log('✅ Roles seeded!');
}

main()
  .then(() => {
    console.log('✅ Seed complete');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
