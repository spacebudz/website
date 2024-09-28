import * as React from "react";
import { isMobile } from "@/lib/utils.ts";

const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generateRandomString(length: number): string {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length),
        );
    }
    return result;
}

function Section1() {
    const [randomString, setRandomString] = React.useState<string>("");
    const [mousePosition, setMoustPosition] = React.useState<
        { x: number; y: number }
    >();
    const isAllowingMovement = React.useRef<boolean>(false);

    React.useEffect(() => {
        setTimeout(() => isAllowingMovement.current = true, 800);
    }, []);

    return (
        <div
            className="w-full h-screen flex justify-center items-center"
            onClick={() => location.assign("/budz/collection")}
        >
            <div
                className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px]"
                onMouseMove={(e) => {
                    if (isMobile || !isAllowingMovement.current) return;
                    const { left, top } = e.currentTarget
                        .getBoundingClientRect();
                    setMoustPosition({
                        x: e.clientX - left,
                        y: e.clientY - top,
                    });
                    setRandomString(generateRandomString(5000));
                }}
                onMouseLeave={() => setRandomString("")}
            >
                <div className="absolute w-full h-full break-words whitespace-pre-wrap overflow-hidden leading-none text-xs">
                    <code>{randomString}</code>
                </div>
                <div
                    className="absolute w-full h-full"
                    style={{
                        background:
                            `radial-gradient(circle at center, rgba(0,0,0,0) 0%, #030712 60%)`,
                    }}
                />
                <div
                    className="absolute w-full h-full"
                    style={{
                        background:
                            `radial-gradient(circle at ${mousePosition?.x}px ${mousePosition?.y}px, rgba(0,0,0,0) 0%, #030712 40%)`,
                    }}
                />

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[300px] md:h-[300px]">
                    <img
                        draggable={false}
                        src="/spacebudz.svg"
                        className="animate-out delay-700 duration-1000 opacity-0 fade-out-100 fill-mode-forwards w-full h-full"
                    />
                </div>
                <div className="-bottom-10 md:-bottom-2 animate-out delay-1000 duration-500 opacity-0 fade-out-100 fill-mode-forwards select-none absolute w-full text-center">
                    Press to enter
                </div>
            </div>
        </div>
    );
}

function Section2() {
    const [scrollPercent, setScrollPercent] = React.useState(0);
    const pathLength = 800; // Total length of the SVG path
    const scrollSpeedModifier = 0.25; // Slow down the reveal by a factor of 2 (feel free to adjust)

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollTop = globalThis.scrollY;
            const docHeight = document.documentElement.scrollHeight -
                globalThis.innerHeight;
            const scrollFraction = scrollTop / docHeight;

            // Multiply the scrollFraction by the scrollSpeedModifier to slow down the path reveal
            const adjustedScrollFraction = scrollFraction * scrollSpeedModifier;

            // Ensure the scrollPercent doesn't exceed 1 (fully visible path)
            setScrollPercent(Math.min(adjustedScrollFraction, 1));
        };

        globalThis.addEventListener("scroll", handleScroll);
        return () => {
            globalThis.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="relative h-[200vh]">
            <div className="absolute inset-0 flex items-center justify-center">
            </div>

            {/* SVG Path */}
            <svg
                className="absolute top-0 left-0 w-full h-full"
                viewBox="0 0 100 200"
                preserveAspectRatio="none"
            >
                <path
                    className="stroke-primary stroke-[0.05] fill-none"
                    d="M10 10 C 20 20, 40 0, 50 50 S 90 80, 80 150"
                    style={{
                        strokeDasharray: pathLength,
                        strokeDashoffset: pathLength -
                            scrollPercent * pathLength,
                        transition: "stroke-dashoffset 0.1s ease-out",
                    }}
                />
            </svg>
        </div>
    );
}

export function Landing() {
    return (
        <div className="flex w-full flex-col">
            <Section1 />
            <Section2 />
        </div>
    );
}
