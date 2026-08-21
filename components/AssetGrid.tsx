import type { Asset } from "@/data/assets";
import AssetCard from "./AssetCard";

type AssetGridProps = {
    assets: Asset[];
};

export default function AssetGrid({ assets }: AssetGridProps) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {assets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
            ))}
        </div>
    );
}