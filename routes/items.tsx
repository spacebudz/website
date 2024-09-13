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
                <div className="w-full m-6 md:m-10">
                    <InfiniteGrid />
                </div>
            </div>
        </>
    );
}
