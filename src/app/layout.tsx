import type { Metadata } from "next";
import "@/styles/globals.css";
import CustomCursor from "@/app/_components/layout/customCursor";
import Header from "@/app/_components/layout/header";
import ScrollProgress from "@/app/_components/ui/scrollProgress";

export const metadata: Metadata = {
  title: "MahsaGeramy",
  description: "Mahsa Geramy Portfolio",
};

export default function RootLayout({children}: LayoutProps<"/">) {
  return (
      <html
          lang="en"
          className={`h-full antialiased`}
      >
      <body id="home" className="min-h-full flex flex-col justify-center items-center bg-black pb-10">
      <ScrollProgress/>
      {/*<CustomCursor/>*/}
      <Header/>
      {children}
      </body>
      </html>
  );
}
