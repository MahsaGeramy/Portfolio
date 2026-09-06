import TypingText from "@/app/_components/ui/TypingText";
import Image from "next/image";
import GirlPic from "../../../../public/images/girl.webp";
import {ArrowDown, ArrowRight} from "lucide-react";
import Reveal from "@/app/_components/ui/Reveal";

const HeroSection = () =>
{
    return(
        <>
            <section id="home" className="relative animate-fade-up flex max-w-2xl flex-col items-center justify-center text-center py-10">
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
                <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                    Hi! I’m Mahsa.
                </p>

                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Front-End Developer &
                </h1>

                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-zinc-500 dark:text-zinc-400">
                    <TypingText />
                </h2>

                <p className="mt-6 md:text-lg md:leading-8 text-zinc-600 dark:text-zinc-300">
                    I Build Designs and Websites that solve problems, inspiring
                    success.
                </p>

                <section className="relative mt-10 h-[300px] md:h-[400px] w-[300px] md:w-[250px]">
                    <div
                        className="absolute inset-0 translate-x-[5px] md:translate-x-[-40px] translate-y-[12px] animate-card-back
                        rounded-3xl border border-white/10 bg-white/[0.01] opacity-35 shadow-2xl
                        backdrop-blur-sm"
                    />
                    <div
                        className="absolute inset-0 translate-x-[10px] md:translate-x-[-20px] translate-y-[6px] animate-card-middle
                        rounded-3xl border border-white/10 bg-white/[0.5] opacity-55 shadow-2xl
                        backdrop-blur-sm"
                    />
                    <div className="absolute inset-0 translate-x-[15px] animate-card-front overflow-hidden rounded-3xl border
                         border-white/10 bg-white/[0.08] opacity-100 shadow-2xl backdrop-blur-sm"
                    >
                        <Image
                            src={GirlPic}
                            alt="Mahsa Geramy"
                            fill
                            className="object-cover rotate-0"
                            // width={5000}
                            // height={5000}
                            // sizes="250px"
                        />
                    </div>
                    <div className="absolute bottom-[-5px] right-0 z-10">
                        <div className="relative flex h-28 w-28 items-center justify-center">
                            <svg
                                className="absolute inset-0 h-full w-full animate-spin-slow"
                                viewBox="0 0 120 120"
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
                                <ArrowDown className="text-black" size={20} />
                            </div>
                        </div>
                    </div>
                </section>
            </section>
            <section className="mt-20 md:mt-32 mb-10 md:mb-24 flex flex-col md:flex-row w-full gap-5 md:gap-10">
                <Reveal
                    className="w-full md:w-[60%]"
                >
                    <p className="text-2xl font-bold">
                        About Me: Freelancer who enjoys <label className="text-primary">web design</label> and
                        <label className="text-primary"> development</label>, passionate about my work, disciplined and
                        successful.
                    </p>
                </Reveal>
                <Reveal
                    delay={200}
                    className="w-full md:w-[40%]"
                >
                    <div className="flex flex-col items-center gap-3">
                        <p>
                            If you have a project in mind, check out my work
                            and contact me to work together. Best of luck!
                        </p>
                        <a href="#contactMe"
                            className="group mt-4 md:mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-full
                            bg-[linear-gradient(90deg,var(--primary)_0%,#3b4a9e_20%,#3b4a9e_50%,var(--primary)_100%)]
                            px-6 py-4 text-white disabled:cursor-not-allowed disabled:opacity-50 w-fit"
                        >
                            <span>Contact me</span>

                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                                <ArrowRight size={18} />
                            </span>
                        </a>
                    </div>
                </Reveal>
            </section>
        </>
    )
}

export default HeroSection;