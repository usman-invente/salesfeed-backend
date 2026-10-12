import express from 'express';
import { validate } from "../middleware/validate.js";
import { createUnifiedUpload } from '../middleware/upload.js';
import { contactSchema } from "../schemas/contactSchema.js";
import * as contactController from '../controllers/contactController.js';

const router = express.Router();


const uploadPdf = createUnifiedUpload('pdfs', ['application/pdf'], 10 * 1024 * 1024); // 10 MB limit

router.route('/contact')
  .post(uploadPdf.single('attachment'), validate(contactSchema), contactController.submitContactForm);

export default router;