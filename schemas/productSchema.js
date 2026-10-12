import { z } from "zod";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZES } from "../config/fileConstants.js";

export const productSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(1, "Title is required"),

  price: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.coerce
      .number({ message: "Price is required" })
      .finite("Price must be a valid number")
      .min(0, "Price cannot be negative"),
  ),

  location: z
    .string({ message: "Location is required" })
    .trim()
    .min(1, "Location is required"),

  category: z
    .string({ message: "Category is required" })
    .trim()
    .min(1, "Category is required"),

  condition: z.enum(["New", "Like new", "Good", "Fair", "Poor"], {
    message: "Product condition is required",
  }),

  image: z.object(
    {
      mimetype: z.enum(ALLOWED_IMAGE_TYPES, {
        message: "Invalid image format",
      }),
      size: z.number().max(MAX_FILE_SIZES.IMAGE, {
        message: "Image size exceeds the maximum limit of 5 MB",
      }),
    },
    {
      error: "Image is required and must be a valid image file",
    },
  ),

  seller: z
    .string({ message: "Seller name is required" })
    .trim()
    .min(1, "Seller name is required"),

  imageAlt: z.string().trim().default(""),

  tone: z.string().trim().default("sand"),
});
