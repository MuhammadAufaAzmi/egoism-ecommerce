"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  question: string;
  answer: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto divide-y divide-gray-200 border-t border-b border-gray-200", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="py-4">
            <button
              type="button"
              className="flex w-full items-center justify-between text-left focus:outline-none"
              onClick={() => toggle(index)}
            >
              <span className="text-base font-medium text-gray-900">{item.question}</span>
              <ChevronDown
                className={cn("w-5 h-5 text-gray-500 transition-transform duration-200", isOpen ? "rotate-180" : "")}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
              )}
            >
              <p className="text-sm text-gray-500 leading-relaxed">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
