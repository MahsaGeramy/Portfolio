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
        <Link target="_blank" href={data.link} className="w-[300px] bg-white/20 p-3 rounded-xl flex flex-col gap-3 hover:scale-[0.98] transition">
            <div className="w-full h-[200px]">
                <Image
                    className="w-full h-full object-cover rounded-xl"
                    src={data.image}
                    alt={data.title}
                    width={500}
                    height={300}
                />
            </div>
            <h3 className="text-xl font-bold text-zinc-200">{data.title}</h3>
            <p className="text-left text-sm text-zinc-300">{data.description}</p>
        </Link>
    );
};

export default ProjectCard;