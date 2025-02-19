import express from 'express';
import { requestController } from '../../controllers/owner/requestController.js';
import authUserMiddleware from '../../middlewares/authUserMiddleware.js';

const router = express.Router();

// Ruta GET para obtener las solicitudes de alquiler
router.get('/requests', authUserMiddleware, requestController);

export default router;
