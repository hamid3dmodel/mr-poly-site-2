import Link from "next/link";
import type { Asset } from "@/data/assets";
import Badge from "@/components/ui/Badge";

type AssetCardProps = {
    asset: Asset;
};

export default function AssetCard({ asset }: AssetCardProps) {
    return (
        <Link
            href={`/asset/${asset.slug}`}
            className={[
                "group block overflow-hidden",
                "rounded-[var(--radius-lg)]",
                "border border-[var(--color-border)]",
                "bg-[var(--color-surface)]",
                "transition-[border-color,background-color]",
                "duration-250",
                "hover:border-[var(--color-border-hover)]",
                "hover:bg-[var(--color-surface-hover)]",
            ].join(" ")}
        >
            <div className="aspect-[4/3] overflow-hidden bg-white/5">
                <img
                    src={asset.thumbnail}
                    alt={asset.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <div className="p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                    <Badge>{asset.style}</Badge>
                    <Badge>{asset.category}</Badge>
                </div>

                <h2 className="text-xl font-semibold tracking-tight">
                    {asset.name}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                    {asset.shortDescription}
                </p>

                <div className="mt-5 text-sm font-medium text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-text-primary)]">
                    View Asset →
                </div>
            </div>
        </Link>
    );
}