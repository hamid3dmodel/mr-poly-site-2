import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
    children: ReactNode;
    href?: string;
    variant?: ButtonVariant;
    className?: string;
};

const variants: Record<ButtonVariant, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
};

export default function Button({
                                   children,
                                   href,
                                   variant = "primary",
                                   className = "",
                               }: ButtonProps) {
    const classes = [
        "btn",
        variants[variant],
        className,
    ]
        .filter(Boolean)
        .join(" ");

    if (href?.startsWith("http")) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={classes}
            >
                {children}
            </a>
        );
    }

    if (href) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    return (
        <button type="button" className={classes}>
            {children}
        </button>
    );
}