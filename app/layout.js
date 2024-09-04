import { Kranky } from "next/font/google";
import "./globals.css";

const kranky = Kranky({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "Happykids",
  description: "Online English Learning",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={kranky.className}>{children}</body>
    </html>
  );
}
