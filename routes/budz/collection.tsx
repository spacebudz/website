import { InfiniteGrid } from "@/islands/infinite_grid.tsx";
import { Head } from "$fresh/runtime.ts";

import { Button } from "@/components/ui/button/mod.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card/mod.tsx";
import { Progress } from "@/islands/ui/progress/mod.tsx";

function CardComponent() {
    return (
        <Card
            className="pt-4 bg-wardrobe bg-cover bg-center border-t-0 border-r-0 border-l-0 rounded-t-none shadow-none"
            style={{}}
        >
            <CardHeader>
                <CardDescription className="text-primary text-balance max-w-lg">
                    From species to gadgets, colors to emotions, the SpaceBudz
                    collection features a wide range of unique explorers. Each
                    one brings its own character to the universe, one adventure
                    at a time.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button asChild variant="outline">
                    <a
                        href="https://spacebudz.gitbook.io/spacebudz/the-collection/"
                        target="_blank"
                    >
                        More
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
}

function ProgressComponent() {
    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <CardDescription>Placeholder</CardDescription>
                <CardTitle className="text-4xl">TODO</CardTitle>
            </CardHeader>
        </Card>
    );
}

export default function CollectionPage() {
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
            <div className="flex justify-center items-center">
                <div className="flex justify-center items-center flex-col max-w-screen-2xl w-full mx-8 md:mx-20">
                    <div className="w-full max-w-screen-xl">
                        <CardComponent />
                    </div>

                    <div className="w-full flex justify-center items-center space-x-2 sticky top-0 mt-2 z-20 max-w-screen-xl">
                        <ProgressComponent />
                        <ProgressComponent />
                        <ProgressComponent />
                    </div>

                    <div className="w-full mt-10">
                        <InfiniteGrid />
                    </div>
                </div>
            </div>
        </>
    );
}
