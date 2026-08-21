import type { ReactNode } from "react";

type BadgeProps = {
    children: ReactNode;
};

export default function Badge({ children }: BadgeProps) {
    return (
        <span
            className={[
                "inline-flex items-center",
                "rounded-full",
                "border border-[var(--color-border)]",
                "bg-white/5",
                "px-3 py-1",
                "text-xs font-medium",
                "text-[var(--color-text-secondary)]",
            ].join(" ")}
        >
      {children}
    </span>
    );
}