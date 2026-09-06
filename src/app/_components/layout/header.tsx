"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = ["Home", "Services", "Skills", "Works"];

const Header = () => {
    const [activeSection, setActiveSection] = useState("home");

    useEffect(() => {
        const sections = navItems
            .map((item) => document.getElementById(item.toLowerCase()))
            .filter(Boolean);

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSection = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (visibleSection) {
                    setActiveSection(visibleSection.target.id);
                }
            },
            {
                threshold: [0.3, 0.5, 0.7],
            }
        );

        sections.forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <header className="fixed left-1/2 top-0 z-50 flex w-full -translate-x-1/2 items-center py-3 justify-between px-5 md:px-10 backdrop-blur-sm">
            <a
                href="#home"
                className="md:text-lg font-cursive font-semibold text-zinc-900 dark:text-white font-fancy text-sm"
            >
                Mahsa Geramy
            </a>

            <nav className="hidden md:flex items-center gap-2 rounded-full bg-transparent px-2 py-3">
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
                bg-[linear-gradient(90deg,var(--primary)_0%,#3b4a9e_20%,#3b4a9e_50%,var(--primary)_100%)]
                px-4 md:px-6 py-3 md:py-4 text-white"
            >
                <span className="text-sm md:text-base">Contact me</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight size={18} />
                </span>
            </a>
        </header>
    );
};

export default Header;