"use client";

import { useRef, useEffect, useState } from "react";
import { useSprings, animated } from "@react-spring/web";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export default function BlurText({ text, delay = 200, className }: BlurTextProps) {
  const words = text.split(" ");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  const springs = useSprings(
    words.length,
    words.map((_, i) => ({
      from: { filter: "blur(10px)", opacity: 0, transform: "translate3d(0, 50px, 0)" },
      to: inView
        ? async (next: any) => {
            await next({ filter: "blur(5px)", opacity: 0.5, transform: "translate3d(0, 20px, 0)" });
            await next({ filter: "blur(0px)", opacity: 1, transform: "translate3d(0, 0px, 0)" });
          }
        : { filter: "blur(10px)", opacity: 0 },
      delay: i * delay,
    }))
  );

  return (
    <p ref={ref} className={cn("inline-block", className)}>
      {springs.map((props, index) => (
        <animated.span
          key={index}
          style={props}
          className="inline-block whitespace-pre"
        >
          {words[index]}{" "}
        </animated.span>
      ))}
    </p>
  );
}
