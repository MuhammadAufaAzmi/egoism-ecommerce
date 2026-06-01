"use server";

import { sendContactEmail } from "@/lib/email";

export async function submitContact(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, message: "Semua kolom wajib diisi." };
  }

  return await sendContactEmail(name, email, message);
}
