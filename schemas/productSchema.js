import { z } from "zod";

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



  seller: z
    .string({ message: "Seller name is required" })
    .trim()
    .min(1, "Seller name is required"),

  imageAlt: z.string().trim().default(""),

  tone: z.string().trim().default("sand"),
});
