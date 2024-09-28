import { Head } from "$fresh/runtime.ts";
import { InfiniteGrid, ScrollPanel } from "@/islands/collection.tsx";
import { Button } from "@/components/ui/button/mod.tsx";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card/mod.tsx";
import metadata from "https://raw.githubusercontent.com/spacebudz/wormhole/refs/heads/main/artifacts/metadata.json" with {
    type: "json",
};
import {
    filterCollection,
    MetadataCollection,
} from "@/lib/filter_collection.ts";
import { PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";

export default function CollectionPage(props: PageProps) {
    const data = useSignal(filterCollection({
        metadataCollection: metadata as MetadataCollection,
        params: props.url.searchParams,
    }));

    return (
        <>
            <Head>
                <style>
                    {`
                        :root {
                            scroll-behavior: auto; 
                        }
                    `}
                </style>
            </Head>
            <div className="flex justify-center items-center w-full h-full">
                <div className="flex justify-center items-center flex-col max-w-screen-xl w-full">
                    <Card className="w-full pt-4 bg-[linear-gradient(hsl(var(--background)),hsl(var(--background)/0.82)),url(/wardrobe.jpeg)] bg-cover bg-center border-t-0 border-r-0 border-l-0 rounded-t-none shadow-none">
                        <CardHeader>
                            <CardDescription className="text-primary text-balance max-w-lg font-mono">
                                From species to gadgets, colors to emotions, the
                                SpaceBudz collection features a wide range of
                                unique explorers. Each one brings its own
                                character to the universe, one adventure at a
                                time.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button asChild variant="outline">
                                <a
                                    href="https://spacebudz.gitbook.io/spacebudz/the-collection/"
                                    target="_blank"
                                >
                                    Discover
                                </a>
                            </Button>
                        </CardFooter>
                    </Card>
                    <ScrollPanel data={data} />
                    <div className="w-full mt-8">
                        <InfiniteGrid data={data} />
                    </div>
                </div>
            </div>
        </>
    );
}
