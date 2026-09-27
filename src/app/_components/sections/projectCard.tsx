import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Project {
    title: string;
    description: string;
    link: string;
    image: StaticImageData;
}

const ProjectCard = ({ data }: { data: Project }) => {
    return (
        <Link
            target="_blank"
            rel="noopener noreferrer"
            href={data.link}
            className="
        group
        {/*min-w-[300px] w-[300px]*/}
        w-full
        bg-white/5 overflow-hidden rounded-xl flex
        flex-col gap-3 hover:scale-[0.98]
        transition animated-border
    "
        >
            <div className="relative w-full h-[200px] overflow-hidden">
                <Image
                    className="
                object-cover
                transition-transform duration-500 ease-out
                group-hover:scale-110
            "
                    src={data.image}
                    alt={data.title}
                    fill
                    sizes="276px"
                />
            </div>

            <h3 className="text-xl font-bold text-zinc-200 px-3 flex items-center gap-2">
                {data.title}
            </h3>

            <p className="text-left text-sm text-zinc-300 px-3">
                {data.description}
            </p>

            <div className="bg-blue-950/40 py-2 rounded-full flex text-white items-center text-sm w-11/12
             justify-center text-center mx-3 mb-3 px-2">
                visit site
                <ArrowUpRight
                    size={17}
                    strokeWidth={2}
                    className="text-zinc-400"
                />
            </div>
        </Link>
    );
};

export default ProjectCard;