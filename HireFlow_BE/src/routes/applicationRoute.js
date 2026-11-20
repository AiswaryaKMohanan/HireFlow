
import { Router } from 'express';

import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
} from '../controllers/applicationController.js';

const router = Router();

// Get all applications
router.get('/', getApplications);

// Create a new application
router.post('/', createApplication);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);

export default router;
