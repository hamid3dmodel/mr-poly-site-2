import { notFound } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { assets } from "@/data/assets";

type AssetPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function AssetPage({
                                            params,
                                        }: AssetPageProps) {
    const { slug } = await params;

    const asset = assets.find((item) => item.slug === slug);

    if (!asset) {
        notFound();
    }

    return (
        <main>
            <Section>
                <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]">
                            <img
                                src={asset.thumbnail}
                                alt={asset.name}
                                className="w-full object-cover"
                            />
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-4">
                            {asset.gallery.map((image) => (
                                <div
                                    key={image}
                                    className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]"
                                >
                                    <img
                                        src={image}
                                        alt={asset.name}
                                        className="aspect-video w-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-5 flex flex-wrap gap-2">
                            <Badge>{asset.style}</Badge>
                            <Badge>{asset.category}</Badge>
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            {asset.name}
                        </h1>

                        <p className="mt-6 leading-8 text-[var(--color-text-secondary)]">
                            {asset.description}
                        </p>

                        <div className="mt-10">
                            <h2 className="text-xl font-semibold">
                                Features
                            </h2>

                            <ul className="mt-4 space-y-3 text-[var(--color-text-secondary)]">
                                {asset.features.map((feature) => (
                                    <li key={feature}>
                                        <span className="mr-2 text-white/30">•</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-xl font-semibold">
                                Technical Information
                            </h2>

                            <div className="mt-4 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)]">
                                {Object.entries(asset.technicalSpecs).map(
                                    ([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex justify-between gap-6 border-b border-[var(--color-border)] px-4 py-3 text-sm last:border-b-0"
                                        >
                      <span className="capitalize text-[var(--color-text-muted)]">
                        {key}
                      </span>

                                            <span className="text-right text-[var(--color-text-secondary)]">
                        {value}
                      </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-xl font-semibold">
                                Available On
                            </h2>

                            <div className="mt-4 flex flex-wrap gap-3">
                                {asset.stores.map((store) => (
                                    <Button
                                        key={store.name}
                                        href={store.url}
                                        variant="secondary"
                                    >
                                        {store.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </main>
    );
}