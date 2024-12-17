import { Questrial } from "next/font/google";
import "./globals.css";

const questrial = Questrial({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "Happykids",
  description: "Online English Learning",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={questrial.className}>{children}</body>
    </html>
  );
}
