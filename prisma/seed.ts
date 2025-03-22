import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminExists = await prisma.user.findUnique({
    where: { email: 'test_admin@example.com' }
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('test_password', 10);
    await prisma.user.create({
      data: {
        email: 'test_admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: Role.admin
      }
    });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }

  // Create customer user
  const customerExists = await prisma.user.findUnique({
    where: { email: 'test_customer@example.com' }
  });

  if (!customerExists) {
    const hashedPassword = await bcrypt.hash('test_password', 10);
    await prisma.user.create({
      data: {
        email: 'test_customer@example.com',
        password: hashedPassword,
        firstName: 'Customer',
        lastName: 'User',
        role: Role.customer
      }
    });
    console.log('Customer user created');
  } else {
    console.log('Customer user already exists');
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });