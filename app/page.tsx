import { promises as fs } from "fs";
import path from "path";
import PuckRenderer from "@/components/editor/PuckRenderer";

async function getHomeData() {
    const filePath = path.join(process.cwd(), "data", "home.json");
    const file = await fs.readFile(filePath, "utf8");

    // Remove UTF-8 BOM if present.
    const cleanFile = file.replace(/^\uFEFF/, "");
    return JSON.parse(cleanFile);
}

export default async function Home() {
    const data = await getHomeData();
    return <PuckRenderer data={data} />;
}