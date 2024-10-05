import metadataCollectionWithoutType from "@/data/metadata_extended.json" with {
    type: "json",
};
import type { MetadataCollection } from "@/lib/filter_collection.ts";

export const metadataCollection =
    metadataCollectionWithoutType as MetadataCollection;
