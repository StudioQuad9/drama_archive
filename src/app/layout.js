import Header from "@/components/Header";
import Footer from "@/components/Footer";

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <Header />
      <body>{children}</body>
      <Footer />
    </html>
  );
}
