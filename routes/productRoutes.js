import express from 'express';
import { validate } from "../middleware/validate.js";
import { createUnifiedUpload } from '../middleware/upload.js';
import * as productController from '../controllers/productController.js';
import { productSchema } from "../schemas/productSchema.js";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZES } from '../config/fileConstants.js';
const router = express.Router();

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const uploadImage = createUnifiedUpload("images", ALLOWED_IMAGE_TYPES, MAX_FILE_SIZES.IMAGE); // 5 MB limit

router.route('/product')
  .post(uploadImage.single("image"),validate(productSchema), productController.submitProductForm);

export default router;