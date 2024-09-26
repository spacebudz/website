import { PageProps } from "$fresh/server.ts";
import { ModeToggle } from "@/islands/toggle_dark_mode.tsx";

export default function Layout({ Component }: PageProps) {
    return (
        <div>
            <div className="w-full h-full flex justify-center">
                <div className="w-full max-w-screen-2xl h-full flex flex-col">
                    <div className="w-full min-h-screen">
                        {/* @ts-ignore */}
                        <Component />
                    </div>
                    <div className="w-full text-center mt-72 h-[300px] border-t relative">
                        Footer TODO
                        <div className="absolute bottom-20 right-10">
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
