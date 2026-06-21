"use client";

import { useState, FormEvent, ChangeEvent, useId, useTransition } from "react";
import { submitContactInquiry } from "./action";
import { toast } from "react-toastify";

interface FormData {
    fullName: string;
    email: string;
    subject: string;
    message: string;
    website: string;
}

interface FaqItem {
    question: string;
    answer: string;
}

const FAQS: FaqItem[] = [
    {
        question: "How long does the Australia student visa process take?",
        answer:
            "Most Subclass 500 visas are processed within 4-6 weeks, however, it varies based on your country of origin and completeness of documentation.",
    },
    {
        question: "Can I work while studying in New Zealand?",
        answer:
            "Yes, most student visas in New Zealand allow you to work up to 20 hours per week during the semester and full-time during scheduled holidays.",
    },
    {
        question: "What documents are required for an SOP builder?",
        answer:
            "You typically need your academic transcripts, resume, statement of purpose draft, and references. Our dynamic builder guides you through structured prompts.",
    },
];

export default function Contact() {
    const baseId = useId();
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        email: "",
        subject: "Visa Application Query",
        message: "",
        website: "",
    });

    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (fieldErrors[name]) {
            setFieldErrors((prev) => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isPending) return;

        setFieldErrors({});

        startTransition(async () => {
            try {
                const result = await submitContactInquiry(formData);

                if (result.success) {
                    toast.success("Thank you! Your inquiry has been sent successfully.");
                    setFormData({
                        fullName: "",
                        email: "",
                        subject: "Visa Application Query",
                        message: "",
                        website: "",
                    });
                } else {
                    toast.error(result.error || "Something went wrong.");
                    if (result.fieldErrors) {
                        setFieldErrors(result.fieldErrors);
                    }
                }
            } catch {
                toast.error(
                    "Network error. Please check your internet connection and try again."
                );
            }
        });
    };

    const toggleFaq = (index: number) => {
        setOpenFaqIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <main className="pt-24 lg:pt-32 pb-12 lg:pb-stack-lg">
            <div className="max-w-container-max mx-auto px-margin">
                {/* Header Section */}
                <div className="text-center mb-12 lg:mb-stack-lg max-w-3xl mx-auto">
                    <span className="inline-block px-4 py-1.5 bg-secondary-fixed text-on-secondary-fixed rounded-full text-xs lg:text-label-caps mb-4">
                        WE'RE HERE TO HELP
                    </span>
                    <h1 className="text-3xl lg:text-h1-marketing font-bold text-on-surface mb-6">
                        Let's Navigate Your Journey{" "}
                        <span className="text-primary italic">Together</span>
                    </h1>
                    <p className="text-sm lg:text-body-lg text-on-surface-variant">
                        Whether you're curious about visa requirements, university applications, or settling into a new city, our team is ready to guide you.
                    </p>
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-gutter mb-12 lg:mb-stack-lg">
                    {/* Form Container */}
                    <section className="md:col-span-7 bg-surface-container-lowest border border-outline-variant p-6 lg:p-margin rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
                        <h2 className="text-xl lg:text-h2-dashboard font-bold mb-4 lg:mb-stack-sm">
                            Send a Message
                        </h2>
                        <p className="text-sm lg:text-body-md text-on-surface-variant mb-6 lg:mb-stack-md">
                            We typically respond within 2-4 hours during business days.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-stack-md" noValidate>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-stack-md">
                                {/* Name Input Group */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor={`${baseId}-fullName`}
                                        className="text-xs lg:text-label-caps text-on-surface-variant"
                                    >
                                        FULL NAME
                                    </label>
                                    <input
                                        id={`${baseId}-fullName`}
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isPending}
                                        aria-invalid={!!fieldErrors.fullName}
                                        aria-describedby={
                                            fieldErrors.fullName
                                                ? `${baseId}-fullName-error`
                                                : undefined
                                        }
                                        className={`w-full bg-white border rounded-lg p-3 text-sm lg:text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${fieldErrors.fullName
                                            ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                                            : "border-outline-variant"
                                            }`}
                                        placeholder="Alex Rivera"
                                        type="text"
                                    />
                                    {fieldErrors.fullName?.map((err) => (
                                        <p
                                            key={err}
                                            id={`${baseId}-fullName-error`}
                                            className="text-red-600 text-xs font-medium"
                                        >
                                            {err}
                                        </p>
                                    ))}
                                </div>

                                {/* Email Input Group */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor={`${baseId}-email`}
                                        className="text-xs lg:text-label-caps text-on-surface-variant"
                                    >
                                        EMAIL ADDRESS
                                    </label>
                                    <input
                                        id={`${baseId}-email`}
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isPending}
                                        aria-invalid={!!fieldErrors.email}
                                        aria-describedby={
                                            fieldErrors.email
                                                ? `${baseId}-email-error`
                                                : undefined
                                        }
                                        className={`w-full bg-white border rounded-lg p-3 text-sm lg:text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${fieldErrors.email
                                            ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                                            : "border-outline-variant"
                                            }`}
                                        placeholder="alex@example.com"
                                        type="email"
                                    />
                                    {fieldErrors.email?.map((err) => (
                                        <p
                                            key={err}
                                            id={`${baseId}-email-error`}
                                            className="text-red-600 text-xs font-medium"
                                        >
                                            {err}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Subject Input Group */}
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor={`${baseId}-subject`}
                                    className="text-xs lg:text-label-caps text-on-surface-variant"
                                >
                                    SUBJECT
                                </label>
                                <div className="relative">
                                    <select
                                        id={`${baseId}-subject`}
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        disabled={isPending}
                                        className="w-full bg-white border border-outline-variant rounded-lg p-3 text-sm lg:text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none pr-10"
                                    >
                                        <option value="Visa Application Query">
                                            Visa Application Query
                                        </option>
                                        <option value="University Selection Help">
                                            University Selection Help
                                        </option>
                                        <option value="Technical Support">
                                            Technical Support
                                        </option>
                                        <option value="Partnership Inquiry">
                                            Partnership Inquiry
                                        </option>
                                    </select>
                                    <span
                                        className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
                                        aria-hidden="true"
                                    >
                                        unfold_more
                                    </span>
                                </div>
                            </div>

                            {/* Message Input Group */}
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor={`${baseId}-message`}
                                    className="text-xs lg:text-label-caps text-on-surface-variant"
                                >
                                    MESSAGE
                                </label>
                                <textarea
                                    id={`${baseId}-message`}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isPending}
                                    aria-invalid={!!fieldErrors.message}
                                    aria-describedby={
                                        fieldErrors.message
                                            ? `${baseId}-message-error`
                                            : undefined
                                    }
                                    className={`w-full bg-white border rounded-lg p-3 text-sm lg:text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none ${fieldErrors.message
                                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                                        : "border-outline-variant"
                                        }`}
                                    placeholder="How can we help you today? (Minimum 10 characters)"
                                    rows={4}
                                ></textarea>
                                {fieldErrors.message?.map((err) => (
                                    <p
                                        key={err}
                                        id={`${baseId}-message-error`}
                                        className="text-red-600 text-xs font-medium"
                                    >
                                        {err}
                                    </p>
                                ))}
                            </div>

                            {/* Honeypot – hidden from humans, bots will fill it */}
                            <div className="absolute opacity-0 -z-10">
                                <label htmlFor={`${baseId}-website`}>Website</label>
                                <input
                                    id={`${baseId}-website`}
                                    name="website"
                                    type="text"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Interactive Submit CTA */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full cursor-pointer py-4 bg-primary text-on-primary rounded-lg font-bold shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
                            >
                                {isPending ? (
                                    <>
                                        <span
                                            className="material-symbols-outlined animate-spin"
                                            aria-hidden="true"
                                        >
                                            sync
                                        </span>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <span
                                            className="material-symbols-outlined"
                                            aria-hidden="true"
                                        >
                                            send
                                        </span>
                                        <span>Send Inquiry</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </section>

                    {/* Sidebar Content */}
                    <aside className="md:col-span-5 space-y-8 lg:space-y-gutter">
                        <div className="bg-surface-container p-6 lg:p-margin rounded-xl border border-outline-variant">
                            <h4 className="text-xs lg:text-label-caps text-on-surface-variant mb-6 lg:mb-stack-md">
                                DIRECT CHANNELS
                            </h4>
                            <div className="space-y-4 lg:space-y-stack-md">
                                <div className="flex items-start gap-4 p-3 bg-white/50 rounded-lg border border-outline-variant/30">
                                    <span
                                        className="material-symbols-outlined text-primary"
                                        aria-hidden="true"
                                    >
                                        mail
                                    </span>
                                    <div>
                                        <p className="text-sm lg:text-ui-sm font-bold">
                                            Email Support
                                        </p>
                                        <a
                                            href="mailto:support@pathway-ai.com"
                                            className="text-xs lg:text-body-md text-on-surface-variant hover:text-primary transition-colors"
                                        >
                                            support@pathway-ai.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-3 bg-white/50 rounded-lg border border-outline-variant/30">
                                    <span
                                        className="material-symbols-outlined text-primary"
                                        aria-hidden="true"
                                    >
                                        location_on
                                    </span>
                                    <div>
                                        <p className="text-sm lg:text-ui-sm font-bold">
                                            Office Headquarters
                                        </p>
                                        <p className="text-xs lg:text-body-md text-on-surface-variant">
                                            Circular Quay, Sydney, NSW
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* FAQ Section */}
                <section className="mt-12 lg:mt-stack-lg bg-surface-container-low rounded-2xl p-6 lg:p-margin border border-outline-variant/50">
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-gutter">
                        <div className="md:w-1/3">
                            <h2 className="text-2xl lg:text-h1-marketing font-bold mb-4">
                                Common Questions
                            </h2>
                            <p className="text-sm lg:text-body-md text-on-surface-variant mb-6">
                                Can't find what you're looking for? Browse our comprehensive
                                knowledge base.
                            </p>
                        </div>

                        <div className="md:w-2/3 space-y-4">
                            {FAQS.map((faq, index) => {
                                const isOpen = openFaqIndex === index;
                                const buttonId = `${baseId}-faq-btn-${index}`;
                                const panelId = `${baseId}-faq-panel-${index}`;

                                return (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl border border-outline-variant/20 shadow-sm hover:border-primary/30 transition-all group"
                                    >
                                        <button
                                            type="button"
                                            id={buttonId}
                                            aria-expanded={isOpen}
                                            aria-controls={panelId}
                                            onClick={() => toggleFaq(index)}
                                            className="w-full cursor-pointer flex justify-between items-center p-4 lg:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                                        >
                                            <h4 className="text-base lg:text-[18px] font-bold text-on-surface select-none pointer-events-none">
                                                {faq.question}
                                            </h4>
                                            <span
                                                className={`material-symbols-outlined text-primary transition-transform duration-300 pointer-events-none ${isOpen ? "rotate-180" : ""
                                                    }`}
                                                aria-hidden="true"
                                            >
                                                expand_more
                                            </span>
                                        </button>

                                        <div
                                            id={panelId}
                                            role="region"
                                            aria-labelledby={buttonId}
                                            className={`grid transition-all duration-300 ease-in-out ${isOpen
                                                ? "grid-rows-[1fr] opacity-100"
                                                : "grid-rows-[0fr] opacity-0"
                                                }`}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="px-4 lg:px-6 pb-4 lg:pb-6 text-sm lg:text-body-md text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-4 mx-4 lg:mx-6">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}