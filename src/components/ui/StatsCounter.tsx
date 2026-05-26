"use client";

import { useRef, useEffect, useState } from "react";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 500, suffix: "+", label: "CURATED PIECES" },
  { value: 10, suffix: "K+", label: "HAPPY CUSTOMERS" },
  { value: 50, suffix: "+", label: "CITIES REACHED" },
];

function AnimatedNumber({
  target,
  suffix,
  isVisible,
}: {
  target: number;
  suffix: string;
  isVisible: boolean;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, target]);

  return (
    <span>
      {current}
      {suffix}
    </span>
  );
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="w-full py-20 md:py-28 bg-surface-container-lowest"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center scroll-reveal ${isVisible ? "visible" : ""}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <p className="font-heading text-[48px] md:text-[72px] leading-none font-bold text-primary tracking-tight mb-3">
                <AnimatedNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                />
              </p>
              <div className="w-12 h-[1px] bg-secondary/30 mx-auto mb-4" />
              <p className="text-[12px] tracking-[0.2em] font-medium text-secondary uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
