import { promises as fs } from "fs";
import path from "path";
import { Render } from "@puckeditor/core";
import { puckConfig } from "@/components/editor/puck.config";

async function getAssetsPageData() {
    const filePath = path.join(process.cwd(), "data", "assets-page.json");
    const file = await fs.readFile(filePath, "utf8");
    return JSON.parse(file.replace(/^\uFEFF/, ""));
}

export default async function AssetsPage() {
    const data = await getAssetsPageData();
    return <Render config={puckConfig} data={data} />;
}
