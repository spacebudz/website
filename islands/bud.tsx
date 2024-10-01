// @deno-types="npm:@types/react@18.3.1"
import * as React from "react";
import {
    DashedCircle,
    PartialCircle,
} from "@/islands/circle_animation/mod.tsx";
import { Button } from "@/components/ui/button/mod.tsx";
import {
    CheckIcon,
    ChevronLeftIcon,
    CodeIcon,
    CopyIcon,
} from "@radix-ui/react-icons";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card/mod.tsx";
import { cn, ipfsToHttps, shuffleArrayWithSeed } from "@/lib/utils.ts";
import { Badge } from "@/components/ui/badge/mod.tsx";
import { useObserveElementDimension } from "@/islands/hooks/use_observe_dimension.tsx";
import type { Metadata } from "@/lib/filter_collection.ts";

export type BudProps = {
    id: number;
    metadata: Metadata;
    asset: { policyId: string; assetName: string };
};

export function Bud({ id, metadata, asset }: BudProps) {
    const src = ipfsToHttps(metadata.image);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isShowingMetadata, setIsShowingMetadata] = React.useState<boolean>(
        false,
    );

    React.useEffect(() => {
        const image = new Image();
        image.src = src;
        image.onload = () => {
            setIsLoading(false);
        };
        return () => {
            image.src = "";
        };
    }, []);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex items-center justify-center h-[10vh] w-full pb-6 pt-10 lg:py-0">
                <Button asChild variant="outline">
                    <a
                        className="flex justify-center items-center space-x-2"
                        href="/collection"
                        onClick={(e) => {
                            if (document?.referrer) {
                                const referrerUrl = new URL(document.referrer);
                                if (
                                    new URL(
                                        "/collection",
                                        globalThis.origin,
                                    ).href ===
                                        new URL(
                                            referrerUrl.pathname,
                                            referrerUrl.origin,
                                        ).href
                                ) {
                                    e.preventDefault();
                                    globalThis.history.back();
                                }
                            }
                        }}
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                        <div>Bud #{id}</div>
                    </a>
                </Button>
            </div>
            <div className="flex justify-center w-full h-full lg:min-h-[90vh] flex-col lg:flex-row pt-6">
                {!isLoading && (
                    <>
                        <div className="lg:w-3/5 h-full flex justify-center w-full px-2 lg:px-0">
                            <div className="w-full lg:w-[80%] h-full flex items-center">
                                <div className="relative w-full h-0 pb-[100%] overflow-hidden">
                                    <>
                                        <div className="absolute w-full h-full flex items-center justify-center">
                                            <DashedCircle
                                                className="w-[93%] h-[93%] animate-out opacity-0 fade-out-70 spin-out-45 duration-1000 delay-150 fill-mode-forwards"
                                                dashes={300}
                                                dashLength={0.04}
                                            />
                                        </div>
                                        <PartialCircle className="absolute w-full h-full animate-out spin-out-[-90deg] fade-out-100 duration-1000 opacity-0 delay-500 fill-mode-forwards" />
                                        <PartialCircle className="absolute w-full h-full animate-out spin-out-[90deg] fade-out-100 duration-1000 opacity-0 delay-500 fill-mode-forwards" />
                                        <img
                                            className="absolute w-full h-full animate-in fade-in zoom-in-90 duration-500"
                                            src={src}
                                        />
                                    </>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-full lg:w-2/5 flex flex-col items-center px-6 lg:px-0 pt-6 lg:pt-0 lg:pr-12 animate-out opacity-0 fade-out-100 delay-1000 duration-1000 fill-mode-forwards">
                            <div className="text-3xl font-bold text-left w-full">
                                <a href="#">{metadata.type}</a>
                            </div>
                            <div className="flex w-full mt-4 space-x-2">
                                <Card className="w-full max-w-[300px] h-[100px] overflow-hidden relative border-none">
                                    <img
                                        draggable={false}
                                        className={cn(
                                            "-left-36 absolute min-w-[800px]",
                                            metadata.type === "Dino"
                                                ? "-top-[270px]"
                                                : "-top-72",
                                        )}
                                        src={src}
                                    />
                                </Card>
                            </div>
                            <div className="w-full flex-wrap flex items-center justify-start mt-4 gap-4">
                                <Button
                                    className={cn(
                                        isShowingMetadata && "bg-border",
                                    )}
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        setIsShowingMetadata((
                                            isShowingMetadata,
                                        ) => !isShowingMetadata)}
                                >
                                    <CodeIcon className="mr-1" />
                                    <div>Metadata</div>
                                </Button>
                                <CopyButton data={metadata.sha256.slice(2)}>
                                    SHA-256
                                </CopyButton>
                                <CopyButton
                                    data={metadata.image.split("ipfs://")[1]}
                                >
                                    IPFS-Hash
                                </CopyButton>
                            </div>
                            {isShowingMetadata && (
                                <Card className="mt-6 w-full">
                                    <CardHeader>
                                        <CardTitle>
                                            Metadata
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex items-center justify-center relative">
                                        <pre className="whitespace-pre-wrap break-all text-xs">
                                        <code>
                                            {JSON.stringify(metadata,null, 2)}
                                        </code>
                                        </pre>
                                    </CardContent>
                                </Card>
                            )}
                            <Card className="mt-6 w-full">
                                <CardHeader>
                                    <CardTitle>
                                        Gadgets ({metadata.traits.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center relative">
                                    <img
                                        src="/sketch.svg"
                                        className="w-full max-w-[300px] invert dark:invert-0"
                                    />
                                    <GadgetsContainer
                                        gadgets={metadata.traits}
                                        sha256={metadata.sha256}
                                    />
                                </CardContent>
                            </Card>
                            <Card className="mt-6 w-full">
                                <CardHeader>
                                    <CardTitle>View on</CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center space-x-1">
                                    <div className="flex flex-col justify-center">
                                        <div className="flex items-center">
                                            <img
                                                draggable={false}
                                                src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://cardanoscan.io&size=32"
                                                className="w-4 h-4"
                                            />
                                            <Button asChild variant="link">
                                                <a
                                                    href={`https://cardanoscan.io/token/${
                                                        asset.policyId +
                                                        asset.assetName
                                                    }`}
                                                    target="_blank"
                                                >
                                                    cardanoscan.io
                                                </a>
                                            </Button>
                                        </div>
                                        <div className="flex items-center">
                                            <img
                                                draggable={false}
                                                src="https://app.spacebudz.io/favicon-32x32.png"
                                                className="w-4 h-4"
                                            />
                                            <Button asChild variant="link">
                                                <a
                                                    href={`https://app.spacebudz.io/spacebud/${id}/`}
                                                    target="_blank"
                                                >
                                                    app.spacebudz.io
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="flex items-center">
                                            <img
                                                draggable={false}
                                                src="https://jpg.store/favicon.ico"
                                                className="w-4 h-4"
                                            />
                                            <Button asChild variant="link">
                                                <a
                                                    href={`https://www.jpg.store/asset/${
                                                        asset.policyId +
                                                        asset.assetName
                                                    }`}
                                                    target="_blank"
                                                >
                                                    jpg.store
                                                </a>
                                            </Button>
                                        </div>
                                        <div className="flex items-center">
                                            <img
                                                draggable={false}
                                                src="https://wayup.io/favicon.ico"
                                                className="w-4 h-4"
                                            />
                                            <Button asChild variant="link">
                                                <a
                                                    href={`https://www.wayup.io/collection/${asset.policyId}/asset/${asset.assetName}`}
                                                    target="_blank"
                                                >
                                                    wayup.io
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function CopyButton(
    { children, data }: React.PropsWithChildren & { data: string },
) {
    const [isCopied, setIsCopied] = React.useState<boolean>(false);
    const timeout = React.useRef<number>();

    React.useEffect(() => {
        if (isCopied) {
            timeout.current = setTimeout(() => setIsCopied(false), 1000);
        }
        return () => {
            clearTimeout(timeout.current);
        };
    }, [isCopied]);

    return (
        <Button
            size="sm"
            variant="outline"
            onClick={() =>
                navigator.clipboard.writeText(data).then(() =>
                    setIsCopied(true)
                )}
        >
            {isCopied
                ? <CheckIcon className="mr-1" />
                : <CopyIcon className="mr-1" />}
            {children}
        </Button>
    );
}

function GadgetsContainer(
    { gadgets, sha256 }: {
        gadgets: Metadata["traits"];
        sha256: Metadata["sha256"];
    },
) {
    function CurvedLine(
        { from, to, key }: {
            from: { x: number; y: number };
            to: { x: number; y: number };
            key: React.Key;
        },
    ) {
        const controlPointX = (from.x + to.x) / 2;
        const controlPointY = from.y > to.y ? from.y - 80 : from.y + 80;

        return (
            <svg
                key={key}
                className="absolute left-0 top-0 w-full h-full pointer-events-none stroke-primary opacity-50 stroke-1 fill-none"
            >
                <path
                    d={`M ${from.x + 20} ${from.y + 20} 
                 Q ${controlPointX} ${controlPointY}, 
                 ${to.x + 20} ${to.y + 20}`}
                    strokeDasharray="5, 5"
                />
            </svg>
        );
    }

    const { ref, dimension } = useObserveElementDimension<HTMLDivElement>();

    const positions = shuffleArrayWithSeed([
        { x: 0.3, y: 0.25 },
        { x: 0.82, y: 0.63 },
        { x: 0.6, y: -0.05 },
        { x: 0.16, y: 0.05 },
        { x: 0.09, y: 0.68 },
        { x: 0.68, y: 0.47 },
        { x: 0.18, y: 0.9 },
        { x: 0.8, y: 0.31 },
        { x: 0.67, y: 0.96 },
        { x: 0.12, y: 0.47 },
        { x: 0.6, y: 0.79 },
        { x: 0.78, y: 0.13 },
    ], sha256.slice(2));

    const badges = gadgets.map((gadget, index) => ({
        gadget,
        position: {
            x: positions[index].x * (dimension.width - 60),
            y: positions[index].y * (dimension.height - 40),
        },
    }));

    return (
        <div ref={ref} className="absolute w-full h-full">
            {badges.map(({ position }, index) => (
                <CurvedLine
                    key={index}
                    from={{
                        x: dimension.width / 2 - 20,
                        y: dimension.height / 2 - 12,
                    }}
                    to={position}
                />
            ))}
            {badges.map(({ gadget, position }, index) => (
                <Badge
                    key={index}
                    variant="outline"
                    className="absolute bg-background max-w-24 text-center"
                    style={{ left: position.x, top: position.y }}
                >
                    <a
                        href={`/collection?${
                            new URLSearchParams(`gadgets=${gadget}`).toString()
                        }`}
                    >
                        {gadget}
                    </a>
                </Badge>
            ))}
        </div>
    );
}
