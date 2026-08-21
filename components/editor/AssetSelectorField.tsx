"use client";

import { FieldLabel } from "@puckeditor/core";
import { useEffect, useMemo, useState } from "react";

type AssetStyle = "low-poly" | "realistic";

type AssetCategory = "vehicles" | "characters" | "environments" | "nature";

type StoreLink = {
    name: string;
    url: string;
};

export type EditableAsset = {
    id: string;
    name: string;
    slug: string;
    style: AssetStyle;
    category: AssetCategory;

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

    stores: StoreLink[];
};

type Props = {
    field: {
        label?: string;
    };

    // selected asset ids
    value: string[] | undefined;

    // Accept any for uiState to be compatible with Puck's signature (Partial<UiState> | undefined)
    onChange: (value: string[], uiState?: any) => void;
};

export default function AssetSelectorField({ field, value, onChange }: Props) {
    const selected = Array.isArray(value) ? value : [];

    const [assets, setAssets] = useState<EditableAsset[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);

                const res = await fetch("/api/assets", { cache: "no-store" });

                if (!res.ok) {
                    throw new Error("Failed to load assets");
                }

                const data = await res.json();

                if (!cancelled) {
                    setAssets(Array.isArray(data.assets) ? data.assets : []);
                }
            } catch (err) {
                console.error(err);
                if (!cancelled) setAssets([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = useMemo(() => {
        const q = filter.trim().toLowerCase();
        if (!q) return assets;
        return assets.filter(
            (a) =>
                a.name.toLowerCase().includes(q) ||
                a.slug.toLowerCase().includes(q) ||
                (a.shortDescription || "").toLowerCase().includes(q)
        );
    }, [assets, filter]);

    function toggle(id: string) {
        const exists = selected.includes(id);
        const next = exists ? selected.filter((s) => s !== id) : [...selected, id];
        onChange(next);
    }

    function selectAllVisible() {
        const ids = Array.from(new Set([...selected, ...filtered.map((a) => a.id)]));
        onChange(ids);
    }

    function clearAll() {
        onChange([]);
    }

    return (
        <FieldLabel label={field.label || "Select Assets"}>
            <div className="space-y-3">
                <div className="flex gap-2">
                    <input
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Search assets..."
                        className="flex-1 rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white"
                    />
                    <button
                        type="button"
                        onClick={selectAllVisible}
                        className="rounded-md border border-white/10 px-3 py-2 text-xs text-white"
                    >
                        Select visible
                    </button>
                    <button
                        type="button"
                        onClick={clearAll}
                        className="rounded-md border border-white/10 px-3 py-2 text-xs text-white"
                    >
                        Clear
                    </button>
                </div>

                {loading ? (
                    <div className="text-xs text-zinc-500">Loading assets...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-xs text-zinc-500">No assets found.</div>
                ) : (
                    <div className="grid gap-2">
                        {filtered.map((a) => {
                            const checked = selected.includes(a.id);
                            return (
                                <label
                                    key={a.id}
                                    className="flex items-center gap-3 rounded-md border border-white/10 px-3 py-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggle(a.id)}
                                        className="h-4 w-4"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="truncate font-medium">{a.name}</div>
                                        <div className="text-xs text-zinc-500 truncate">{a.slug}</div>
                                    </div>
                                    {a.thumbnail ? (
                                        <img
                                            src={a.thumbnail}
                                            alt=""
                                            className="ml-3 h-8 w-8 rounded object-cover"
                                        />
                                    ) : null}
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>
        </FieldLabel>
    );
}