import metadataCollectionWithoutType from "https://raw.githubusercontent.com/spacebudz/wormhole/refs/heads/main/artifacts/metadata.json" with {
    type: "json",
};
import type { MetadataCollection } from "@/lib/filter_collection.ts";

export const metadataCollection =
    metadataCollectionWithoutType as MetadataCollection;

export function ipfsToHttps(ipfs: string, width?: number): string {
    return `https://spacebudz.mypinata.cloud/ipfs/${
        ipfs.split("ipfs://")[1]
    }?pinataGatewayToken=sSzgtarDGSZukrz9lNYbbF30wPGLmIr_UWug05lQPddzrCK5tXa-G-QI7zMgG79m${
        width ? `&img-width=${width}` : ""
    }`;
}
