import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import CustomCursor from "@/app/_components/layout/CustomCursor";
import Header from "@/app/_components/layout/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MahsaGeramy",
  description: "Mahsa Geramy Portfolio",
};

export default function RootLayout({children}: LayoutProps<"/">) {
  return (
      <html
          lang="en"
          className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
      <body id="home" className="min-h-full flex flex-col justify-center items-center bg-black pb-10">
      <CustomCursor/>
      <Header/>
      {children}
      </body>
      </html>
  );
}
