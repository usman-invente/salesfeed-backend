import express from 'express';
import authRoutes from './authRoutes.js';
import contactRoutes from './contactRoutes.js';

const router = express.Router();

// Mount Domain Routes under specific path prefixes
router.use('/', authRoutes);      // Endpoints: /api/v1/auth/register, /api/v1/auth/login
router.use('/', contactRoutes);       // Endpoint:  /api/v1/contact

export default router;