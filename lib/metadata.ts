import metadataCollectionWithoutType from "https://raw.githubusercontent.com/spacebudz/wormhole/refs/heads/main/artifacts/metadata.json" with {
    type: "json",
};
import type { MetadataCollection } from "@/lib/filter_collection.ts";

export const metadataCollection =
    metadataCollectionWithoutType as MetadataCollection;
