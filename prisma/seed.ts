import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Initial roles
const roles = [
  { name: 'Administrator', description: 'The administrator role', identifier: 'admin' },
  { name: 'Content creator', description: 'A normal user', identifier: 'user' },
];

async function seedRoles() {
  await prisma.role.createMany({
    data: roles,
    skipDuplicates: true,
  });
  console.log('✅ Roles seeded!');
}

async function seedCoursesAndUsers() {
  const adminRole = await prisma.role.findUnique({ where: { identifier: 'admin' } });

  if (!adminRole) {
    throw new Error('❌ Role "admin" not found. Ensure roles are seeded before users.');
  }

  await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'hashed_password',
      roleId: adminRole.id,
      courses: {
        create: [
          {
            title: 'Intro to Design',
            description: 'Learn basics of design.',
            lessons: {
              create: [
                {
                  title: 'Lesson 1',
                  order: 1,
                  blocks: {
                    create: [
                      { type: 'TEXT', content: { text: 'Welcome!' }, order: 1 },
                      { type: 'IMAGE', content: { url: '/img.jpg' }, order: 2 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Admin user and course seeded!');
}

async function main() {
  await seedRoles();
  await seedCoursesAndUsers();
}

main()
  .then(() => {
    console.log('✅ Database seed complete');
    void prisma.$disconnect();
  })
  .catch(error => {
    console.error('❌ Seeding failed:', error);
    void prisma.$disconnect();
    process.exit(1);
  });
