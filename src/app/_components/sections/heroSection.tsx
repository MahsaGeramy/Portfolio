import TypingText from "@/app/_components/ui/TypingText";
import Image from "next/image";
import GirlPic from "../../../../public/images/girl.webp";
import {ArrowDown, ArrowRight} from "lucide-react";
import Reveal from "@/app/_components/ui/Reveal";
import DotGrid from "@/app/_components/ui/DotGrid";

const HeroSection = () =>
{
    return(
        <>
            <section className="w-full flex justify-center pb-12 pt-5" style={{ position: "relative", color: "#a1a1aa" }}>
                <DotGrid />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <section className="relative animate-fade-up flex max-w-2xl flex-col items-center justify-center text-center py-10">
                        <div
                            className="pointer-events-none absolute left-1 top-1 h-[400px] w-[400px] -translate-x-1/2
                    animate-float rounded-full bg-blue-900/50 blur-[120px]"
                        />
                        {/*<div*/}
                        {/*    className="pointer-events-none absolute right-10 bottom-0 h-[300px] w-[300px] -translate-x-1/2*/}
                        {/*    animate-float rounded-full bg-blue-900/50 blur-[120px]"*/}
                        {/*/>*/}
                        <div
                            className="pointer-events-none absolute right-[-30rem] bottom-0 h-[300px] w-[300px] -translate-x-1/2
                    animate-float rounded-full bg-blue-900/50 blur-[120px] hidden md:block"
                        />
                        <p className="mt-6 text-lg leading-8 text-zinc-300">
                            Hi! I’m Mahsa.
                        </p>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-50">
                            Front-End Engineer &
                        </h1>

                        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-zinc-500 dark:text-zinc-400">
                            <TypingText />
                        </h2>

                        <p className="mt-6 md:text-lg md:leading-8 text-zinc-300">
                            I Build Designs and Websites that solve problems, inspiring
                            success.
                        </p>
                        <section className="group relative mt-10 h-[300px] md:h-[400px] w-[200px] md:w-[250px]">
                            {/* کارت پشتی — before: ناحیه‌ی هاور رو ۲۰px به چپ پهن‌تر می‌کنه چون فقط یه نوار باریک ازش دیده می‌شه */}
                            <div className="group/back absolute inset-0 translate-x-[5px] md:translate-x-[-40px] translate-y-[12px]
    md:before:absolute md:before:inset-y-0 md:before:-left-5 md:before:w-5">
                                <div className="h-full w-full transition-transform duration-500 ease-out md:group-hover/back:-translate-x-3.5">
                                    <div className="h-full w-full animate-card-back rounded-3xl border border-white/10 bg-white/[0.3] opacity-40
        shadow-2xl backdrop-blur-sm" />
                                </div>
                            </div>

                            {/* کارت وسط */}
                            <div className="group/middle absolute inset-0 translate-x-[10px] md:translate-x-[-20px] translate-y-[6px]">
                                <div className="h-full w-full transition-transform duration-500 ease-out md:group-hover/middle:-translate-x-3.5">
                                    <div className="h-full w-full animate-card-middle rounded-3xl border border-white/10 bg-white/[0.5] opacity-55
        shadow-2xl backdrop-blur-sm" />
                                </div>
                            </div>

                            {/* کارت جلویی — به چپ می‌ره، عکس کمی زوم می‌شه و یه درخشش آبی می‌گیره */}
                            <div className="group/front absolute inset-0 translate-x-[15px]">
                                <div className="h-full w-full transition-transform duration-500 ease-out md:group-hover/front:-translate-x-3.5">
                                    <div className="relative h-full w-full animate-card-front overflow-hidden rounded-3xl border border-white/10
        bg-white/[0.08] shadow-2xl backdrop-blur-sm transition-[border-color,box-shadow] duration-500
        md:group-hover/front:border-white/30 md:group-hover/front:shadow-[0_0_60px_-10px_rgba(77,91,167,0.7)]">
                                        <Image
                                            src={GirlPic}
                                            alt="Mahsa Geramy"
                                            sizes="(max-width: 768px) 300px, 500px"
                                            fill
                                            fetchPriority="high"
                                            className="object-cover rotate-0 transition-transform duration-700 ease-out md:group-hover/front:scale-105"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* دکمه‌ی گردان: لینک به بخش About */}
                            <a
                                href="#about"
                                aria-label="Scroll to About section"
                                className="absolute bottom-[-5px] right-0 z-10 rounded-full
                                transition-transform duration-300 hover:scale-110 focus-visible:scale-110
                                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                <div className="relative flex h-28 w-28 items-center justify-center">
                                    <svg
                                        className="absolute inset-0 h-full w-full animate-spin-slow
                                        md:group-hover:[animation-duration:6s]"
                                        viewBox="0 0 120 120"
                                        aria-hidden="true"
                                    >
                                        <defs>
                                            <path
                                                id="text-circle"
                                                d="M 60,60 m -43,0 a 43,43 0 1,1 86,0 a 43,43 0 1,1 -86,0"
                                            />
                                        </defs>
                                        <text
                                            fill="white"
                                            fontSize="10"
                                            fontWeight="500"
                                            letterSpacing="1.5"
                                        >
                                            <textPath
                                                href="#text-circle"
                                                startOffset="0%"
                                            >
                                                LET&apos;S EXPLORE MORE • LET&apos;S
                                                EXPLORE MORE • LET&apos;S EXPLORE MORE •
                                            </textPath>
                                        </text>
                                    </svg>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                                        <ArrowDown
                                            className="text-black transition-transform duration-300 md:group-hover:translate-y-0.5"
                                            size={20}
                                        />
                                    </div>
                                </div>
                            </a>
                        </section>
                    </section>
                </div>
            </section>
            <section id="about" className="mt-20 md:mt-10 mb-10 md:mb-24 flex flex-col md:flex-row w-full gap-5 md:gap-10">
                <Reveal
                    className="w-full md:w-[60%]"
                >
                    <p className="text-2xl font-bold text-zinc-300">
                        About Me: Freelancer who enjoys <label className="text-primary">web design</label> and
                        <label className="text-primary"> development</label>, passionate about my work, disciplined and
                        successful.
                    </p>
                </Reveal>
                <Reveal
                    delay={200}
                    className="w-full md:w-[40%]"
                >
                    <div className="flex flex-col items-center gap-5">
                        <p className="text-zinc-300">
                            If you have a project in mind, check out my work
                            and contact me to work together. Best of luck!
                        </p>
                        <div className="flex flex-col md:flex-row gap-3 md:gap-5 justify-start w-full">
                            <a href="#contactMe"
                               className="group flex cursor-pointer items-center justify-center gap-2 rounded-full
                            bg-[linear-gradient(90deg,var(--primary)_0%,#4d5ba7_40%,#4d5ba7_60%,var(--primary)_100%)]
                            px-6 py-4 text-white disabled:cursor-not-allowed disabled:opacity-50 w-full md:w-fit"
                            >
                                <span>Contact me</span>

                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                <ArrowRight size={18} />
                            </span>
                            </a>
                            <a
                                href="/MahsaGeramy.pdf"
                                download
                                className="group flex cursor-pointer items-center justify-center gap-2 rounded-full
                                border border-[var(--primary)] px-6 py-4 text-white transition-all duration-300

    hover:bg-white/10 w-full md:w-fit"
                            >
                                <span>Download Resume</span>

                                <span className="transition-transform duration-300 group-hover:translate-y-1">
        <ArrowDown size={18} />
    </span>
                            </a>
                        </div>
                    </div>
                </Reveal>
            </section>
        </>
    )
}

export default HeroSection;