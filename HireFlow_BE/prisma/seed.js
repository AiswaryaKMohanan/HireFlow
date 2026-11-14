
import 'dotenv/config';
import bcrypt from 'bcrypt';
import prisma from '../src/config/prisma.js';

const createRecruiter = async () => {
  try {
    const name = process.env.SEED_USER_NAME;
    const email = process.env.SEED_USER_EMAIL;
    const password = process.env.SEED_USER_PASSWORD;

    if (!name || !email || !password) {
      throw new Error('Missing recruiter seed credentials in .env');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('Recruiter already exists:', existingUser.email);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const recruiter = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'recruiter',
      },
    });

    console.log('Recruiter created successfully!');
    console.log({
      id: recruiter.id,
      name: recruiter.name,
      email: recruiter.email,
      role: recruiter.role,
    });
  } catch (error) {
    console.error('Error creating recruiter:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

createRecruiter();
