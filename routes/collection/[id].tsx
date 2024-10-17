import type { Handlers, PageProps } from "$fresh/server.ts";
import { metadataCollection } from "@/lib/metadata.ts";
import { BudBody, BudHeader } from "@/islands/bud.tsx";
import { idToBud, ipfsToHttps } from "@/lib/utils.ts";
import { Head } from "$fresh/runtime.ts";
import { Button } from "@/components/ui/button/mod.tsx";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

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
    const description = "#" + id;
    const image = ipfsToHttps(metadata.image, 300);

    return (
        <>
            <Head>
                <meta
                    name="twitter:description"
                    content={description}
                    key="twitter:description"
                />
                <meta
                    name="twitter:image"
                    content={image}
                    key="twitter:image"
                />
                <meta
                    property="og:description"
                    content={description}
                    key="og:description"
                />
                <meta
                    property="og:image"
                    content={image}
                    key="og:image"
                />
            </Head>
            <div className="w-full flex flex-col items-center">
                <div className="flex items-center justify-center h-[10vh] w-full pb-6 pt-10 lg:py-0">
                    <BudHeader>
                        <Button variant="ghost" className="px-10 relative">
                            <ChevronLeftIcon className="w-6 h-6 absolute left-0" />
                            <div className="text-4xl font-black">#{id}</div>
                        </Button>
                    </BudHeader>
                </div>
                <BudBody
                    id={id}
                    metadata={metadata}
                    asset={asset}
                />
            </div>
        </>
    );
}
