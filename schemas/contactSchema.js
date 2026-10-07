import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  email: z
    .string({ message: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase(),

  subject: z
    .string({ message: "Subject is required" })
    .trim()
    .max(150, "Subject is too long"),

  message: z
    .string({ message: "Message is required" })
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),

  attachment: z
    .any()
    .optional()
});