import express from 'express';
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../schemas/authSchema.js";
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.route('/')
  .get(authController.getUsers);

router.route('/register')
 .post(validate(registerSchema), authController.saveUser);

router.route('/login')
 .post(validate(loginSchema), authController.login);

export default router;