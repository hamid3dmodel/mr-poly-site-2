"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Badge from "@/components/ui/Badge";

type Asset = {
    id: string;
    name: string;
    slug: string;
    style: "low-poly" | "realistic";
    category: "vehicles" | "characters" | "environments" | "nature";
    shortDescription: string;
    description: string;
    thumbnail: string;
    gallery: string[];
    features: string[];
    technicalSpecs: {
        polygons?: string;
        textures?: string;
        formats?: string;
        engine?: string;
    };
    stores: {
        name: string;
        url: string;
    }[];
};

type AssetListProps = {
    title?: string;
    description?: string;

    selection: "all" | "filter" | "manual";

    style: "all" | "low-poly" | "realistic";

    category: "all" | "vehicles" | "characters" | "environments" | "nature";

    selectedAssets: string[];

    sort: "default" | "name-asc" | "name-desc";

    limit: number;

    columns: "1" | "2" | "3" | "4";

    gap: number;

    cardStyle: "bordered" | "minimal" | "flat";

    cardRadius: number;

    cardPadding: number;

    imageAspect: "4/3" | "16/9" | "1/1" | "auto";

    showImage: boolean;

    showBadges: boolean;

    showDescription: boolean;

    showButton: boolean;

    buttonText: string;

    imageHover: boolean;
};

const columnClasses = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export default function AssetList({
                                      title,
                                      description,
                                      selection,
                                      style,
                                      category,
                                      selectedAssets,
                                      sort,
                                      limit,
                                      columns,
                                      gap,
                                      cardStyle,
                                      cardRadius,
                                      cardPadding,
                                      imageAspect,
                                      showImage,
                                      showBadges,
                                      showDescription,
                                      showButton,
                                      buttonText,
                                      imageHover,
                                  }: AssetListProps) {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadAssets() {
            try {
                console.debug("[AssetList] GET /api/assets");
                const response = await fetch("/api/assets", { cache: "no-store" });

                if (!response.ok) {
                    throw new Error("Failed to load assets");
                }

                const data = await response.json();

                if (!cancelled) {
                    const list = Array.isArray(data.assets) ? data.assets : [];
                    console.debug("[AssetList] assets fetched:", list.map((a: any) => a.slug));
                    setAssets(list);
                }
            } catch (error) {
                console.error("[AssetList] loadAssets error:", error);
                if (!cancelled) {
                    setAssets([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadAssets();

        return () => {
            cancelled = true;
        };
    }, []);

    const filteredAssets = useMemo(() => {
        let result = [...assets];

        if (selection === "manual") {
            const selected = new Set(selectedAssets || []);
            result = result.filter((asset) => selected.has(asset.id));
        }

        if (selection === "filter") {
            result = result.filter((asset) => {
                const styleMatch = style === "all" || asset.style === style;
                const categoryMatch = category === "all" || asset.category === category;
                return styleMatch && categoryMatch;
            });
        }

        if (sort === "name-asc") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (sort === "name-desc") {
            result.sort((a, b) => b.name.localeCompare(a.name));
        }

        if (limit > 0) {
            result = result.slice(0, limit);
        }

        return result;
    }, [assets, selection, style, category, selectedAssets, sort, limit]);

    const cardClasses =
        cardStyle === "bordered"
            ? "border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)]"
            : cardStyle === "minimal"
                ? "bg-transparent"
                : "bg-white/[0.03]";

    const imageAspectStyle = imageAspect === "auto" ? undefined : imageAspect;

    return (
        <div className="w-full">
            {(title || description) && (
                <div className="mb-8">
                    {title && <h2 className="text-3xl font-bold tracking-tight">{title}</h2>}
                    {description && <p className="mt-3 max-w-3xl leading-7 text-[var(--color-text-secondary)]">{description}</p>}
                </div>
            )}

            {loading ? (
                <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-sm text-zinc-500">Loading assets...</div>
            ) : filteredAssets.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-sm text-zinc-500">No assets match this list.</div>
            ) : (
                <div className={`grid ${columnClasses[columns]}`} style={{ gap }}>
                    {filteredAssets.map((asset) => {
                        // debug: log slug for each rendered card
                        console.debug("[AssetList] render card slug:", asset.slug);
                        return (
                            <Link
                                key={asset.id}
                                href={`/asset/${asset.slug}`}
                                onClick={() => console.debug("[AssetList] click navigate to:", `/asset/${asset.slug}`)}
                                className={`group block overflow-hidden transition-[border-color,background-color,transform] duration-250 ${cardClasses}`}
                                style={{ borderRadius: cardRadius }}
                            >
                                {showImage && (
                                    <div className="overflow-hidden bg-white/5" style={{ aspectRatio: imageAspectStyle }}>
                                        {asset.thumbnail ? (
                                            <img
                                                src={asset.thumbnail}
                                                alt={asset.name}
                                                className={`h-full w-full object-cover ${imageHover ? "transition-transform duration-500 group-hover:scale-105" : ""}`}
                                            />
                                        ) : (
                                            // placeholder (avoid img src="")
                                            <div className="h-full w-full bg-zinc-800" />
                                        )}
                                    </div>
                                )}

                                <div style={{ padding: cardPadding }}>
                                    {showBadges && (
                                        <div className="mb-3 flex flex-wrap gap-2">
                                            <Badge>{asset.style}</Badge>
                                            <Badge>{asset.category}</Badge>
                                        </div>
                                    )}

                                    <h3 className="text-xl font-semibold tracking-tight">{asset.name}</h3>

                                    {showDescription && <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--color-text-secondary)]">{asset.shortDescription}</p>}

                                    {showButton && <div className="mt-5 text-sm font-medium text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-text-primary)]">{buttonText} →</div>}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}