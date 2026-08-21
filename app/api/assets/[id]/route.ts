import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const assetsPath = path.join(
    process.cwd(),
    "data",
    "assets.json",
);

type Asset = {
    id: string;
    name: string;
    slug: string;
    style: "low-poly" | "realistic";
    category:
        | "vehicles"
        | "characters"
        | "environments"
        | "nature";
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

type AssetsData = {
    assets: Asset[];
};

async function readAssets(): Promise<AssetsData> {
    const file = await fs.readFile(
        assetsPath,
        "utf8",
    );

    const cleanFile = file.replace(
        /^\uFEFF/,
        "",
    );

    return JSON.parse(cleanFile);
}

async function writeAssets(
    data: AssetsData,
) {
    await fs.writeFile(
        assetsPath,
        JSON.stringify(data, null, 2),
        "utf8",
    );
}

async function getAssetId(
    context: {
        params: Promise<{
            id: string;
        }>;
    },
) {
    const { id } = await context.params;

    return decodeURIComponent(id);
}

export async function GET(
    _request: Request,
    context: {
        params: Promise<{
            id: string;
        }>;
    },
) {
    try {
        const id = await getAssetId(context);

        const data = await readAssets();

        const asset = data.assets.find(
            (item) =>
                item.id === id ||
                item.slug === id,
        );

        if (!asset) {
            return NextResponse.json(
                {
                    error: "Asset not found",
                },
                {
                    status: 404,
                },
            );
        }

        return NextResponse.json(asset);
    } catch (error) {
        console.error(
            "Failed to load asset:",
            error,
        );

        return NextResponse.json(
            {
                error: "Failed to load asset",
            },
            {
                status: 500,
            },
        );
    }
}

export async function PUT(
    request: Request,
    context: {
        params: Promise<{
            id: string;
        }>;
    },
) {
    try {
        const id = await getAssetId(context);

        const updatedAsset =
            (await request.json()) as Asset;

        const data = await readAssets();

        const assetIndex =
            data.assets.findIndex(
                (item) =>
                    item.id === id ||
                    item.slug === id,
            );

        if (assetIndex === -1) {
            return NextResponse.json(
                {
                    error: "Asset not found",
                },
                {
                    status: 404,
                },
            );
        }

        if (!updatedAsset.id) {
            return NextResponse.json(
                {
                    error: "Asset id is required",
                },
                {
                    status: 400,
                },
            );
        }

        if (!updatedAsset.name) {
            return NextResponse.json(
                {
                    error: "Asset name is required",
                },
                {
                    status: 400,
                },
            );
        }

        data.assets[assetIndex] =
            updatedAsset;

        await writeAssets(data);

        return NextResponse.json({
            success: true,
            asset: updatedAsset,
        });
    } catch (error) {
        console.error(
            "Failed to update asset:",
            error,
        );

        return NextResponse.json(
            {
                error: "Failed to update asset",
            },
            {
                status: 500,
            },
        );
    }
}

export async function DELETE(
    _request: Request,
    context: {
        params: Promise<{
            id: string;
        }>;
    },
) {
    try {
        const id = await getAssetId(context);

        const data = await readAssets();

        const assetIndex =
            data.assets.findIndex(
                (item) =>
                    item.id === id ||
                    item.slug === id,
            );

        if (assetIndex === -1) {
            return NextResponse.json(
                {
                    error: "Asset not found",
                },
                {
                    status: 404,
                },
            );
        }

        const [
            deletedAsset,
        ] = data.assets.splice(
            assetIndex,
            1,
        );

        await writeAssets(data);

        return NextResponse.json({
            success: true,
            asset: deletedAsset,
        });
    } catch (error) {
        console.error(
            "Failed to delete asset:",
            error,
        );

        return NextResponse.json(
            {
                error: "Failed to delete asset",
            },
            {
                status: 500,
            },
        );
    }
}