import { useEffect, useState } from "react";
import * as React from "react";
import { PartialCircle } from "@/islands/circle_animation/mod.tsx";

// export const Landing = () => {
//     const [scrollPercent, setScrollPercent] = useState(0);
//     const pathLength = 800; // Total length of the SVG path
//     const scrollSpeedModifier = 0.25; // Slow down the reveal by a factor of 2 (feel free to adjust)

//     useEffect(() => {
//         const handleScroll = () => {
//             const scrollTop = window.scrollY;
//             const docHeight = document.documentElement.scrollHeight -
//                 window.innerHeight;
//             const scrollFraction = scrollTop / docHeight;

//             // Multiply the scrollFraction by the scrollSpeedModifier to slow down the path reveal
//             const adjustedScrollFraction = scrollFraction * scrollSpeedModifier;

//             // Ensure the scrollPercent doesn't exceed 1 (fully visible path)
//             setScrollPercent(Math.min(adjustedScrollFraction, 1));
//         };

//         window.addEventListener("scroll", handleScroll);
//         return () => {
//             window.removeEventListener("scroll", handleScroll);
//         };
//     }, []);

//     return (
//         <div className="relative h-[200vh] bg-black">
//             <div className="absolute inset-0 flex items-center justify-center text-white">
//                 <h1 className="text-4xl">Scroll to Follow the Path</h1>
//             </div>

//             {/* SVG Path */}
//             <svg
//                 className="absolute top-0 left-0 w-full h-full"
//                 viewBox="0 0 100 200"
//                 preserveAspectRatio="none"
//             >
//                 <path
//                     className="stroke-primary-foreground"
//                     d="M10 10 C 20 20, 40 0, 50 50 S 90 80, 80 150"
//                     strokeWidth="0.5"
//                     fill="none"
//                     style={{
//                         strokeDasharray: pathLength,
//                         strokeDashoffset: pathLength -
//                             scrollPercent * pathLength,
//                         transition: "stroke-dashoffset 0.1s ease-out",
//                     }}
//                 />
//             </svg>
//         </div>
//     );
// };

export function Landing() {
    return (
        <div
            className="flex w-full h-screen items-center justify-center bg-gray-950 text-secondary dark:text-primary"
            onClick={() => location.assign("/budz/collection")}
        >
            <div className="flex flex-col items-center justify-center">
                <img
                    draggable={false}
                    src="/spacebudz.svg"
                    className="animate-out delay-700 duration-1000 opacity-0 fade-out-100 fill-mode-forwards w-[300px]"
                />
                <div className="mt-6 animate-out delay-1000 duration-500 opacity-0 fade-out-100 fill-mode-forwards">
                    Press to enter
                </div>
            </div>
        </div>
    );
}
