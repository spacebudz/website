import { PageProps } from "$fresh/server.ts";
import { ModeToggle } from "@/islands/toggle_dark_mode.tsx";
import { Button } from "@/components/ui/button/mod.tsx";
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Layout({ Component }: PageProps) {
    return (
        <div>
            <div className="w-full h-full flex justify-center">
                <div className="w-full max-w-screen-2xl h-full flex flex-col">
                    <div className="w-full min-h-screen">
                        {/* @ts-ignore */}
                        <Component />
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

function Footer() {
    return (
        <div className="w-full text-center mt-72 p-8 md:p-20 relative flex items-center justify-center flex-col">
            <div className="w-full flex flex-col-reverse lg:flex-row gap-14">
                <div className="max-w-md text-left text-xl font-mono">
                    In the vastness of space, true freedom is found not in the
                    stars, but in the code that binds them.
                </div>
                <div className="w-full flex justify-center space-x-20">
                    <div className="flex flex-col items-start space-y-3">
                        <a
                            href="/"
                            className="hover:underline underline-offset-4"
                        >
                            Base
                        </a>
                        <a
                            href="/collection"
                            className="hover:underline underline-offset-4"
                        >
                            Collection
                        </a>
                        <a
                            href="/about"
                            className="hover:underline underline-offset-4"
                        >
                            About
                        </a>
                    </div>
                    <div className="flex flex-col items-start space-y-3">
                        <a
                            href="https://spacebudz.gitbook.io/spacebudz"
                            target="_blank"
                            className="hover:underline underline-offset-4"
                        >
                            Guide
                        </a>
                        <a
                            href="https://spacebudz.io/license"
                            target="_blank"
                            className="hover:underline underline-offset-4"
                        >
                            License
                        </a>
                        <a
                            href="https://github.com/spacebudz/nebula"
                            target="_blank"
                            className="hover:underline underline-offset-4"
                        >
                            Nebula
                        </a>
                        <a
                            href="#"
                            target="_blank"
                            className="hover:underline underline-offset-4"
                        >
                            Store
                        </a>
                        <a
                            href="https://spacebudz.io/wormhole"
                            target="_blank"
                            className="hover:underline underline-offset-4"
                        >
                            Wormhole
                        </a>
                    </div>
                </div>
                <div className="flex items-end space-x-4">
                    <Button asChild size="icon" variant="outline">
                        <a
                            href="https://github.com/spacebudz"
                            target="_blank"
                        >
                            <GitHubLogoIcon />
                        </a>
                    </Button>
                    <Button asChild size="icon" variant="outline">
                        <a
                            href="https://discord.com/invite/vtmm6RG2Bv"
                            target="_blank"
                        >
                            <DiscordLogoIcon />
                        </a>
                    </Button>
                    <Button
                        asChild
                        size="icon"
                        variant="outline"
                    >
                        <a
                            href="https://x.com/spacebudzNFT"
                            target="_blank"
                        >
                            <img
                                draggable={false}
                                src="/x.svg"
                                className="invert dark:invert-0 w-3"
                            />
                        </a>
                    </Button>
                    <Button
                        asChild
                        size="icon"
                        variant="outline"
                    >
                        <a
                            href="https://t.me/spacebudz"
                            target="_blank"
                        >
                            <img
                                draggable={false}
                                src="/telegram.svg"
                                className="invert dark:invert-0 w-3"
                            />
                        </a>
                    </Button>
                </div>
            </div>
            <div className="w-full mt-24 ml-8">
                <img
                    draggable={false}
                    src="/spacebudz.svg"
                    className="w-16 h-16 invert dark:invert-0 pointer-events-none"
                />
            </div>
            <div className="flex w-full mt-4 items-center justify-between">
                <div className="opacity-70 text-xs md:text-sm font-light">
                    © SpaceBudz. All rights reserved.
                </div>
                <ModeToggle />
            </div>
        </div>
    );
}
