import { Router } from "express";
import {
  createJob,
  deleteJob,
  getJobById,
  getJobs,
  updateJob,
} from "../controllers/jobController.js";

const router =Router();

router.get('/',getJobs);
router.post('/',createJob);
router.get('/:jobId',getJobById);
router.put('/:jobId', updateJob);
router.delete('/:jobId', deleteJob);

export default router;