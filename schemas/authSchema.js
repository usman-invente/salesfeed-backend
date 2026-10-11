import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string({ message: "Name is required" })
      .trim()
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string({ message: "Email is required" })
      .trim()
      .min(1, "Email is required")
      .email("Invalid email format")
      .toLowerCase(),

    termsAccepted: z
      .boolean({ message: "You must accept the terms and conditions" })
      .refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),

    password: z
      .string({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Yeh error specifically confirmPassword field ke neeche dikhega
  });

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase(),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});
