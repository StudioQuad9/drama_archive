// // ## GSAPで動かしてみる

// // @/components/ui/GsapScrollReveal/index.jsx

// "use client";

// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";

// gsap.registerPlugin(ScrollTrigger, useGSAP);

// export default function GsapScrollReveal() {
//   useGSAP(() => {
//     const element = document.querySelector("[data-reveal-test]");

//     if (!element) return;

//     gsap.from(element, {
//       autoAlpha: 0,
//       y: 40,
//       duration: 0.8,
//       scrollTrigger: {
//         trigger: element,
//         start: "top 90%",
//         once: true,
//         // 動作確認後コメントアウト
//         markers: true,
//       }
//     });
//   });
//   // このコンポーネント自身は何も表示しない。
//   return null;
// }


// // ## 複数の要素に設定する1

// // @/components/ui/GsapScrollReveal/index.jsx

// "use client";

// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";

// gsap.registerPlugin(ScrollTrigger, useGSAP);

// export default function GsapScrollReveal() {
//   useGSAP(() => {
//     const elements = gsap.utils.toArray("[data-reveal]");

//     elements.forEach((element) => {
//       gsap.from(element, {
//         autoAlpha: 0,
//         y: 40,
//         duration: 0.8,
//         scrollTrigger: {
//           trigger: element,
//           start: "top 90%",
//           once: true,
//         },
//       });
//     });
//   });

//   return null;
// }


// // ## 複数の要素に設定する2

// // @/components/ui/GsapScrollReveal/index.jsx

// "use client";

// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";

// gsap.registerPlugin(ScrollTrigger, useGSAP);

// export default function GsapScrollReveal() {
//   useGSAP(() => {
//     const elements = gsap.utils.toArray("[data-reveal]");

//     ScrollTrigger.batch(elements, {
//       start: "top 90%",
//       once: true,
//       onEnter: (items) => {
//         gsap.from(items, {
//           autoAlpha: 0,
//           y: 40,
//           duration: 0.8,
//           stagger: 0.15,
//         });
//       },
//     });
//   });

//   return null;
// }


// // ## 複数の要素に設定する3

// // @/components/ui/GsapScrollReveal/index.jsx

// "use client";

// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";

// gsap.registerPlugin(ScrollTrigger, useGSAP);

// export default function GsapScrollReveal() {
//   useGSAP(() => {
//     const elements = gsap.utils.toArray("[data-reveal]");

//     gsap.set(elements, {
//       autoAlpha: 0,
//       y: 40,
//     });

//     ScrollTrigger.batch(elements, {
//       start: "top 90%",
//       once: true,
//       markers: true,
//       onEnter: (items) => {
//         gsap.to(items, {
//           autoAlpha: 1,
//           y: 0,
//           duration: 0.8,
//           stagger: 0.15,
//         });
//       },
//     });
//   });

//   return null;
// }


// ## 複数の要素に設定する4

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