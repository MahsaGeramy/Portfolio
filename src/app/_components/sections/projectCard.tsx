import Image, { StaticImageData } from "next/image";
import Link from "next/link";

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
            className="min-w-[300px] w-[300px] bg-white/5 border border-white/10 overflow-hidden rounded-xl flex
             flex-col gap-3 hover:scale-[0.98] transition animated-border"
        >
            <div className="relative w-full h-[200px]">
                <Image
                    className="object-cover"
                    src={data.image}
                    alt={data.title}
                    fill
                    sizes="276px"
                />
            </div>

            <h3 className="text-xl font-bold text-zinc-200 px-3">
                {data.title}
            </h3>

            <p className="text-left text-sm text-zinc-300 px-3 pb-3">
                {data.description}
            </p>
        </Link>
    );
};

export default ProjectCard;