import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(
    process.cwd(),
    "data",
    "pages.json",
);

export async function GET() {
    try {
        const file = await fs.readFile(filePath, "utf8");

        const cleanFile = file.replace(/^\uFEFF/, "");

        return NextResponse.json(JSON.parse(cleanFile));
    } catch {
        return NextResponse.json(
            { pages: [] },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

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
            { status: 500 },
        );
    }
}