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
    usedIds: Set<string> = new Set(),
): PuckNode[] {
    return nodes.map((node) => {
        const currentProps = node.props ?? {};

        let id =
            typeof currentProps.id === "string"
                ? currentProps.id
                : "";

        if (!id || usedIds.has(id)) {
            id = `${node.type}-${crypto.randomUUID()}`;
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
                        "props" in item,
                );

                if (looksLikePuckNodes) {
                    normalizedProps[key] = normalizePuckNodes(
                        value as PuckNode[],
                        usedIds,
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

        content: normalizePuckNodes(
            Array.isArray(data.content)
                ? data.content
                : [],
            usedIds,
        ),

        zones: data.zones
            ? Object.fromEntries(
                Object.entries(data.zones).map(
                    ([zoneId, zoneContent]) => [
                        zoneId,
                        normalizePuckNodes(
                            Array.isArray(zoneContent)
                                ? zoneContent
                                : [],
                            usedIds,
                        ),
                    ],
                ),
            )
            : data.zones,
    };
}

export default function PuckEditor({
                                       pageSlug,
                                   }: Props) {
    const [data, setData] = useState<PuckData | null>(null);

    useEffect(() => {
        if (!pageSlug) {
            return;
        }

        async function loadPage() {
            try {
                const response = await fetch(
                    `/api/editor/pages/${pageSlug}`,
                );

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
                    const normalizedPublishedData =
                        normalizePuckData(
                            publishedData as PuckData,
                        );

                    const response = await fetch(
                        `/api/editor/pages/${pageSlug}`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(
                                normalizedPublishedData,
                            ),
                        },
                    );

                    if (!response.ok) {
                        throw new Error(
                            "Failed to publish page",
                        );
                    }

                    setData(normalizedPublishedData);
                }}
            />
        </div>
    );
}