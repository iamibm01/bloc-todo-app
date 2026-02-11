import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Testing Prisma Client...\n');

  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'hashed_password_here', // We'll do real hashing later
      name: 'Test User',
    },
  });

  console.log('✅ Created user:', user);

  // Create a todo for this user
  const todo = await prisma.todo.create({
    data: {
      title: 'Learn Prisma',
      userId: user.id,
    },
  });

  console.log('✅ Created todo:', todo);

  // Fetch user with their todos
  const userWithTodos = await prisma.user.findUnique({
    where: { id: user.id },
    include: { todos: true },
  });

  console.log('\n✅ User with todos:', JSON.stringify(userWithTodos, null, 2));

  // Clean up - delete test data
  await prisma.todo.deleteMany();
  await prisma.user.deleteMany();

  console.log('\n🧹 Cleaned up test data');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
