"use client"
import { useEffect, useState } from "react";

const roles = ["Freelancer", "Web Designer", "SEO Specialist"];

const TYPING_SPEED = 100;
const DELETING_SPEED = 60;
const HOLD_DURATION = 1000;

export default function TypingText() {
    const [roleIndex, setRoleIndex] = useState(0);
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const currentRole = roles[roleIndex];

    useEffect(() => {
        const isComplete = text === currentRole;

        const delay = isComplete && !isDeleting
            ? HOLD_DURATION
            : isDeleting
                ? DELETING_SPEED
                : TYPING_SPEED;

        const timer = setTimeout(() => {
            if (!isDeleting) {
                setText(currentRole.slice(0, text.length + 1));

                if (text === currentRole) {
                    setIsDeleting(true);
                }

                return;
            }

            setText(currentRole.slice(0, text.length - 1));

            if (text.length === 1) {
                setIsDeleting(false);
                setRoleIndex((index) => (index + 1) % roles.length);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [text, currentRole, isDeleting]);

    return (
        <span className="flex justify-center min-w-[280px] text-left text-primary font-bold text-[30px] md:text-[40px]">
            {text}
            <span className="ml-1 animate-pulse">|</span>
        </span>
    );
}