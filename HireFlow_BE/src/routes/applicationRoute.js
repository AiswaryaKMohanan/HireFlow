
import { Router } from 'express';

import {
  createApplication,
  getApplications,
  getApplicationById
} from '../controllers/applicationController.js';

const router = Router();

// Get all applications
router.get('/', getApplications);

// Create a new application
router.post('/', createApplication);
router.get('/:id', getApplicationById);

export default router;
