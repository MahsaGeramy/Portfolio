"use client"
import { useState } from "react";
import Collapse from "@/app/_components/ui/collapse";
import { Code2, PencilIcon, Search,Globe } from "lucide-react";
import Reveal from "@/app/_components/ui/Reveal";

const services = [
    {
        id: 1,
        title: "Web Development",
        description:
            "I build scalable, responsive, and high-performance web applications using modern web technologies and development practices.",
        icon: Code2,
        tags: [
            "React",
            "Next.js",
            "TypeScript",
            "Node.js",
            "REST APIs",
            "Responsive Design",
        ],
    },
    {
        id: 2,
        title: "web Development",
        description:
            "I build and customize responsive WordPress websites with a focus on performance, usability, maintainability, and SEO.",
        icon: Globe,
        tags: [
            "WordPress",
            "Elementor",
            "Custom Themes",
            "Responsive Design",
            "SEO",
            "Performance",
        ],
    },
    {
        id: 3,
        title: "Web Design",
        description:
            "I create clean, responsive, and user-focused interfaces that balance visual design, usability, and performance.",
        icon: PencilIcon,
        tags: [
            "UI Design",
            "Responsive Design",
            "Figma",
            "Tailwind CSS",
            "User Experience",
            "Accessibility",
        ],
    },
    {
        id: 4,
        title: "SEO Specialist",
        description:
            "I optimize websites for better performance, search visibility, and user experience through technical SEO and modern web performance practices.",
        icon: Search,
        tags: [
            "Technical SEO",
            "Core Web Vitals",
            "Performance Optimization",
            "Semantic HTML",
            "Meta Tags",
            "Structured Data",
        ],
    },
];

const MyServices = () => {
    const [openItems, setOpenItems] = useState<Set<number>>(new Set());

    const toggleItem = (id: number) => {
        setOpenItems((current) => {
            const next = new Set(current);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    };

    return (
        <Reveal
            delay={200}
        >
            <section id="services" className="flex flex-col w-full max-w-[50rem] mt-20">
                <p className="mb-8 text-center text-3xl md:text-4xl font-bold text-zinc-100">
                    <span className="text-primary">My</span> Services
                </p>
                {services.map((service) => {
                    const Icon = service.icon;
                    return (
                        <Collapse
                            key={service.id}
                            isOpen={openItems.has(service.id)}
                            onClick={() => toggleItem(service.id)}
                            cutomButtonClasses="border-b border-gray-900 rounded-none"
                            title={
                                <div className="flex items-center gap-3 py-3">
                                    <Icon
                                        color="var(--primary)"
                                        size={30}
                                        strokeWidth={1.5}
                                    />
                                    <span className="text-xl md:text-2xl text-zinc-200">{service.title}</span>
                                </div>
                            }
                        >
                            <div className="pl-12 pt-5">
                                <p className="text-zinc-300">{service.description}</p>
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {service.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/60"
                                        >{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </Collapse>
                    );
                })}
            </section>
        </Reveal>
    );
};

export default MyServices;