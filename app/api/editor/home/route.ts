import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(
    process.cwd(),
    "data",
    "home.json",
);

export async function GET() {
    try {
        const file = await fs.readFile(filePath, "utf8");
        const data = JSON.parse(file);

        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            {
                content: [],
                root: {},
            },
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