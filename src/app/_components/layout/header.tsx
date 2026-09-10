"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = ["Home", "Services", "Works"];

const Header = () => {
    const [activeSection, setActiveSection] = useState("home");

    useEffect(() => {
        const sections = navItems
            .map((item) => document.getElementById(item.toLowerCase()))
            .filter((section): section is HTMLElement => section !== null);

        const handleScroll = () => {
            const headerHeight = 100;

            let currentSection = "home";

            for (const section of sections) {
                const sectionTop = section.getBoundingClientRect().top;

                if (sectionTop <= headerHeight) {
                    currentSection = section.id;
                }
            }

            setActiveSection(currentSection);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header className="fixed left-1/2 top-0 z-50 flex w-full -translate-x-1/2 items-center justify-between px-5 py-3 backdrop-blur-sm md:px-10">
            <a
                href="#home"
                className="font-cursive text-sm font-semibold font-fancy text-white md:text-lg"
            >
                Mahsa Geramy
            </a>

            <nav className="hidden items-center gap-2 rounded-full bg-transparent px-2 py-3 md:flex">
                {navItems.map((item) => {
                    const sectionId = item.toLowerCase();
                    const isActive = activeSection === sectionId;

                    return (
                        <a
                            key={item}
                            href={`#${sectionId}`}
                            className={`group flex items-center gap-2 rounded-full px-4 py-2 font-medium transition-colors duration-300 ${
                                isActive
                                    ? "text-[var(--primary)]"
                                    : "text-zinc-600 dark:text-zinc-300"
                            }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full bg-[var(--primary)] transition-opacity duration-300 ${
                                    isActive
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-100"
                                }`}
                            />

                            <span>{item}</span>
                        </a>
                    );
                })}
            </nav>

            <a
                href="#contactMe"
                className="group flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full
                 bg-[linear-gradient(90deg,var(--primary)_0%,#4d5ba7_40%,#4d5ba7_60%,var(--primary)_100%)] px-4 py-3
                  text-white md:px-6 md:py-4"
            >
                <span className="text-sm md:text-base">
                    Contact me
                </span>

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight size={18} />
                </span>
            </a>
        </header>
    );
};

export default Header;