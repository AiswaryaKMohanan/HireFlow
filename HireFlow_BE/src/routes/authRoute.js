
import { Router } from 'express';

import {
  registerRecruiter,
  loginRecruiter
} from '../controllers/authController.js';

import { authenticateToken } from '../middlewares/middleware.js';

const router = Router();

// Recruiter registration
router.post('/register', registerRecruiter);
router.post('/login', loginRecruiter);

// Protected profile route
router.get('/profile', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authenticated successfully',
    user: req.user,
  });
});

export default router;
