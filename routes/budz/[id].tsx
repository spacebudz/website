import type { PageProps } from "$fresh/server.ts";
import { metadataCollection } from "@/lib/metadata.ts";
import { Bud } from "@/islands/bud.tsx";
import { fromText, toLabel } from "https://deno.land/x/lucid@0.10.10/mod.ts";

function idToBud(id: number): string {
    return toLabel(222) + fromText(`Bud${id}`);
}

export default function BudPage(props: PageProps) {
    const id = parseInt(props.params.id);
    const asset = {
        policyId: "4523c5e21d409b81c95b45b0aea275b8ea1406e6cafea5583b9f8a5f",
        assetName: idToBud(id),
    };
    const metadata = metadataCollection[id];

    return (
        <>
            <Bud
                id={id}
                metadata={metadata}
                asset={asset}
            />
        </>
    );
}
