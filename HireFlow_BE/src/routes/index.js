import { Router } from 'express';
import { healthCheck } from '../controllers/healthController.js';
import { createPost, getPosts } from '../controllers/postController.js';
import { getJobs } from '../controllers/jobController.js';

const router = Router();

router.get('/health', healthCheck);
router.get('/posts', getPosts);
router.post('/posts', createPost);
router.use('/jobs',getJobs);

export default router;
