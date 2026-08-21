import { promises as fs } from "fs";
import path from "path";
import { Render } from "@puckeditor/core";
import { puckConfig } from "@/components/editor/puck.config";

async function getAboutData() {
    const filePath = path.join(
        process.cwd(),
        "data",
        "about.json",
    );

    const file = await fs.readFile(filePath, "utf8");

    const cleanFile = file.replace(/^\uFEFF/, "");

    return JSON.parse(cleanFile);
}

export default async function AboutPage() {
    const data = await getAboutData();

    return (
        <Render
            config={puckConfig}
            data={data}
        />
    );
}