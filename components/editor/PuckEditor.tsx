"use client";

import { useEffect, useState } from "react";
import { Puck } from "@puckeditor/core";
import { puckConfig } from "./puck.config";

type PuckNode = {
    type: string;
    props: Record<string, unknown>;
};

type PuckData = {
    content: PuckNode[];
    root: {
        props?: Record<string, unknown>;
    };
    zones?: Record<string, PuckNode[]>;
};

type Props = {
    pageSlug: string;
};

/**
 * Makes sure every Puck component has a unique id.
 *
 * Puck uses component ids internally as React keys for
 * the static layer tree. Older page JSON files may not
 * contain ids, so we normalize them before giving the data
 * to Puck.
 */
function normalizePuckNodes(
    nodes: PuckNode[],
    usedIds: Set<string> = new Set()
): PuckNode[] {
    return nodes.map((node) => {
        const currentProps = node.props ?? {};

        let id = typeof currentProps.id === "string" ? (currentProps.id as string) : "";

        if (!id || usedIds.has(id)) {
            id = `node-${crypto.randomUUID()}`;
        }

        usedIds.add(id);

        const normalizedProps: Record<string, unknown> = {
            ...currentProps,
            id,
        };

        /**
         * Normalize nested slot content.
         *
         * Components such as Section, Container, Grid, etc.
         * can contain other Puck components inside their props.
         */
        for (const [key, value] of Object.entries(normalizedProps)) {
            if (Array.isArray(value)) {
                const looksLikePuckNodes = value.every(
                    (item) =>
                        item &&
                        typeof item === "object" &&
                        "type" in item &&
                        "props" in item
                );

                if (looksLikePuckNodes) {
                    normalizedProps[key] = normalizePuckNodes(
                        value as PuckNode[],
                        usedIds
                    );
                }
            }
        }

        return {
            ...node,
            props: normalizedProps,
        };
    });
}

function normalizePuckData(data: PuckData): PuckData {
    const usedIds = new Set<string>();

    return {
        ...data,

        content: normalizePuckNodes(Array.isArray(data.content) ? data.content : [], usedIds),

        zones: data.zones
            ? Object.fromEntries(
                Object.entries(data.zones).map(([zoneId, zoneContent]) => [
                    zoneId,
                    normalizePuckNodes(Array.isArray(zoneContent) ? zoneContent : [], usedIds),
                ])
            )
            : data.zones,
    };
}

/**
 * Traverse nodes and collect asset objects found at node.props.asset.
 * This is specific to how AssetEditor stores asset inside component props.
 */
function collectAssetsFromNodes(nodes: PuckNode[], out: any[] = []) {
    for (const node of nodes) {
        if (node?.props && typeof node.props === "object") {
            const maybeAsset = (node.props as any).asset;
            if (maybeAsset && typeof maybeAsset === "object" && !Array.isArray(maybeAsset)) {
                // Heuristic: asset objects should have at least a name or slug or id
                if ("name" in maybeAsset || "slug" in maybeAsset || "id" in maybeAsset) {
                    out.push(maybeAsset);
                }
            }

            // Also check nested slot props
            for (const value of Object.values(node.props)) {
                if (Array.isArray(value)) {
                    const looksLikePuckNodes = value.every(
                        (item) =>
                            item &&
                            typeof item === "object" &&
                            "type" in item &&
                            "props" in item
                    );

                    if (looksLikePuckNodes) {
                        collectAssetsFromNodes(value as PuckNode[], out);
                    }
                }
            }
        }
    }

    return out;
}

/**
 * Replace asset objects in nodes with updatedAsset when ids match (or slug).
 */
function replaceAssetsInNodes(nodes: PuckNode[], savedMap: Map<string, any>) {
    return nodes.map((node) => {
        const newNode = { ...node, props: { ...(node.props ?? {}) } as Record<string, unknown> };

        const maybeAsset = (node.props as any)?.asset;
        if (maybeAsset && typeof maybeAsset === "object" && !Array.isArray(maybeAsset)) {
            const id = (maybeAsset as any).id;
            const slug = (maybeAsset as any).slug;
            const key = id || slug;
            if (key && savedMap.has(key)) {
                (newNode.props as any).asset = savedMap.get(key);
            }
        }

        // recurse into nested slot props arrays
        for (const [k, v] of Object.entries(newNode.props)) {
            if (Array.isArray(v)) {
                const looksLikePuckNodes = v.every(
                    (item) =>
                        item &&
                        typeof item === "object" &&
                        "type" in item &&
                        "props" in item
                );

                if (looksLikePuckNodes) {
                    (newNode.props as any)[k] = replaceAssetsInNodes(v as PuckNode[], savedMap);
                }
            }
        }

        return newNode;
    });
}

/**
 * Save or update a single asset via existing API.
 * - If asset.id exists (non-empty) do PUT /api/assets/:id
 * - If no id, generate one and POST /api/assets
 *
 * If API returns the saved asset JSON we use it; otherwise fall back to the original asset object.
 */
