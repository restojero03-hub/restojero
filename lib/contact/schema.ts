import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100, "Use 100 characters or fewer."),
  email: z.email("Enter a valid email address.").max(254, "Enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(10, "Add a little more detail so I can reply properly.")
    .max(5000, "Keep your message under 5,000 characters."),
});
