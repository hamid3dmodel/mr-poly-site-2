import Container from "@/components/ui/Container";

export default function Footer() {
    return (
        <footer className="border-t border-[var(--color-border)]">
            <Container className="flex flex-col gap-4 py-10 text-sm text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
                <p>© {new Date().getFullYear()} MR POLY. All rights reserved.</p>

                <p>Game-ready 3D assets.</p>
            </Container>
        </footer>
    );
}