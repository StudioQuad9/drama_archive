// src/components/ui/ScrollObserver/index.jsx

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollObserver() {
  const pathName = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll(".appear");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("inview");
        observer.unobserve(entry.target);
      });
    });

    targets.forEach((target) => {
      observer.observe(target);
    });

    return () => {
      observer.disconnect();
    };
  }, [pathName]);
}