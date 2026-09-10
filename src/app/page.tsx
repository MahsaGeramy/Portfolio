import MyServices from "@/app/_components/sections/myServices";
import ContactMe from "@/app/_components/sections/contactMe";
import HeroSection from "@/app/_components/sections/heroSection";
import MyWorks from "@/app/_components/sections/myWorks";

export default function Home() {

    return (
        <main className="flex min-h-screen max-w-[1140px] w-full flex-col items-center justify-center px-6 font-sans mt-5 md:mt-10">
            <HeroSection />
            <MyServices/>
            <MyWorks/>
            <ContactMe/>
        </main>
    );
}