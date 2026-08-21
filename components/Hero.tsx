import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

type HeroProps = {
    eyebrow: string;
    title: string;
    description: string;
    primaryButtonText: string;
    primaryButtonHref: string;
    secondaryButtonText: string;
    secondaryButtonHref: string;
    image: string;
    imageAlt: string;
};

export default function Hero({
                                 eyebrow,
                                 title,
                                 description,
                                 primaryButtonText,
                                 primaryButtonHref,
                                 secondaryButtonText,
                                 secondaryButtonHref,
                                 image,
                                 imageAlt,
                             }: HeroProps) {
    return (
        <section className="border-b border-[var(--color-border)]">
            <Container className="grid min-h-[calc(100vh-5rem)] items-center gap-12 py-20 lg:grid-cols-2">
                <div>
                    <p className="mb-6 text-sm font-medium uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
                        {eyebrow}
                    </p>

                    <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                        {title}
                    </h1>

                    <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--color-text-secondary)]">
                        {description}
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Button href={primaryButtonHref}>
                            {primaryButtonText}
                        </Button>

                        <Button
                            href={secondaryButtonHref}
                            variant="secondary"
                        >
                            {secondaryButtonText}
                        </Button>
                    </div>
                </div>

                <div className="aspect-square overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]">
                    <img
                        src={image}
                        alt={imageAlt}
                        className="h-full w-full object-cover"
                    />
                </div>
            </Container>
        </section>
    );
}