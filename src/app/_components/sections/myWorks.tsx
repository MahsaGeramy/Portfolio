import Slider from "@/app/_components/slider/slider";
import ProjectCard from "@/app/_components/sections/projectCard";
import Reveal from "@/app/_components/ui/Reveal";

import JamoojPic from "../../../../public/images/projects/jamooj.png";
import MivePic from "../../../../public/images/projects/mive.png";

const MyWorks = () =>{

    const projects = [
        {
            title: "jamooj",
            description: "Built a high-performance accommodation rental platform with a responsive UI, optimized rendering, and a seamless user experience for discovering and booking stays.",
            link: "https://jamooj.com/",
            image: JamoojPic
        },{
            title: "jamooj",
            description: "Built a high-performance accommodation rental platform with a responsive UI, optimized rendering, and a seamless user experience for discovering and booking stays.",
            link: "https://jamooj.com/",
            image: JamoojPic
        },{
            title: "jamooj",
            description: "Built a high-performance accommodation rental platform with a responsive UI, optimized rendering, and a seamless user experience for discovering and booking stays.",
            link: "https://jamooj.com/",
            image: JamoojPic
        },{
            title: "jamooj",
            description: "Built a high-performance accommodation rental platform with a responsive UI, optimized rendering, and a seamless user experience for discovering and booking stays.",
            link: "https://jamooj.com/",
            image: JamoojPic
        },{
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
        }
    ]
    return(
        <Reveal
            delay={200}
            className="w-full"
        >
            <section id="works" className="flex flex-col w-full">
                <p className="mb-10 mt-20 text-center text-3xl md:text-4xl font-bold text-zinc-100">
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