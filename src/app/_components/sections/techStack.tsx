"use client"
import { useState } from "react";
import Collapse from "@/app/_components/ui/collapse";
import Reveal from "@/app/_components/ui/Reveal";
import Image from "next/image";
import NodeJs from "../../../../public/images/technologies/nodeJs.webp";
import GitLab from "../../../../public/images/technologies/gitlab.webp";
import WebStorm from "../../../../public/images/technologies/WebStorm.webp";
import Jira from "../../../../public/images/technologies/Jira.webp";
import Trello from "../../../../public/images/technologies/Trello.webp";

const technologyGroups = [
    {
        name: "Development",
        technologies: [
            {
                name: "Next.js",
                category: "Framework",
                icon: "/images/technologies/nextjs.webp",
            },
            {
                name: "React",
                category: "Framework",
                icon: "/images/technologies/react.webp",
            },
            {
                name: "Node.js",
                category: "Runtime",
                icon: NodeJs,
            },
            {
                name: "TypeScript",
                category: "Language",
                icon: "/images/technologies/typescript.webp",
            },
            {
                name: "JavaScript",
                category: "Language",
                icon: "/images/technologies/javascript.webp",
            },
            {
                name: "Tailwind CSS",
                category: "CSS",
                icon: "/images/technologies/tailwind.webp",
            },
            {
                name: "shadcn/ui",
                category: "UI Library",
                icon: "/images/technologies/shadcn.svg",
            },
            {
                name: "Redux & Redux Toolkit",
                category: "State Management",
                icon: "/images/technologies/redux.webp",
            },
            {
                name: "React Hook Form",
                category: "Form Management",
                icon: "/images/technologies/reactHookForm.webp",
            },
            {
                name: "Zod",
                category: "Validation",
                icon: "/images/technologies/zod.webp",
            },
        ],
    },
    {
        name: "Tools & Workflow",
        technologies: [
            {
                name: "Git",
                category: "Version Control",
                icon: "/images/technologies/git.webp",
            },
            {
                name: "GitHub",
                category: "Version Control",
                icon: "/images/technologies/github.webp",
            },
            {
                name: "fdbhdfhb",
                category: "Version Control",
                icon: GitLab,
            },
            {
                name: "Docker",
                category: "Containerization",
                icon: "/images/technologies/docker.webp",
            },
            {
                name: "Vercel",
                category: "Deployment",
                icon: "/images/technologies/vercel.webp",
            },
            {
                name: "Figma",
                category: "Design",
                icon: "/images/technologies/figma.webp",
            },
            {
                name: "Visual Studio Code",
                category: "IDE",
                icon: "/images/technologies/vscode.webp",
            },
            {
                name: "WebStorm",
                category: "IDE",
                icon: WebStorm,
            },
            {
                name: "Trello",
                category: "Project Management",
                icon: Trello,
            },
            {
                name: "Jira",
                category: "Project Management",
                icon: Jira,
            },
        ],
    },
    {
        name: "AI",
        technologies: [
            {
                name: "Claude",
                category: "AI Assistant",
                icon: "/images/technologies/claude.webp",
            },
            {
                name: "ChatGPT",
                category: "AI Assistant",
                icon: "/images/technologies/chatgpt.webp",
            },
            {
                name: "Cursor",
                category: "AI IDE",
                icon: "/images/technologies/cursor.webp",
            },
            {
                name: "DeepSeek",
                category: "AI Assistant",
                icon: "/images/technologies/deepseek.webp",
            },
        ],
    },
];

const TechStack = () => {

    return (
        <Reveal
            className="w-full flex justify-center"
            delay={200}
        >
            <section id="techstack" className="flex flex-col w-full max-w-[90rem] pt-20">
                <p className="mb-8 text-center text-3xl md:text-4xl font-bold text-zinc-100">
                    <span className="text-primary">My</span> Tech Stack
                </p>
                {technologyGroups.map((group) =>
                    <div key={group.name} className="flex flex-col gap-2 text-white font-bold mt-5">
                        <label className="text-xl">{group.name}</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
                            {group.technologies.map((technology) =>
                                    <div
                                        key={technology.name}
                                        className="group relative overflow-hidden rounded-xl p-4 bg-white/10 text-white
                                         transition-all duration-500 hover:bg-white/[0.14]"
                                    >
                                        <Image src={technology.icon} alt="" width={500} height={500}
                                               className="absolute top-1 right-2 z-0 h-20 w-20 object-contain opacity-[0.08]
                                    grayscale transition-all duration-500 ease-out group-hover:h-30 group-hover:w-30
                                    group-hover:-right-4 group-hover:-bottom-4 group-hover:opacity-[0.2] group-hover:grayscale-0
                                    group-hover:rotate-6"
                                        />
                                        <div
                                            className="
            absolute inset-0 z-[1]
            bg-gradient-to-br
            from-black/10
            via-transparent
            to-black/40
        "
                                        />

                                        {/* Content */}
                                        <div className="relative z-[2] flex flex-col gap-2">
        <span className="font-bold">
            {technology.name}
        </span>

                                            <span className="w-fit rounded-full bg-white/30 px-2 py-1 text-xs">
            {technology.category}
        </span>
                                        </div>
                                    </div>
                            )}
                        </div>
                    </div>
                )}
                {/*{services.map((service) => {*/}
                {/*    const Icon = service.icon;*/}
                {/*    return (*/}
                {/*        <Collapse*/}
                {/*            key={service.id}*/}
                {/*            isOpen={openItems.has(service.id)}*/}
                {/*            onClick={() => toggleItem(service.id)}*/}
                {/*            cutomButtonClasses="border-b border-gray-900 rounded-none"*/}
                {/*            title={*/}
                {/*                <div className="flex items-center gap-3 py-3">*/}
                {/*                    <Icon*/}
                {/*                        color="var(--primary)"*/}
                {/*                        size={30}*/}
                {/*                        strokeWidth={1.5}*/}
                {/*                    />*/}
                {/*                    <span className="text-xl md:text-2xl text-zinc-200">{service.title}</span>*/}
                {/*                </div>*/}
                {/*            }*/}
                {/*        >*/}
                {/*            <div className="pl-12 pt-5">*/}
                {/*                <p className="text-zinc-300">{service.description}</p>*/}
                {/*                <div className="mt-5 flex flex-wrap gap-2">*/}
                {/*                    {service.tags.map((tag) => (*/}
                {/*                        <span*/}
                {/*                            key={tag}*/}
                {/*                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/60"*/}
                {/*                        >{tag}</span>*/}
                {/*                    ))}*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </Collapse>*/}
                {/*    );*/}
                {/*})}*/}
            </section>
        </Reveal>
    );
};

export default TechStack;