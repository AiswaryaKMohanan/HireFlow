
import { Router } from 'express';

import {
  registerRecruiter,
} from '../controllers/authController.js';

const router = Router();

// Recruiter registration
router.post('/register', registerRecruiter);

export default router;
