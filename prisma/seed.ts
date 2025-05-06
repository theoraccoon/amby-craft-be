import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Initial roles
const roles = [
  { name: 'Administrator', description: 'The administrator role', identifier: 'admin' },
  { name: 'Content creator', description: 'A normal user', identifier: 'user' },
];

// Main seeding function
async function main() {
  await prisma.role.createMany({
    data: roles,
    skipDuplicates: true, // prevents duplicates if  reseeded
  });

  console.log('✅ Roles seeded!');

  await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'hashed_password',
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
      roleId: '1',
    },
  });

  console.log('✅ Courses seeded!');
}

main()
  .then(() => {
    console.log('✅ Seed complete');
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
