"use client";
import { motion } from "framer-motion";
import {ChevronDown} from "lucide-react";
import { memo, ReactNode } from "react";

const Collapse = ({
    title,
    children,
    isOpen,
    onClick,
    cutomButtonClasses,
    cutomBodyClasses
}: {
    title: string | ReactNode;
    children: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
    cutomButtonClasses?: string
    cutomBodyClasses?: string
}) => {
    return (
        <div className="w-full mx-auto">
            <button className={`cursor-pointer focus:outline-none w-full flex justify-between items-center
             text-darkGray p-3 text-right gap-1
                    text-sm transition-all ${cutomButtonClasses ? cutomButtonClasses : '' }`}
                onClick={onClick}
                role="button"
                aria-expanded={isOpen}
            >
                <h3>{title}</h3>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <div className="bg-white/20 rounded-full">
                        <ChevronDown/>
                    </div>
                </motion.span>
            </button>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden relative top-[-.6rem]"
            >
                <div className={`${cutomBodyClasses ? cutomBodyClasses : ''} p-4 rounded-b-lg`}>{children}</div>
            </motion.div>
        </div>
    );
};

export default memo(Collapse);
