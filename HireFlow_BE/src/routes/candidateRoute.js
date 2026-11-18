import { Router } from "express";
import { createCandidate, deleteCandidateById, getcandidateById, getCandidates, updateCandidate } from "../controllers/candidateController.js";

const router = Router();

router.post('/', createCandidate);
router.get('/',getCandidates);
router.get('/:id',getcandidateById);
router.delete('/:id', deleteCandidateById);
router.put('/:id', updateCandidate);

export default router;

