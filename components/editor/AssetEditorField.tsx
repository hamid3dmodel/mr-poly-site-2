"use client";

import {
    FieldLabel,
} from "@puckeditor/core";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

type AssetStyle =
    | "low-poly"
    | "realistic";

type AssetCategory =
    | "vehicles"
    | "characters"
    | "environments"
    | "nature";

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

    value: EditableAsset;

    onChange: (
        value: EditableAsset,
    ) => void;
};

const emptyAsset: EditableAsset = {
    id: "",
    name: "",
    slug: "",
    style: "low-poly",
    category: "environments",

    shortDescription: "",
    description: "",

    thumbnail: "",

    gallery: [],

    features: [],

    technicalSpecs: {
        polygons: "",
        textures: "",
        formats: "",
        engine: "",
    },

    stores: [],
};

function slugify(
    value: string,
) {
    return value
        .toLowerCase()
        .trim()
        .replace(
            /[^a-z0-9]+/g,
            "-",
        )
        .replace(
            /^-+|-+$/g,
            "");
}

function createId() {
    return `asset-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
}

export default function AssetEditorField({
                                             field,
                                             value,
                                             onChange,
                                         }: Props) {
    const asset = value || emptyAsset;

    const [assets, setAssets] =
        useState<EditableAsset[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState<string | null>(null);

    const [selectedAssetId, setSelectedAssetId] =
        useState(asset.id || "");

    const selectedAsset = useMemo(
        () =>
            assets.find(
                (item) =>
                    item.id ===
                    selectedAssetId,
            ),
        [
            assets,
            selectedAssetId,
        ],
    );

    useEffect(() => {
        let cancelled = false;

        async function loadAssets() {
            try {
                setLoading(true);

                const response =
                    await fetch(
                        "/api/assets",
                        {
                            cache: "no-store",
                        },
                    );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load assets",
                    );
                }

                const data =
                    await response.json();

                if (!cancelled) {
                    setAssets(
                        Array.isArray(
                            data.assets,
                        )
                            ? data.assets
                            : [],
                    );
                }
            } catch (error) {
                console.error(
                    error,
                );
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

    const update = <
        K extends keyof EditableAsset
    >(
        key: K,
        nextValue: EditableAsset[K],
    ) => {
        onChange({
            ...asset,
            [key]: nextValue,
        });
    };

    const updateTechnicalSpec = (
        key: keyof EditableAsset["technicalSpecs"],
        value: string,
    ) => {
        onChange({
            ...asset,
            technicalSpecs: {
                ...asset.technicalSpecs,
                [key]: value,
            },
        });
    };

    const updateGalleryItem = (
        index: number,
        value: string,
    ) => {
        const gallery = [
            ...asset.gallery,
        ];

        gallery[index] = value;

        update(
            "gallery",
            gallery,
        );
    };

    const addGalleryItem = () => {
        update(
            "gallery",
            [
                ...asset.gallery,
                "",
            ],
        );
    };

    const removeGalleryItem = (
        index: number,
    ) => {
        update(
            "gallery",
            asset.gallery.filter(
                (_, itemIndex) =>
                    itemIndex !==
                    index,
            ),
        );
    };

    const updateFeature = (
        index: number,
        value: string,
    ) => {
        const features = [
            ...asset.features,
        ];

        features[index] =
            value;

        update(
            "features",
            features,
        );
    };

    const addFeature = () => {
        update(
            "features",
            [
                ...asset.features,
                "",
            ],
        );
    };

    const removeFeature = (
        index: number,
    ) => {
        update(
            "features",
            asset.features.filter(
                (_, itemIndex) =>
                    itemIndex !==
                    index,
            ),
        );
    };

    const updateStore = (
        index: number,
        key: keyof StoreLink,
        value: string,
    ) => {
        const stores = [
            ...asset.stores,
        ];

        stores[index] = {
            ...stores[index],
            [key]: value,
        };

        update(
            "stores",
            stores,
        );
    };

    const addStore = () => {
        update(
            "stores",
            [
                ...asset.stores,
                {
                    name: "",
                    url: "",
                },
            ],
        );
    };

    const removeStore = (
        index: number,
    ) => {
        update(
            "stores",
            asset.stores.filter(
                (_, itemIndex) =>
                    itemIndex !==
                    index,
            ),
        );
    };

    const loadSelectedAsset = () => {
        if (!selectedAsset) {
            return;
        }

        onChange({
            ...selectedAsset,
        });

        setMessage(
            "Asset loaded.",
        );

        setTimeout(
            () => setMessage(null),
            2000,
        );
    };

    const createNewAsset = () => {
        const newAsset: EditableAsset = {
            ...emptyAsset,

            id: createId(),

            name: "New Asset",

            slug: "new-asset",
        };

        setSelectedAssetId(
            newAsset.id,
        );

        onChange(
            newAsset,
        );

        setMessage(
            "New asset created in the editor.",
        );

        setTimeout(
            () => setMessage(null),
            2500,
        );
    };

    const saveAsset = async () => {
        if (!asset.id) {
            setMessage(
                "Asset ID is required.",
            );

            return;
        }

        if (!asset.name.trim()) {
            setMessage(
                "Asset name is required.",
            );

            return;
        }

        try {
            setSaving(true);
            setMessage(null);

            const response =
                await fetch(
                    `/api/assets/${encodeURIComponent(
                        asset.id,
                    )}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(
                            asset,
                        ),
                    },
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to save asset",
                );
            }

            setAssets(
                (current) => {
                    const exists =
                        current.some(
                            (item) =>
                                item.id ===
                                asset.id,
                        );

                    if (!exists) {
                        return [
                            ...current,
                            asset,
                        ];
                    }

                    return current.map(
                        (item) =>
                            item.id ===
                            asset.id
                                ? asset
                                : item,
                    );
                },
            );

            setSelectedAssetId(
                asset.id,
            );

            setMessage(
                "Asset saved.",
            );
        } catch (error) {
            console.error(
                error,
            );

            setMessage(
                "Failed to save asset.",
            );
        } finally {
            setSaving(false);
        }
    };

    const createAsset = async () => {
        if (!asset.id) {
            setMessage(
                "Asset ID is required.",
            );

            return;
        }

        if (!asset.name.trim()) {
            setMessage(
                "Asset name is required.",
            );

            return;
        }

        try {
            setSaving(true);
            setMessage(null);

            const response =
                await fetch(
                    "/api/assets",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(
                            asset,
                        ),
                    },
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to create asset",
                );
            }

            setAssets(
                (current) => [
                    ...current,
                    asset,
                ],
            );

            setSelectedAssetId(
                asset.id,
            );

            setMessage(
                "Asset created.",
            );
        } catch (error) {
            console.error(
                error,
            );

            setMessage(
                "Failed to create asset.",
            );
        } finally {
            setSaving(false);
        }
    };

    const deleteAsset = async () => {
        if (!asset.id) {
            return;
        }

        const confirmed =
            window.confirm(
                `Delete "${asset.name}"?`,
            );

        if (!confirmed) {
            return;
        }

        try {
            setSaving(true);
            setMessage(null);

            const response =
                await fetch(
                    `/api/assets/${encodeURIComponent(
                        asset.id,
                    )}`,
                    {
                        method: "DELETE",
                    },
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to delete asset",
                );
            }

            setAssets(
                (current) =>
                    current.filter(
                        (item) =>
                            item.id !==
                            asset.id,
                    ),
            );

            onChange(
                emptyAsset,
            );

            setSelectedAssetId("");

            setMessage(
                "Asset deleted.",
            );
        } catch (error) {
            console.error(
                error,
            );

            setMessage(
                "Failed to delete asset.",
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <FieldLabel
            label={
                field.label ||
                "Asset"
            }
        >
            <div className="space-y-5">
                {/* Asset selector */}

                <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400">
                        Existing Asset
                    </label>

                    <select
                        value={
                            selectedAssetId
                        }
                        onChange={(event) =>
                            setSelectedAssetId(
                                event
                                    .target
                                    .value,
                            )
                        }
                        className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none"
                    >
                        <option value="">
                            Select an asset
                        </option>

                        {assets.map(
                            (item) => (
                                <option
                                    key={
                                        item.id
                                    }
                                    value={
                                        item.id
                                    }
                                >
                                    {
                                        item.name
                                    }
                                </option>
                            ),
                        )}
                    </select>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={
                                loadSelectedAsset
                            }
                            disabled={
                                !selectedAsset
                            }
                            className="flex-1 rounded-md bg-white px-3 py-2 text-xs font-medium text-black disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Load Asset
                        </button>

                        <button
                            type="button"
                            onClick={
                                createNewAsset
                            }
                            className="flex-1 rounded-md border border-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/5"
                        >
                            New Asset
                        </button>
                    </div>

                    {loading && (
                        <p className="text-xs text-zinc-500">
                            Loading assets...
                        </p>
                    )}
                </div>

                {/* Basic */}

                <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Basic
                    </div>

                    <div>
                        <label className="text-xs text-zinc-400">
                            ID
                        </label>

                        <input
                            value={
                                asset.id
                            }
                            onChange={(event) =>
                                update(
                                    "id",
                                    event
                                        .target
                                        .value,
                                )
                            }
                            className="mt-1 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-zinc-400">
                            Name
                        </label>

                        <input
                            value={
                                asset.name
                            }
                            onChange={(event) => {
                                const name =
                                    event
                                        .target
                                        .value;

                                update(
                                    "name",
                                    name,
                                );

                                if (
                                    !asset.slug
                                ) {
                                    update(
                                        "slug",
                                        slugify(
                                            name,
                                        ),
                                    );
                                }
                            }}
                            className="mt-1 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-zinc-400">
                            Slug
                        </label>

                        <input
                            value={
                                asset.slug
                            }
                            onChange={(event) =>
                                update(
                                    "slug",
                                    slugify(
                                        event
                                            .target
                                            .value,
                                    ),
                                )
                            }
                            className="mt-1 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-zinc-400">
                            Style
                        </label>

                        <select
                            value={
                                asset.style
                            }
                            onChange={(event) =>
                                update(
                                    "style",
                                    event
                                        .target
                                        .value as AssetStyle,
                                )
                            }
                            className="mt-1 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white"
                        >
                            <option value="low-poly">
                                Low Poly
                            </option>

                            <option value="realistic">
                                Realistic
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-zinc-400">
                            Category
                        </label>

                        <select
                            value={
                                asset.category
                            }
                            onChange={(event) =>
                                update(
                                    "category",
                                    event
                                        .target
                                        .value as AssetCategory,
                                )
                            }
                            className="mt-1 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white"
                        >
                            <option value="vehicles">
                                Vehicles
                            </option>

                            <option value="characters">
                                Characters
                            </option>

                            <option value="environments">
                                Environments
                            </option>

                            <option value="nature">
                                Nature
                            </option>
                        </select>
                    </div>
                </div>

                {/* Content */}

                <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Content
                    </div>

                    <div>
                        <label className="text-xs text-zinc-400">
                            Short Description
                        </label>

                        <textarea
                            value={
                                asset.shortDescription
                            }
                            onChange={(event) =>
                                update(
                                    "shortDescription",
                                    event
                                        .target
                                        .value,
                                )
                            }
                            rows={3}
                            className="mt-1 w-full resize-y rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-zinc-400">
                            Description
                        </label>

                        <textarea
                            value={
                                asset.description
                            }
                            onChange={(event) =>
                                update(
                                    "description",
                                    event
                                        .target
                                        .value,
                                )
                            }
                            rows={6}
                            className="mt-1 w-full resize-y rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white"
                        />
                    </div>
                </div>

                {/* Media */}

                <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Media
                    </div>

                    <div>
                        <label className="text-xs text-zinc-400">
                            Thumbnail URL
                        </label>

                        <input
                            value={
                                asset.thumbnail
                            }
                            onChange={(event) =>
                                update(
                                    "thumbnail",
                                    event
                                        .target
                                        .value,
                                )
                            }
                            className="mt-1 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white"
                        />
                    </div>

                    {asset.thumbnail && (
                        <img
                            src={
                                asset.thumbnail
                            }
                            alt=""
                            className="w-full rounded-lg border border-white/10 object-cover"
                        />
                    )}

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-xs text-zinc-400">
                                Gallery
                            </label>

                            <button
                                type="button"
                                onClick={
                                    addGalleryItem
                                }
                                className="text-xs text-white hover:underline"
                            >
                                + Add Image
                            </button>
                        </div>

                        <div className="space-y-2">
                            {asset.gallery.map(
                                (
                                    image,
                                    index,
                                ) => (
                                    <div
                                        key={`${asset.id}-gallery-${index}`}
                                        className="flex gap-2"
                                    >
                                        <input
                                            value={
                                                image
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                updateGalleryItem(
                                                    index,
                                                    event
                                                        .target
                                                        .value,
                                                )
                                            }
                                            className="min-w-0 flex-1 rounded-md border border-white/10 bg-black px-3 py-2 text-xs text-white"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeGalleryItem(
                                                    index,
                                                )
                                            }
                                            className="px-2 text-xs text-red-400"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>

                {/* Features */}

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            Features
                        </div>

                        <button
                            type="button"
                            onClick={
                                addFeature
                            }
                            className="text-xs text-white hover:underline"
                        >
                            + Add
                        </button>
                    </div>

                    {asset.features.map(
                        (
                            feature,
                            index,
                        ) => (
                            <div
                                key={`${asset.id}-feature-${index}`}
                                className="flex gap-2"
                            >
                                <input
                                    value={
                                        feature
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        updateFeature(
                                            index,
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    className="min-w-0 flex-1 rounded-md border border-white/10 bg-black px-3 py-2 text-xs text-white"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeFeature(
                                            index,
                                        )
                                    }
                                    className="px-2 text-xs text-red-400"
                                >
                                    ×
                                </button>
                            </div>
                        ),
                    )}
                </div>

                {/* Technical specs */}

                <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Technical Specs
                    </div>

                    {(
                        [
                            [
                                "polygons",
                                "Polygons",
                            ],
                            [
                                "textures",
                                "Textures",
                            ],
                            [
                                "formats",
                                "Formats",
                            ],
                            [
                                "engine",
                                "Engine",
                            ],
                        ] as const
                    ).map(
                        ([
                             key,
                             label,
                         ]) => (
                            <div
                                key={key}
                            >
                                <label className="text-xs text-zinc-400">
                                    {
                                        label
                                    }
                                </label>

                                <input
                                    value={
                                        asset
                                            .technicalSpecs[
                                            key
                                            ] ||
                                        ""
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        updateTechnicalSpec(
                                            key,
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    className="mt-1 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white"
                                />
                            </div>
                        ),
                    )}
                </div>

                {/* Stores */}

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            Stores
                        </div>

                        <button
                            type="button"
                            onClick={
                                addStore
                            }
                            className="text-xs text-white hover:underline"
                        >
                            + Add Store
                        </button>
                    </div>

                    {asset.stores.map(
                        (
                            store,
                            index,
                        ) => (
                            <div
                                key={`${asset.id}-store-${index}`}
                                className="space-y-2 rounded-md border border-white/10 p-3"
                            >
                                <input
                                    value={
                                        store.name
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        updateStore(
                                            index,
                                            "name",
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    placeholder="Store name"
                                    className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-xs text-white"
                                />

                                <input
                                    value={
                                        store.url
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        updateStore(
                                            index,
                                            "url",
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    placeholder="https://..."
                                    className="w-full rounded-md border border-white/10 bg-black px-3 py-2 text-xs text-white"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeStore(
                                            index,
                                        )
                                    }
                                    className="text-xs text-red-400"
                                >
                                    Remove
                                </button>
                            </div>
                        ),
                    )}
                </div>

                {/* Actions */}

                <div className="space-y-2 border-t border-white/10 pt-4">
                    {message && (
                        <div className="rounded-md bg-white/5 px-3 py-2 text-xs text-zinc-300">
                            {
                                message
                            }
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={
                                saveAsset
                            }
                            disabled={
                                saving ||
                                !asset.id
                            }
                            className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-black disabled:opacity-40"
                        >
                            {saving
                                ? "Saving..."
                                : "Save Asset"}
                        </button>

                        <button
                            type="button"
                            onClick={
                                createAsset
                            }
                            disabled={
                                saving ||
                                !asset.id
                            }
                            className="rounded-md border border-white/10 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
                        >
                            Create Asset
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={
                            deleteAsset
                        }
                        disabled={
                            saving ||
                            !asset.id
                        }
                        className="w-full rounded-md border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/5 disabled:opacity-40"
                    >
                        Delete Asset
                    </button>
                </div>
            </div>
        </FieldLabel>
    );
}