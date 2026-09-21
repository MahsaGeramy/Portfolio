import Slider from "@/app/_components/slider/slider";
import ProjectCard from "@/app/_components/sections/projectCard";
import Reveal from "@/app/_components/ui/Reveal";

import JamoojPic from "../../../../public/images/projects/jamooj.webp";
import JamoojHostPic from "../../../../public/images/projects/jamooj-host.webp";
import MivePic from "../../../../public/images/projects/mive.webp";
import NotFoundPic from "../../../../public/images/projects/404.webp";

const MyWorks = () =>{

    const projects = [
        {
            title: "jamooj",
            description: "Developed a high-performance accommodation platform with Next.js and TypeScript, with a strong focus on technical SEO, optimized rendering, Core Web Vitals, and fast, responsive experiences across the platform.",
            link: "https://jamooj.com/",
            image: JamoojPic
        },
        {
            title: "Mive",
            description: "Built a modern and responsive e-commerce experience for online fruit shopping, focusing on scalable UI architecture, intuitive product discovery, and a smooth, user-friendly purchasing flow across different devices.",
            link: "https://toroo.ir/",
            image: MivePic
        },
        {
            title: "Jamooj Host",
            description: "Developed a scalable accommodation platform with Next.js and TypeScript, focusing on rendering performance, technical SEO, responsive UI, and optimized user flows for discovering and booking stays.",
            link: "https://host.jamooj.com/",
            image: JamoojHostPic
        },
        {
            title: "NotFound",
            description: "Designed and developed a modern, interactive 404 page featuring a playful mini-game, engaging visuals, and a smooth user experience that turns a missing page into a fun interaction.",
            link: "https://mahsageramy.ir/test",
            image: NotFoundPic
        },
    ]
    return(
        <Reveal
            delay={200}
            className="w-full"
        >
            <section id="works" className="flex flex-col w-full pt-24 pb-14">
                <p className="mb-10 text-center text-3xl md:text-4xl font-bold text-zinc-100">
                    <span className="text-primary">My</span> Works
                </p>
                <Slider
                    data={
                        projects.map((project,index)=>
                            <ProjectCard data={project} key={index}/>
                        )}
                    id="projects"
                    showNavigationButtons={true}
                />
            </section>
        </Reveal>
    )
}

export default MyWorks;