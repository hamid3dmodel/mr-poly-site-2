export type AssetStyle = "low-poly" | "realistic";

export type AssetCategory =
    | "vehicles"
    | "characters"
    | "environments"
    | "nature";

export type StoreLink = {
    name: string;
    url: string;
};

export type Asset = {
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

export const assets: Asset[] = [
    {
        id: "realistic-supermarket",
        name: "Realistic Supermarket",
        slug: "realistic-supermarket",
        style: "realistic",
        category: "environments",

        shortDescription:
            "A detailed realistic supermarket environment designed for games and real-time projects.",

        description:
            "Realistic Supermarket is a detailed, game-ready environment featuring optimized geometry, realistic materials, and modular assets suitable for a wide range of real-time projects.",

        thumbnail: "/assets/realistic-supermarket/thumbnail.jpg",

        gallery: [
            "/assets/realistic-supermarket/01.jpg",
            "/assets/realistic-supermarket/02.jpg",
            "/assets/realistic-supermarket/03.jpg",
        ],

        features: [
            "Game-ready optimized geometry",
            "High-quality materials",
            "Modular environment",
            "Easy to customize",
            "Suitable for real-time projects",
        ],

        technicalSpecs: {
            polygons: "Optimized",
            textures: "2K / 4K",
            formats: "FBX",
            engine: "Unreal Engine / Unity",
        },

        stores: [
            {
                name: "Unity Asset Store",
                url: "https://assetstore.unity.com/",
            },
            {
                name: "Fab",
                url: "https://www.fab.com/",
            },
            {
                name: "BlenderKit",
                url: "https://www.blenderkit.com/",
            },
        ],
    },
];