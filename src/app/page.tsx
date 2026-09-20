import HeroSection from "@/app/_components/sections/heroSection";
import dynamic from "next/dynamic";

const MyWorks = dynamic(() => import("@/app/_components/sections/myWorks"));
const MyServices = dynamic(() => import("@/app/_components/sections/myServices"));
const ContactMe = dynamic(() => import("@/app/_components/sections/contactMe"));
import ScrollSnakeLoader from "@/app/_components/ui/scollSnake/scrollSnakeLoader";
import ScrollSnakePath from "@/app/_components/ui/scollSnake/scrollSnakePath";


export default function Home() {

    return (
        <main className="flex min-h-screen max-w-[1140px] w-full flex-col items-center justify-center px-3 font-sans mt-5 md:mt-10">
            <ScrollSnakePath />
            <HeroSection />
            <MyServices/>
            <MyWorks/>
            <ContactMe/>
            <ScrollSnakeLoader />
        </main>
    );
}