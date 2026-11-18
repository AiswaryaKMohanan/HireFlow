import { Router } from 'express';
import { healthCheck } from '../controllers/healthController.js';
import { createPost, getPosts } from '../controllers/postController.js';
import jobRoutes from './jobRoute.js';
import candidateRoute from '../routes/candidateRoute.js';
const router = Router();

router.get('/health', healthCheck);
router.get('/posts', getPosts);
router.post('/posts', createPost);
router.use('/jobs', jobRoutes);
router.use('/candidate',candidateRoute);

export default router;