async function persistAssetToApi(asset: any) {
    const hasId = typeof asset.id === "string" && asset.id.trim() !== "";
    const method = hasId ? "PUT" : "POST";
    const url = hasId ? `/api/assets/${encodeURIComponent(asset.id)}` : `/api/assets`;

    // Ensure there is an id for consistency (some API implementations expect client-generated id on create)
    if (!hasId) {
        // use crypto.randomUUID available in modern browsers
        try {
            asset.id = crypto.randomUUID();
        } catch {
            // fallback
            asset.id = `asset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        }
    }

    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(asset),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to persist asset ${asset.id || asset.slug} (${res.status}) ${text}`);
    }

    // Try to parse returned JSON (some endpoints return { success: true } only).
    try {
        const json = await res.json();
        // If API returned an object with asset data, use it. If it's a success boolean, fall back to our asset.
        // Heuristic: if json has id and name, treat as saved asset representation.
        if (json && typeof json === "object" && ("id" in json || "name" in json)) {
            return json;
        }
        return asset;
    } catch {
        return asset;
    }
}

export default function PuckEditor({ pageSlug }: Props) {
    const [data, setData] = useState<PuckData | null>(null);

    useEffect(() => {
        if (!pageSlug) {
            return;
        }

        async function loadPage() {
            try {
                const response = await fetch(`/api/editor/pages/${pageSlug}`);

                if (!response.ok) {
                    throw new Error("Failed to load page");
                }

                const result = await response.json();

                const normalizedData = normalizePuckData(result);

                setData(normalizedData);
            } catch (error) {
                console.error(error);

                setData({
                    content: [],
                    root: {
                        props: {
                            title: "",
                            description: "",
                            seoTitle: "",
                            seoDescription: "",
                            showHeader: "show",
                            showFooter: "show",
                        },
                    },
                    zones: {},
                });
            }
        }

        loadPage();
    }, [pageSlug]);

    if (!pageSlug) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                Invalid page.
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                Loading Editor...
            </div>
        );
    }

    return (
        <div className="mr-poly-puck-editor min-h-screen">
            <Puck
                config={puckConfig}
                data={data}
                headerTitle={`MR POLY — ${pageSlug}`}
                overrides={{
                    outline: ({ children }) => (
                        <div
                            style={{
                                color: "#171717",
                                background: "#ffffff",
                            }}
                        >
                            {children}
                        </div>
                    ),
                }}
                onPublish={async (publishedData) => {
                    /**
                     * Normalize the published data as well.
                     *
                     * This guarantees that if a newly created component
                     * somehow doesn't have an id, it gets one before
                     * being saved.
                     */
                    const normalizedPublishedData = normalizePuckData(publishedData as PuckData);

                    try {
                        // 1) Collect assets from content and zones
                        const collected: any[] = [];
                        collectAssetsFromNodes(Array.isArray(normalizedPublishedData.content) ? normalizedPublishedData.content : [], collected);
                        if (normalizedPublishedData.zones) {
                            for (const zoneNodes of Object.values(normalizedPublishedData.zones)) {
                                collectAssetsFromNodes(Array.isArray(zoneNodes) ? (zoneNodes as PuckNode[]) : [], collected);
                            }
                        }

                        if (collected.length > 0) {
                            // 2) Deduplicate by id or slug (prefer id)
                            const uniqueByKey = new Map<string, any>();
                            for (const a of collected) {
                                const key = (a && typeof a === "object" && (a.id || a.slug)) ? (a.id || a.slug) : JSON.stringify(a);
                                if (!uniqueByKey.has(key)) {
                                    uniqueByKey.set(key, a);
                                }
                            }

                            // 3) Persist each unique asset and build savedMap for replacement
                            const savedMap = new Map<string, any>();
                            for (const [key, asset] of uniqueByKey.entries()) {
                                try {
                                    const saved = await persistAssetToApi({ ...asset });
                                    // store by id and by slug for replacement lookup
                                    if (saved && typeof saved === "object") {
                                        if (saved.id) savedMap.set(saved.id, saved);
                                        if (saved.slug) savedMap.set(saved.slug, saved);
                                    } else {
                                        // fallback: set original asset
                                        if (asset.id) savedMap.set(asset.id, asset);
                                        if (asset.slug) savedMap.set(asset.slug, asset);
                                    }
                                } catch (err) {
                                    console.error("Failed to persist asset during publish:", err);
                                    throw err;
                                }
                            }

                            // 4) Replace assets in the published data with the saved representations
                            normalizedPublishedData.content = replaceAssetsInNodes(normalizedPublishedData.content, savedMap);
                            if (normalizedPublishedData.zones) {
                                normalizedPublishedData.zones = Object.fromEntries(
                                    Object.entries(normalizedPublishedData.zones).map(([zoneId, zoneContent]) => [
                                        zoneId,
                                        replaceAssetsInNodes(zoneContent as PuckNode[], savedMap),
                                    ])
                                );
                            }
                        }

                        // 5) Save the page to the pages API
                        const response = await fetch(`/api/editor/pages/${pageSlug}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(normalizedPublishedData),
                        });

                        if (!response.ok) {
                            const text = await response.text().catch(() => "");
                            throw new Error(`Failed to publish page (${response.status}) ${text}`);
                        }

                        // update editor state with normalized/persisted data
                        setData(normalizedPublishedData);
                    } catch (err) {
                        // bubble up to Puck/console for user feedback
                        console.error("Publish failed:", err);
                        throw err;
                    }
                }}
            />
        </div>
    );
}