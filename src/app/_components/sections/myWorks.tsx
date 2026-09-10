import Slider from "@/app/_components/slider/slider";
import ProjectCard from "@/app/_components/sections/projectCard";
import Reveal from "@/app/_components/ui/Reveal";

import JamoojPic from "../../../../public/images/projects/jamooj.png";
import MivePic from "../../../../public/images/projects/mive.png";
import NotFoundPic from "../../../../public/images/projects/404.png";

const MyWorks = () =>{

    const projects = [
        {
            title: "jamooj",
            description: "Built a high-performance accommodation rental platform with a responsive UI, optimized rendering, and a seamless user experience for discovering and booking stays.",
            link: "https://jamooj.com/",
            image: JamoojPic
        },
        {
            title: "Mive",
            description: "Built a high-performance accommodation rental platform with a responsive UI, optimized rendering, and a seamless user experience for discovering and booking stays.",
            link: "https://toroo.ir/",
            image: MivePic
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
            <section id="works" className="flex flex-col w-full mt-24">
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