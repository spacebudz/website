import { PageProps } from "$fresh/server.ts";

export default function Layout({ Component }: PageProps) {
    // do something with state here
    return (
        <div>
            <div className="w-full h-full flex justify-center">
                <div className="w-full max-w-screen-2xl h-full">
                    {/* @ts-ignore */}
                    <Component />
                </div>
            </div>
        </div>
    );
}
