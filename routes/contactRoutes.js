import express from 'express';
import { validate } from "../middleware/validate.js";
import { contactSchema } from "../schemas/contactSchema.js";
import * as contactController from '../controllers/contactController.js';
import { uploadPdf } from '../middleware/pdfUploadMiddleware.js';
const router = express.Router();

router.route('/contact')
  .post(uploadPdf.single('attachment'), validate(contactSchema), contactController.submitContactForm);

export default router;