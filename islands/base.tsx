import * as React from "react";
import { cn, isMobile } from "@/lib/utils.ts";
import { useIsIntersecting } from "@/islands/hooks/use_is_intersecting.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

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
    const [isLoadingImage, setIsLoadingImage] = React.useState(true);
    const src = "/spacebudz.svg";

    React.useEffect(() => {
        const image = new Image();
        image.src = src;
        image.onload = () => {
            setIsLoadingImage(false);
        };
        setTimeout(() => isAllowingMovement.current = true, 800);
    }, []);

    return (
        <div
            className="w-full h-screen flex justify-center items-center relative"
            onClick={() => location.assign("/collection")}
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
                        src={src}
                        className={cn(
                            "animate-in delay-700 duration-1000 fade-in fill-mode-both w-full h-full",
                            isLoadingImage && "hidden",
                        )}
                    />
                </div>
                <div
                    className={cn(
                        "landscape:hidden lg:landscape:block -bottom-12 md:-bottom-4 animate-in delay-1000 duration-500 fade-in fill-mode-both select-none absolute w-full text-center font-mono",
                        isLoadingImage && "hidden",
                    )}
                >
                    Press to enter / <br /> scroll to discover
                </div>
            </div>
        </div>
    );
}

function Section2() {
    const ref = React.useRef<HTMLDivElement>(null);
    const isIntersecting = useIsIntersecting(ref, {
        rootMargin: "-150px 0px 0px 0px",
    });
    const intersectionCounter = React.useRef({
        isIntersecting: 0,
        isNotIntersecting: 0,
        hasIgnoredStartup: false,
    });
    const [animation, setAnimation] = React.useState(false);

    React.useEffect(() => {
        if (isIntersecting === true) {
            intersectionCounter.current.isIntersecting++;
        }
        if (isIntersecting === false) {
            if (
                intersectionCounter.current.hasIgnoredStartup ||
                intersectionCounter.current.isIntersecting
            ) {
                intersectionCounter.current.isNotIntersecting++;
            } else intersectionCounter.current.hasIgnoredStartup = true;
        }

        let timeout;
        if (intersectionCounter.current.isIntersecting === 1) {
            timeout = setTimeout(() => {
                setAnimation(true);
            }, 3000);
        }
        if (
            intersectionCounter.current.isNotIntersecting > 0
        ) {
            clearTimeout(timeout);
            setAnimation(true);
        }
    }, [isIntersecting]);

    return (
        <div className="w-full h-[1500px] md:h-[1200px] flex flex-col items-center relative mt-32 md:mt-72">
            <div
                className={cn(
                    "absolute w-4/5 h-7 bg-primary",
                    animation &&
                        "translate-x-0 translate-y-32 h-[1px] w-[300px] transition-all duration-700",
                )}
            />
            <div
                ref={ref}
                className={cn(
                    "absolute text-secondary font-mono font-bold text-lg",
                    animation && "text-primary",
                )}
            >
                As a line of code {animation && "..."}
            </div>
            <div
                className={cn(
                    "absolute w-4 h-7 bg-background",
                    animation &&
                        "translate-x-0 translate-y-[428px] h-[1px] w-[300px] bg-primary transition-all duration-700",
                    !animation && "animate-cursor-blink -mr-[110px] right-2/4",
                )}
            />
            <div
                className={cn(
                    "absolute",
                    animation &&
                        "-translate-x-[150px] translate-y-32 w-[1px] h-[301px] bg-primary transition-all duration-500 delay-200",
                )}
            />
            <div
                className={cn(
                    "absolute",
                    animation &&
                        "translate-x-[150px] translate-y-32 w-[1px] h-[301px] bg-primary transition-all duration-500 delay-200",
                )}
            />
            <div
                className={cn(
                    "absolute opacity-0 top-[278px] origin-center w-[300px] h-[0.5px] bg-primary",
                    animation &&
                        "opacity-30 transition-all delay-300 duration-700 rotate-90",
                )}
            />
            <div
                className={cn(
                    "absolute opacity-0 top-[278px] origin-center w-[300px] h-[0.5px] bg-primary",
                    animation &&
                        "opacity-30 transition-all delay-300 duration-700 rotate-180",
                )}
            />
            <div
                className={cn(
                    "absolute opacity-0 top-[278px] origin-center w-[300px] h-[0.5px] bg-primary",
                    animation &&
                        "opacity-20 transition-all delay-300 rotate-45 duration-700",
                )}
            />
            <div
                className={cn(
                    "absolute opacity-0 top-[278px] origin-center w-[300px] h-[0.5px] bg-primary",
                    animation &&
                        "opacity-20 transition-all delay-300 -rotate-45 duration-700",
                )}
            />

            <div
                className={cn(
                    "absolute opacity-0 scale-90 w-[250px] h-[250px] top-[153px]",
                    animation &&
                        "opacity-100 scale-100 transition-all duration-500 delay-500",
                )}
            >
                <img
                    draggable={false}
                    src="/preview.svg"
                    className="w-full h-full"
                />
            </div>
            <div
                className={cn(
                    "absolute opacity-0 top-[267px] -translate-x-[140px] font-mont text-sm font-bold",
                    animation &&
                        "opacity-90 transition-opacity duration-500 delay-700",
                )}
            >
                x
            </div>
            <div
                className={cn(
                    "absolute top-[408px] opacity-0 font-mono text-sm font-bold",
                    animation &&
                        "opacity-90 transition-opacity duration-200 delay-700",
                )}
            >
                x
            </div>
            <div
                className={cn(
                    "absolute top-[436px] translate-x-[120px] opacity-0 font-mono text-xs",
                    animation &&
                        "opacity-80 transition-opacity duration-200 delay-700",
                )}
            >
                x=1000
            </div>

            <div
                className={cn(
                    "absolute top-[528px] max-w-screen-sm px-10 leading-7 md:leading-8 opacity-0 transition-opacity delay-1000 duration-500",
                    animation && "opacity-100",
                )}
            >
                ... unraveled, an unseen force stirred beneath the surface of
                reality. In unexpected places, certain individuals were
                unknowingly drawn to a greater purpose. These were the SpaceBudz
                — digital explorers from a realm beyond the stars. At first
                glance, they were simple avatars, little astronauts suspended in
                a vast decentralized universe. Yet, in every SpaceBud there is a
                symbol of something deeper — a reflection of human curiosity,
                innovation, and the courage to step into the unknown. They were
                not just characters and collectibles in a virtual world, but
                representations of a new era, where technology and imagination
                intertwined to push the boundaries of what was possible.
                <br />
                And so, the story began, teaching a simple yet profound truth:
                we too often wander through life, unaware of the vast potential
                lying dormant within us. It is only when we are called to
                adventure, to step beyond the familiar, that we discover our
                true purpose. The journey may be uncertain, but it teaches us
                that the unknown is not something to fear—it is an invitation to
                grow, to learn, and to evolve. Every choice, every step forward,
                brings us closer to becoming who we are meant to be.
            </div>
        </div>
    );
}

