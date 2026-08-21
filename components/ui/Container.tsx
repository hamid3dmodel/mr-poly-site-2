import type { ReactNode } from "react";

type ContainerProps = {
    children: ReactNode;
    className?: string;
};

export default function Container({
                                      children,
                                      className = "",
                                  }: ContainerProps) {
    return (
        <div
            className={[
                "mx-auto w-full max-w-[var(--container-width)]",
                "px-6 lg:px-12",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}