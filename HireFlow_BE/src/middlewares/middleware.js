

import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Attach authenticated user to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
