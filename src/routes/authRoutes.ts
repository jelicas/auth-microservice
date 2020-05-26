import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const authRoutes = Router();

authRoutes.post('/login', AuthController.logIn);

authRoutes.post('/register', AuthController.register);

authRoutes.post('/refresh', AuthController.refresh);

export { authRoutes };