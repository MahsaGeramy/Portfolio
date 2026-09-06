import { TextareaHTMLAttributes } from "react";

interface CustomTextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

const CustomTextarea = ({
                            label,
                            id,
                            ...props
                        }: CustomTextareaProps) => {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-sm text-white/70">
                {label}
            </label>

            <textarea
                id={id}
                {...props}
                className="
                    min-h-[140px]
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-3
                    text-white
                    outline-none
                    backdrop-blur-sm
                    transition
                    duration-300
                    placeholder:text-white/30
                    focus:border-white/30
                    focus:bg-white/[0.08]
                "
            />
        </div>
    );
};

export default CustomTextarea;