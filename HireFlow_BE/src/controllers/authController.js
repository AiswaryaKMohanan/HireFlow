
import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const registerRecruiter = async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create recruiter
    const recruiter = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'recruiter',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Recruiter registered successfully',
      data: recruiter,
    });

  } catch (error) {
    console.error('Registration error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};



export const loginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find recruiter by email
    const recruiter = await prisma.user.findUnique({
      where: { email },
    });

    if (!recruiter) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      password,
      recruiter.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check whether account is active
    if (!recruiter.active) {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: recruiter.id,
        role: recruiter.role,
      },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiresIn,
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        recruiter: {
          id: recruiter.id,
          name: recruiter.name,
          email: recruiter.email,
          role: recruiter.role,
        },
      },
    });

  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};