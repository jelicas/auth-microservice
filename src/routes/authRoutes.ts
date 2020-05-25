import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const authRoutes = Router();

authRoutes.post('/login', AuthController.logIn);

authRoutes.post('/register', AuthController.register);

export { authRoutes };