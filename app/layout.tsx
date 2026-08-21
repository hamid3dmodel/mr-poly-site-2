import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "MR POLY — Game-Ready 3D Assets",
  description:
      "MR POLY creates stylized low-poly and detailed realistic 3D assets for games and real-time projects.",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body>
      <Header />

      {children}

      <Footer />
      </body>
      </html>
  );
}