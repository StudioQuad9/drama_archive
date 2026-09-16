import { Archivo, Zen_Kaku_Gothic_New, Cormorant_Garamond, Noto_Serif_JP } from "next/font/google";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import "@/styles/reset.css";
import "./globals.scss";

const archivo = Archivo({
  weight: ["500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-en",
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-ja",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif-en",
});

const notoSerifJp = Noto_Serif_JP({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif-ja",
});

export const metadata = {
  title: {
    default: "Drama Archive",
    template: "%s | Drama Archive"
  },
  description: "海外ドラマのレビューをまとめた個人アーカイブ",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ja"
      className={`
        ${archivo.variable}
        ${zenKakuGothicNew.variable}
        ${cormorant.variable}
        ${notoSerifJp.variable}
      `}
      >
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
