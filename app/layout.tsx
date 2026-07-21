import type { Metadata } from "next";
import "./globals.css";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Preloader />
        <div className="page-reveal">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
