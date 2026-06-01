"use client";

import { useState } from "react";
import { submitContact } from "./actions";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const result = await submitContact(formData);

    setStatus(result);
    if (result.success) {
      e.currentTarget.reset();
      // Auto clear success message after 5 seconds
      setTimeout(() => setStatus(null), 5000);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10 w-full max-w-xl">
      <div className="flex flex-col gap-2">
        <label
          className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold uppercase text-secondary"
          htmlFor="name"
        >
          NAME
        </label>
        <input
          className="bg-transparent border-0 border-b border-primary p-0 py-3 text-[18px] text-primary placeholder:text-secondary/40 focus:ring-0 focus:outline-none focus:border-primary rounded-none"
          id="name"
          name="name"
          placeholder="ENTER YOUR NAME"
          type="text"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold uppercase text-secondary"
          htmlFor="email"
        >
          EMAIL
        </label>
        <input
          className="bg-transparent border-0 border-b border-primary p-0 py-3 text-[18px] text-primary placeholder:text-secondary/40 focus:ring-0 focus:outline-none focus:border-primary rounded-none"
          id="email"
          name="email"
          placeholder="ENTER YOUR EMAIL"
          type="email"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          className="text-[12px] leading-[16px] tracking-[0.2em] font-semibold uppercase text-secondary"
          htmlFor="message"
        >
          MESSAGE
        </label>
        <textarea
          className="bg-transparent border-0 border-b border-primary p-0 py-3 text-[18px] text-primary placeholder:text-secondary/40 focus:ring-0 focus:outline-none focus:border-primary rounded-none resize-none"
          id="message"
          name="message"
          placeholder="HOW CAN WE ASSIST YOU?"
          rows={4}
          required
        />
      </div>

      {status && (
        <div className={`text-[13px] tracking-wide p-3 border ${status.success ? "border-green-500 text-green-700 bg-green-50" : "border-red-500 text-red-700 bg-red-50"}`}>
          {status.success ? "Thank you! Your message has been sent successfully." : status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-on-primary text-[14px] tracking-[0.05em] font-medium uppercase py-5 px-8 hover:opacity-80 transition-opacity duration-300 w-full rounded-none mt-4 tracking-widest disabled:opacity-50"
      >
        {loading ? "SENDING..." : "SEND MESSAGE"}
      </button>
    </form>
  );
}
