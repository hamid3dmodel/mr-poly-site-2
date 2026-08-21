import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const pagesPath = path.join(
    process.cwd(),
    "data",
    "pages.json",
);

const dataDirectory = path.join(
    process.cwd(),
    "data",
);

async function getPages() {
    const file = await fs.readFile(
        pagesPath,
        "utf8",
    );

    return JSON.parse(
        file.replace(/^\uFEFF/, ""),
    );
}

export async function GET(
    _request: Request,
    context: {
        params: Promise<{
            slug: string;
        }>;
    },
) {
    try {
        const { slug } = await context.params;

        const pagesData = await getPages();

        const page = pagesData.pages.find(
            (item: {
                id: string;
                dataFile: string;
            }) => item.id === slug,
        );

        if (!page) {
            return NextResponse.json(
                { error: "Page not found" },
                { status: 404 },
            );
        }

        const filePath = path.join(
            dataDirectory,
            page.dataFile,
        );

        const file = await fs.readFile(
            filePath,
            "utf8",
        );

        return NextResponse.json(
            JSON.parse(
                file.replace(/^\uFEFF/, ""),
            ),
        );
    } catch {
        return NextResponse.json(
            {
                error: "Failed to load page",
            },
            {
                status: 500,
            },
        );
    }
}

export async function POST(
    request: Request,
    context: {
        params: Promise<{
            slug: string;
        }>;
    },
) {
    try {
        const { slug } = await context.params;

        const pagesData = await getPages();

        const page = pagesData.pages.find(
            (item: {
                id: string;
                dataFile: string;
            }) => item.id === slug,
        );

        if (!page) {
            return NextResponse.json(
                { error: "Page not found" },
                { status: 404 },
            );
        }

        const data = await request.json();

        const filePath = path.join(
            dataDirectory,
            page.dataFile,
        );

        await fs.writeFile(
            filePath,
            JSON.stringify(data, null, 2),
            "utf8",
        );

        return NextResponse.json({
            success: true,
        });
    } catch {
        return NextResponse.json(
            {
                success: false,
            },
            {
                status: 500,
            },
        );
    }
}