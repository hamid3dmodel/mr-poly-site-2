import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 },
            );
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Only image files are allowed" },
                { status: 400 },
            );
        }

        const maxSize = 10 * 1024 * 1024;

        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "Image size must be less than 10MB" },
                { status: 400 },
            );
        }

        const uploadDirectory = path.join(
            process.cwd(),
            "public",
            "uploads",
        );

        await fs.mkdir(uploadDirectory, {
            recursive: true,
        });

        const extension =
            file.name.split(".").pop()?.toLowerCase() || "jpg";

        const filename = `${crypto.randomUUID()}.${extension}`;

        const filePath = path.join(
            uploadDirectory,
            filename,
        );

        const buffer = Buffer.from(
            await file.arrayBuffer(),
        );

        await fs.writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            url: `/uploads/${filename}`,
        });
    } catch {
        return NextResponse.json(
            {
                error: "Upload failed",
            },
            {
                status: 500,
            },
        );
    }
}