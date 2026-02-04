import express from 'express';
import * as heroController from '../controllers/heroControllers';

const router = express.Router();

// GET hero page
router.get('/', heroController.getHeroPageHandler);


export default router;