export function Base() {
    return (
        <div className="flex w-full flex-col">
            <Section1 />
            <Section2 />
        </div>
    );
}

const ascii = `
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#-. ............ .=#%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%*-. .:==*%@@@@@@@@@@%*==:...=*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%=...=#@@@@@@@@@@@@@@@@@@@@@@@@#=..:+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*. .*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+. .#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@#..:%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#:.:#@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@#:.-%@@@@@@@@@@%*+=:..........-=+*@@@@@@@@@@@%-.:#@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@+..%@@@@@@@@@+:...                ...:*@@@@@@@@@#..*@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@..+@@@@@@@@#:.  .:-*#+:.                .:%@@@@@@@@-.-@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@#:.+@@@@@@@*:. .-%@@@@@@@%:                  :#@@@@@@@+.:%@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@#:.#@@@@@@@:.  =%@@@@@@@@@@*.                  .-@@@@@@@*.:%@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@:.#@@@@@@#.  .%@@@@@@@@@@@@*.                    .%@@@@@@*.-@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@%+:... .+@@@@@@#.  :#@@@@@@@@@%#*:.                     .:#@@@@@@=.....:*@@@@@@@@@@@@@@
@@@@@@@@@@@@=.. .+*.-%@@@@@%:  .+@@@@@@@%-.                           .-%@@@@@%:.#=. ..+@@@@@@@@@@@@
@@@@@@@@@@@:.=: =@-.+@@@@@@-.  :#@@@@@@#..                             .*@@@@@@=.-@-.-=.-@@@@@@@@@@@
@@@@@@@@@@-.=*..@#..@@@@@@@.   .=@@@@@@:                                .@@@@@@%.:%%.:#- =@@@@@@@@@@
@@@@@@@@@%:.%= =@+.:@@@@@@=     .:+#%#:                                 .#@@@@@@:.*@:.+* :@@@@@@@@@@
@@@@@@@@@%:.#= +@+ =@@@@@@:     ...                                      -@@@@@@:.+@-.=* :@@@@@@@@@@
@@@@@@@@@@=.-+.-@+ =@@@@@@:   .#@@@%.                                    -@@@@@@:.+@:.+- +@@@@@@@@@@
@@@@@@@@@@@-.:..%+.:@@@@@@:   .@@@@@=.                                   =@@@@@@:.**..:.=@@@@@@@@@@@
@@@@@@@@@@@@*.  :*:.@@@@@@*    =%@%=.                                   .%@@@@@#.:*:..:*@@@@@@@@@@@@
@@@@@@@@@@@@@@#:....+@@@@@@.    ...                                     :@@@@@@=....-%@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@%.:%@@@@@#.                                          .%@@@@@#..@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@*.-%@@@@@+.                                        .*@@@@@%:.#@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@+.:@@@@@@*.                                      .#@@@@@%..*@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@+..#@@@@@@:.                                 ..-@@@@@@+..*@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@%:.-%@@@@@#-.                              .=%@@@@@%-.-@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@#:.-#@@@@@@#-.                        .=#@@@@@@*:.:#@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@%...-@@@@@@@@%+:..            ..:+%@@@@@@@%:..:@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+:. :*#@@@@@@@@@@@@@@@@@@@@@@@@@@@@#*...-*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#+-. .:=+*#@@@@@@@@@@@@@@#+==:. .-*%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#+:. ................:+#%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
`.replaceAll("@", "#");

if (IS_BROWSER) console.log("%c" + ascii, "color: #030712");
