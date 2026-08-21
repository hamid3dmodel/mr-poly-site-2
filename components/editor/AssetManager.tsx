"use client";

import { useEffect, useMemo, useState } from "react";
import type { EditableAsset } from "./AssetEditorField";

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
    technicalSpecs: { polygons: "", textures: "", formats: "", engine: "" },
    stores: [],
};

function createUniqueId() {
    try {
        // @ts-ignore
        if (typeof crypto !== "undefined" && typeof (crypto as any).randomUUID === "function") {
            // @ts-ignore
            return (crypto as any).randomUUID();
        }
    } catch {}
    return `asset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function AssetManager() {
    const [assets, setAssets] = useState<EditableAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [localAsset, setLocalAsset] = useState<EditableAsset | null>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // dynamic import of full AssetEditorField
    const [EditorComp, setEditorComp] = useState<null | React.ComponentType<any>>(null);
    const [editorImportError, setEditorImportError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        import("./AssetEditorField")
            .then((m) => {
                if (!mounted) return;
                setEditorComp(() => m.default);
            })
            .catch((err) => {
                console.error("Failed to import AssetEditorField dynamically:", err);
                if (!mounted) return;
                setEditorComp(null);
                setEditorImportError(String(err?.message || err));
            });
        return () => {
            mounted = false;
        };
    }, []);

    async function loadAssets() {
        setLoading(true);
        try {
            console.debug("[AssetManager] GET /api/assets");
            const res = await fetch("/api/assets", { cache: "no-store" });
            const json = await res.json();
            const list = Array.isArray(json.assets) ? json.assets : [];
            console.debug("[AssetManager] assets loaded:", list.map((a: any) => a.slug));
            setAssets(list);
        } catch (err) {
            console.error("[AssetManager] loadAssets error:", err);
            setAssets([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAssets();
    }, []);

    useEffect(() => {
        if (!selectedId) {
            setLocalAsset(null);
            return;
        }
        const found = assets.find((a) => a.id === selectedId);
        setLocalAsset(found ? { ...found } : null);
    }, [selectedId, assets]);

    function newLocalAsset(e?: React.MouseEvent) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        console.debug("[AssetManager] newLocalAsset clicked");
        const id = createUniqueId();
        const slug = `new-asset-${id.slice(-6)}`;
        const newA: EditableAsset = { ...emptyAsset, id, name: "New Asset", slug };
        console.debug("[AssetManager] created local asset:", { id, slug });
        setSelectedId(newA.id);
        setLocalAsset(newA);
        setMessage("New asset created (local). Fill fields and press Save.");
        setTimeout(() => setMessage(null), 3000);
    }

    async function saveLocalAsset() {
        if (!localAsset) return;
        setSaving(true);
        try {
            const exists = assets.some((a) => a.id === localAsset.id);
            const url = exists ? `/api/assets/${encodeURIComponent(localAsset.id)}` : `/api/assets`;
            const method = exists ? "PUT" : "POST";
            console.debug(`[AssetManager] ${method} ${url}`, localAsset);

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(localAsset),
            });

            const text = await res.text();
            let json: any = null;
            try { json = JSON.parse(text); } catch {}
            if (!res.ok) {
                console.error("[AssetManager] save failed:", res.status, text);
                throw new Error(`Save failed ${res.status}`);
            }

            const saved: EditableAsset = (json && json.asset) ? json.asset : localAsset;
            await loadAssets();
            setLocalAsset(saved);
            setSelectedId(saved.id);
            setMessage("Asset saved.");
            setTimeout(() => setMessage(null), 2000);
            console.debug("[AssetManager] saved asset:", saved.slug || saved.id);
        } catch (err) {
            console.error("[AssetManager] saveLocalAsset error:", err);
            setMessage("Failed to save asset. See console.");
            setTimeout(() => setMessage(null), 3500);
        } finally {
            setSaving(false);
        }
    }

    async function deleteSelectedAsset() {
        if (!localAsset || !localAsset.id) return;
        if (!confirm(`Delete "${localAsset.name}"?`)) return;
        setSaving(true);
        try {
            console.debug("[AssetManager] DELETE /api/assets/" + encodeURIComponent(localAsset.id));
            const res = await fetch(`/api/assets/${encodeURIComponent(localAsset.id)}`, { method: "DELETE" });
            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                throw new Error(`Delete failed ${res.status} ${txt}`);
            }
            await loadAssets();
            setSelectedId(null);
            setLocalAsset(null);
            setMessage("Asset deleted.");
            setTimeout(() => setMessage(null), 2000);
        } catch (err) {
            console.error("[AssetManager] deleteSelectedAsset error:", err);
            setMessage("Failed to delete asset. See console.");
            setTimeout(() => setMessage(null), 3500);
        } finally {
            setSaving(false);
        }
    }

    const assetOptions = useMemo(() => assets.slice().sort((a, b) => a.name.localeCompare(b.name)), [assets]);

    // plain fallback editor (used only if dynamic import failed)
    function FallbackEditor({ asset, onChange }: { asset: EditableAsset; onChange: (v: EditableAsset) => void }) {
        if (!asset) return null;
        return (
            <div className="space-y-3">
                <div><label className="text-xs text-zinc-400">Name</label><input value={asset.name} onChange={(e)=>onChange({...asset, name:e.target.value})} className="mt-1 w-full ..." /></div>
                <div><label className="text-xs text-zinc-400">Slug</label><input value={asset.slug} onChange={(e)=>onChange({...asset, slug:e.target.value})} className="mt-1 w-full ..." /></div>
                <div><label className="text-xs text-zinc-400">Thumbnail</label><input value={asset.thumbnail} onChange={(e)=>onChange({...asset, thumbnail:e.target.value})} className="mt-1 w-full ..." /></div>
                <div><label className="text-xs text-zinc-400">Short Description</label><textarea value={asset.shortDescription} onChange={(e)=>onChange({...asset, shortDescription:e.target.value})} rows={3} className="mt-1 w-full ..." /></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="mx-auto max-w-6xl px-8 py-16">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">MR POLY</p>
                        <h1 className="mt-2 text-4xl font-bold">Asset Manager</h1>
                    </div>

                    <div className="flex gap-3">
                        <button type="button" onClick={newLocalAsset} className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-200">+ New Asset</button>
                        <button type="button" onClick={(e)=>{e.preventDefault(); e.stopPropagation(); loadAssets();}} className="rounded-lg border border-white/10 px-4 py-3 text-sm hover:bg-white/5">Refresh</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <aside className="space-y-4">
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                            <div className="mb-3 flex items-center justify-between"><div className="text-sm font-medium">Assets ({assets.length})</div></div>
                            {loading ? <div className="text-xs text-zinc-500">Loading...</div> : assetOptions.length===0 ? <div className="text-xs text-zinc-500">No assets</div> : (
                                <div className="space-y-2 max-h-[60vh] overflow-auto">
                                    {assetOptions.map(a => (
                                        <button key={a.id} type="button" onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); console.debug("[AssetManager] select",a.id,a.slug); setSelectedId(a.id); setLocalAsset({...a});}} className={`w-full text-left rounded-md px-3 py-2 hover:bg-white/5 ${selectedId===a.id?"bg-white/5":""}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 min-w-0"><div className="truncate font-medium">{a.name}</div><div className="text-xs text-zinc-500 truncate">{a.slug}</div></div>
                                                {a.thumbnail ? <img src={a.thumbnail} alt="" className="h-8 w-8 rounded object-cover" /> : <div className="h-8 w-8 bg-zinc-800 rounded" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                            <div className="text-sm font-medium mb-2">Quick actions</div>
                            <div className="flex flex-col gap-2">
                                <button type="button" onClick={()=>{ setSelectedId(null); setLocalAsset(null); }} className="rounded-md border border-white/10 px-3 py-2 text-sm">Clear editor</button>
                                <button type="button" onClick={()=>{ navigator.clipboard?.writeText(JSON.stringify(assets, null,2)); setMessage("Copied"); setTimeout(()=>setMessage(null),1500); }} className="rounded-md border border-white/10 px-3 py-2 text-sm">Copy assets JSON</button>
                            </div>
                        </div>
                    </aside>

                    <main className="md:col-span-2">
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium">{localAsset ? `Editing: ${localAsset.name}` : "No asset selected"}</div>
                                    <div className="text-xs text-zinc-500">Select an asset from the left or create a new one</div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {message && <div className="rounded-md bg-white/5 px-3 py-2 text-xs text-zinc-300">{message}</div>}
                                    <button type="button" onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); saveLocalAsset(); }} disabled={!localAsset || saving} className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-black disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
                                    <button type="button" onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); deleteSelectedAsset(); }} disabled={!localAsset || !localAsset.id || saving} className="rounded-md border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-400 disabled:opacity-50">Delete</button>
                                </div>
                            </div>

                            <div>
                                {localAsset ? (
                                    EditorComp ? (
                                        <EditorComp field={{ label: "Asset" }} value={localAsset} onChange={(v:any)=>setLocalAsset({...(v||{})})} />
                                    ) : (
                                        <div>
                                            {editorImportError ? <div className="mb-4 rounded-md bg-red-500/5 p-3 text-xs text-red-300">Editor failed to load: {editorImportError}</div> : <div className="mb-4 text-xs text-zinc-500">Editor loading...</div>}
                                            <FallbackEditor asset={localAsset} onChange={(v)=>setLocalAsset(v)} />
                                        </div>
                                    )
                                ) : (
                                    <div className="text-sm text-zinc-500">Choose or create an asset to edit its details.</div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}