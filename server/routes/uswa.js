import express from 'express';
import getUswa from '../controllers/uswa.js';

const router=express.Router();


router.get('/uswa',getUswa);

export default router;