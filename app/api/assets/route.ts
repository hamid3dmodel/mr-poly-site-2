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

export async function GET() {
    try {
        const data = await readAssets();

        return NextResponse.json(data);
    } catch (error) {
        console.error(
            "Failed to read assets:",
            error,
        );

        return NextResponse.json(
            {
                error: "Failed to load assets",
            },
            {
                status: 500,
            },
        );
    }
}

export async function POST(
    request: Request,
) {
    try {
        const asset =
            (await request.json()) as Asset;

        if (!asset.id) {
            return NextResponse.json(
                {
                    error: "Asset id is required",
                },
                {
                    status: 400,
                },
            );
        }

        if (!asset.name) {
            return NextResponse.json(
                {
                    error: "Asset name is required",
                },
                {
                    status: 400,
                },
            );
        }

        const data = await readAssets();

        const existingAsset =
            data.assets.find(
                (item) => item.id === asset.id,
            );

        if (existingAsset) {
            return NextResponse.json(
                {
                    error: "An asset with this id already exists",
                },
                {
                    status: 409,
                },
            );
        }

        data.assets.push(asset);

        await writeAssets(data);

        return NextResponse.json(
            {
                success: true,
                asset,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error(
            "Failed to create asset:",
            error,
        );

        return NextResponse.json(
            {
                error: "Failed to create asset",
            },
            {
                status: 500,
            },
        );
    }
}