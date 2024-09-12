import { InfiniteGrid } from "@/islands/infinite_grid.tsx";
import { Head } from "$fresh/runtime.ts";

export default function ItemsPage() {
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
                <div className="my-10 mx-8 lg:mx-30 w-full">
                    <InfiniteGrid />
                </div>
            </div>
        </>
    );
}
