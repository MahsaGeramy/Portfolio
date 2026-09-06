import { InputHTMLAttributes } from "react";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const CustomInput = ({ label, id, ...props }: CustomInputProps) => {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-sm text-white/70">
                {label}
            </label>

            <input
                id={id}
                {...props}
                className="
        w-full
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

        autofill:bg-white/5
        autofill:text-white
    "
            />
        </div>
    );
};

export default CustomInput;