"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Page = {
    id: string;
    slug: string;
    title: string;
    dataFile: string;
    published: boolean;
};

export default function PageManager() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPages() {
            const response = await fetch("/api/editor/pages");
            const data = await response.json();
            setPages(data.pages || []);
            setLoading(false);
        }

        loadPages();
    }, []);

    if (loading) {
        return <div className="p-10 text-white">Loading pages...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="mx-auto max-w-6xl px-8 py-16">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">MR POLY</p>

                        <h1 className="mt-2 text-4xl font-bold">Pages</h1>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/editor/assets"
                            className="rounded-lg border border-white/10 px-4 py-3 text-sm hover:bg-white/5"
                        >
                            Manage Assets
                        </Link>

                        <button
                            type="button"
                            className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-200"
                        >
                            + New Page
                        </button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {pages.map((page) => (
                        <div
                            key={page.id}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-5"
                        >
                            <div>
                                <h2 className="font-medium">{page.title}</h2>

                                <p className="mt-1 text-sm text-zinc-500">{page.slug}</p>
                            </div>

                            <Link
                                href={`/editor/${page.id}`}
                                className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                            >
                                Edit
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}