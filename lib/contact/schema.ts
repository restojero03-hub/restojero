import { z } from "zod";

// Invisible control characters have no place in a message, and the database refuses a null
// character outright. Line breaks and tabs stay.
function removeControlCharacters(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

export const contactSchema = z.object({
  name: z
    .string()
    .overwrite(removeControlCharacters)
    .trim()
    .min(1, "Enter your name.")
    .max(100, "Use 100 characters or fewer."),
  email: z.email("Enter a valid email address.").max(254, "Enter a valid email address."),
  message: z
    .string()
    .overwrite(removeControlCharacters)
    .trim()
    .min(10, "Add a little more detail so I can reply properly.")
    .max(5000, "Keep your message under 5,000 characters."),
});
