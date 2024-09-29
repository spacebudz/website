import type { Handlers, PageProps } from "$fresh/server.ts";
import { metadataCollection } from "@/lib/metadata.ts";
import { Bud } from "@/islands/bud.tsx";
import { idToBud } from "@/lib/utils.ts";

export const handler: Handlers = {
    GET(_req, ctx) {
        const id = Number(ctx.params.id);
        if (Number.isNaN(id) || id < 0 || id > 10000) {
            return ctx.renderNotFound();
        }
        return ctx.render();
    },
};

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
