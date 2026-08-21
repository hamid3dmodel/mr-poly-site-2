import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-xl">
            <Container className="flex h-20 items-center justify-between">
                <Link
                    href="/"
                    className="text-xl font-bold tracking-[0.15em]"
                >
                    MR POLY
                </Link>

                <nav className="hidden items-center gap-8 text-sm text-[var(--color-text-secondary)] md:flex">
                    <Link
                        href="/"
                        className="transition-colors hover:text-[var(--color-text-primary)]"
                    >
                        Home
                    </Link>

                    <Link
                        href="/assets"
                        className="transition-colors hover:text-[var(--color-text-primary)]"
                    >
                        Assets
                    </Link>

                    <Link
                        href="/about"
                        className="transition-colors hover:text-[var(--color-text-primary)]"
                    >
                        About
                    </Link>
                </nav>

                <div className="md:hidden">
                    <Button variant="secondary">Menu</Button>
                </div>
            </Container>
        </header>
    );
}