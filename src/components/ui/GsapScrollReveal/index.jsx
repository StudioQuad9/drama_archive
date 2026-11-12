// @/components/ui/GsapScrollReveal/index.jsx

"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function GsapScrollReveal() {
  const pathname = usePathname();

  useGSAP(() => {
    const elements = gsap.utils.toArray("[data-reveal]");

    gsap.set(elements, {
      autoAlpha: 0,
      y: 40,
    });

    ScrollTrigger.batch(elements, {
      start: "top 90%",
      once: true,
      // markers: true,
      onEnter: (items) => {
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          overwrite: true,
          clearProps: "opacity,visibility,transform",
        });
      },
    });
  }, { dependencies: [pathname], revertOnUpdate: true });

  return null;
}