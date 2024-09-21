import type { PageProps } from "$fresh/server.ts";
import metadata from "https://raw.githubusercontent.com/spacebudz/wormhole/refs/heads/main/artifacts/metadata.json" with {
    type: "json",
};
import { Bud } from "@/islands/bud.tsx";
import { fromText, toLabel } from "https://deno.land/x/lucid@0.10.10/mod.ts";

type MetadataCollection = Record<string, Metadata>;

export type Metadata = {
    name: string;
    traits: string[];
    type: string;
    image: string;
    sha256: string;
};

function idToBud(id: number): string {
    return toLabel(222) + fromText(`Bud${id}`);
}

export default function BudPage(props: PageProps) {
    const id = parseInt(props.params.id);
    const asset = {
        policyId: "4523c5e21d409b81c95b45b0aea275b8ea1406e6cafea5583b9f8a5f",
        assetName: idToBud(id),
    };
    return (
        <Bud
            id={id}
            metadata={(metadata as MetadataCollection)[id]}
            asset={asset}
        />
    );
}
