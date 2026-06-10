import express from 'express';
import { issueStock, reconcileStock } from '../controllers/ledgerController.js';

const router = express.Router();

router.post('/issue', issueStock);
router.post('/reconcile/:ledgerId', reconcileStock);

export default router;