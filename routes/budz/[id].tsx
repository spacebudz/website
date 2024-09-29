import type { PageProps } from "$fresh/server.ts";
import metadataCollectionWithoutType from "https://raw.githubusercontent.com/spacebudz/wormhole/refs/heads/main/artifacts/metadata.json" with {
    type: "json",
};
import { Bud } from "@/islands/bud.tsx";
import { fromText, toLabel } from "https://deno.land/x/lucid@0.10.10/mod.ts";
import { MetadataCollection } from "@/lib/filter_collection.ts";
import { Head } from "$fresh/runtime.ts";

function idToBud(id: number): string {
    return toLabel(222) + fromText(`Bud${id}`);
}

const metadataCollection: MetadataCollection = metadataCollectionWithoutType;

export default function BudPage(props: PageProps) {
    const id = parseInt(props.params.id);
    const asset = {
        policyId: "4523c5e21d409b81c95b45b0aea275b8ea1406e6cafea5583b9f8a5f",
        assetName: idToBud(id),
    };
    const metadata = metadataCollection[id];
    const image = `https://spacebudz.mypinata.cloud/ipfs/${
        metadata.image.split("ipfs://")[1]
    }?pinataGatewayToken=sSzgtarDGSZukrz9lNYbbF30wPGLmIr_UWug05lQPddzrCK5tXa-G-QI7zMgG79m?img-width=300`;

    return (
        <>
            <Head>
                <meta name="twitter:description" content={"#" + id} />
                <meta
                    name="twitter:image"
                    content={image}
                />
                <meta property="og:description" content={"#" + id} />
                <meta
                    property="og:image"
                    content={image}
                />
            </Head>
            <Bud
                id={id}
                metadata={metadata}
                asset={asset}
            />
        </>
    );
}
