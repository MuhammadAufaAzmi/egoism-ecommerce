"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface ActivityCard {
  label: string;
  activity: string;
  image: string;
}

const WOMEN_ACTIVITIES: ActivityCard[] = [
  { label: "RUNNING", activity: "running", image: "/activity-women-running-ai.png" },
  { label: "LIFTING", activity: "gym", image: "/activity-women-lifting-ai.png" },
  { label: "HIIT", activity: "crossfit", image: "/activity-women-hiit-ai.png" },
  { label: "PILATES", activity: "pilates", image: "/activity-women-pilates-ai.png" },
];

const MEN_ACTIVITIES: ActivityCard[] = [
  { label: "HYROX", activity: "hyrox", image: "/activity-men-hyrox-ai.png" },
  { label: "CROSSFIT", activity: "crossfit", image: "/activity-men-crossfit-ai.png" },
  { label: "RUNNING", activity: "running", image: "/activity-men-running-ai.png" },
  { label: "GYM", activity: "gym", image: "/activity-men-gym-ai.png" },
];

function ParallaxCard({
  card,
  index,
  gender,
}: {
  card: ActivityCard;
  index: number;
  gender: "women" | "men";
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const bg = bgRef.current;
    if (!wrapper || !bg) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = wrapper.getBoundingClientRect();
          const windowH = window.innerHeight;
          // Relative position: 0 = element center is at viewport center
          const relativePos = (rect.top + rect.height / 2 - windowH / 2) / windowH;
          // Parallax shift ±55px
          const shift = relativePos * 55;
          bg.style.transform = `translateY(${shift}px) scale(1.18)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={wrapperRef} className="relative overflow-hidden group cursor-pointer">
      {/* Parallax Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full transition-none"
        style={{
          transform: "translateY(0px) scale(1.18)",
          willChange: "transform",
        }}
      >
        <Image
          src={card.image}
          alt={card.label}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover object-center"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10 group-hover:from-black/95 group-hover:via-black/35 transition-all duration-600" />

      {/* Card content */}
      <Link href={`/${gender}?activity=${card.activity}`} className="relative z-10 h-[420px] md:h-[500px] flex flex-col justify-end p-6 block">
        <p className="text-[10px] md:text-[11px] tracking-[0.3em] text-on-primary/55 uppercase font-semibold mb-1.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          {gender === "women" ? "WOMEN" : "MEN"}
        </p>
        <h3 className="font-heading text-[24px] md:text-[30px] leading-tight text-on-primary uppercase font-bold tracking-tight translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75">
          {card.label}
        </h3>
        {/* Underline slide-in reveal */}
        <span className="block mt-3 h-[1.5px] bg-on-primary/70 w-0 group-hover:w-10 transition-all duration-500 delay-100" />
      </Link>
    </div>
  );
}

export default function TrainCategorySection() {
  const [gender, setGender] = useState<"women" | "men">("women");
  const activities = gender === "women" ? WOMEN_ACTIVITIES : MEN_ACTIVITIES;

  return (
    <section className="w-full max-w-[1440px] mx-auto px-5 md:px-16 py-20 md:py-28">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
        <div>
          <p className="text-[11px] tracking-[0.25em] text-secondary uppercase font-semibold mb-3">
            SHOP BY ACTIVITY
          </p>
          <h2 className="font-heading text-[32px] md:text-[52px] leading-[1.05] text-primary uppercase tracking-tight font-bold">
            HOW DO YOU TRAIN?
          </h2>
        </div>

        {/* Toggle button */}
        <div className="flex items-center border border-outline-variant/50 p-1 self-start sm:self-auto flex-shrink-0">
          <button
            onClick={() => setGender("women")}
            className={`px-6 py-2.5 text-[12px] tracking-[0.15em] font-semibold uppercase transition-all duration-300 ${
              gender === "women"
                ? "bg-primary text-on-primary"
                : "text-secondary hover:text-primary"
            }`}
          >
            WOMEN
          </button>
          <button
            onClick={() => setGender("men")}
            className={`px-6 py-2.5 text-[12px] tracking-[0.15em] font-semibold uppercase transition-all duration-300 ${
              gender === "men"
                ? "bg-primary text-on-primary"
                : "text-secondary hover:text-primary"
            }`}
          >
            MEN
          </button>
        </div>
      </div>

      {/* Parallax Card Grid */}
      <div
        key={gender}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        style={{ animation: "fadeInGrid 0.45s ease both" }}
      >
        {activities.map((card, index) => (
          <ParallaxCard
            key={card.label}
            card={card}
            index={index}
            gender={gender}
          />
        ))}
      </div>

      {/* View All link */}
      <div className="mt-8 flex justify-end">
        <Link
          href={`/${gender}`}
          className="text-[12px] tracking-[0.2em] uppercase font-semibold text-secondary hover:text-primary transition-colors duration-300 flex items-center gap-3"
        >
          VIEW ALL {gender === "women" ? "WOMEN" : "MEN"}
          <span className="w-8 h-[1px] bg-current inline-block" />
        </Link>
      </div>
    </section>
  );
}
