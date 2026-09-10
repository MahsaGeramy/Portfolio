"use client"
import { FormEvent, useState } from "react";
import { ArrowRight, Mail, Phone } from "lucide-react";
import CustomInput from "@/app/_components/ui/customInput";
import CustomTextarea from "@/app/_components/ui/customTextarea";
import Reveal from "@/app/_components/ui/Reveal";
import { FaGithub, FaLinkedin } from "react-icons/fa";

interface ContactForm {
    name: string;
    email: string;
    message: string;
}

const initialForm: ContactForm = {
    name: "",
    email: "",
    message: "",
};

const contactInfo = [
    {
        icon: Phone,
        title: "Phone",
        value: "+98 990 106 6416",
        href: "tel:+989901066416",
    },
    {
        icon: Mail,
        title: "Email",
        value: "mahsa@example.com",
        href: "mailto:mahsa@example.com",
    },
    {
        icon: FaGithub,
        title: "Github",
        value: "MahsaGeramy",
        href: "https://github.com/MahsaGeramy",
    },
    {
        icon: FaLinkedin,
        title: "Linkedin",
        value: "MahsaGeramy",
        href: "https://www.linkedin.com/in/mahsa-geramy-89379023a/",
    },
];

const ContactMe = () => {
    const [form, setForm] = useState<ContactForm>(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsSubmitting(true);
        setStatus(null);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setForm(initialForm);

            setStatus({
                type: "success",
                message: "Your message has been sent successfully.",
            });
        } catch {
            setStatus({
                type: "error",
                message: "Something went wrong. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Reveal
            delay={200}
            className="w-full"
        >
            <section id="contactMe" className="mt-10 md:mt-20 w-full">
                <p className="mb-5 mt-10 text-center text-3xl md:text-4xl font-bold text-zinc-100">
                    Contact <span className="text-primary">Me</span>
                </p>
                <div className="mt-5 md:mt-10 flex flex-col md:flex-row gap-10 md:gap-16">
                    <form
                        onSubmit={handleSubmit}
                        className="flex w-full max-w-xl flex-col gap-1 md:gap-4"
                    >
                        <CustomInput
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                            placeholder="Your name"
                        />
                        <CustomInput
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
                        />
                        <CustomTextarea
                            id="message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            placeholder="Tell me about your project..."
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group mt-4 md:mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full
                        bg-[linear-gradient(90deg,var(--primary)_0%,#4d5ba7_40%,#4d5ba7_60%,var(--primary)_100%)]
                        px-6 py-4 text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                        <span className="text-sm md:text-base">
                            {isSubmitting ? "Sending..." : "Send message"}
                        </span>
                            {!isSubmitting && (
                                <ArrowRight
                                    size={18}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            )}
                        </button>

                        {status && (
                            <p
                                role="status"
                                aria-live="polite"
                                className={
                                    status.type === "success"
                                        ? "text-green-400"
                                        : "text-red-400"
                                }
                            >
                                {status.message}
                            </p>
                        )}
                    </form>
                    <div className="flex w-full md:max-w-sm flex-col gap-3 d:gap-6">
                        {contactInfo.map((item) => {
                            const Icon = item.icon;
                            return (
                                <a
                                    key={item.title}
                                    href={item.href}
                                    className="flex w-full items-center gap-2 rounded-full bg-white/5 px-3 py-3 transition-all duration-300 hover:bg-white/10"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                                        <Icon
                                            size={23}
                                            className="text-primary"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs md:text-sm text-white/50">{item.title}</span>
                                        <span className="text-sm md:text-base text-white">{item.value}</span>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </section>
        </Reveal>
    );
};

export default ContactMe;