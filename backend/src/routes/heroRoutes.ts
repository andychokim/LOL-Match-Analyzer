import express from 'express';
import * as heroController from '../controllers/heroControllers.js';

const router = express.Router();

// GET hero page
router.get('/', heroController.getHeroPageHandler);


export default router;
