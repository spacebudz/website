// @deno-types="npm:@types/react@18.3.1"
import * as React from "react";
import { Badge } from "@/components/ui/badge/mod.tsx";

function GadgetsContainer({ gadgets }: { gadgets: string[] }) {
    function CurvedLine(
        { from, to, key }: {
            from: { x: number; y: number };
            to: { x: number; y: number };
            key: React.Key;
        },
    ) {
        const midX = (from.x + to.x) / 2;

        // Adjust control point to create a more pronounced curve toward the center
        const controlPointX = midX;
        const controlPointY = from.y > to.y ? from.y - 80 : from.y + 80; // Increase vertical offset for more curvature

        return (
            <svg
                key={key}
                className="absolute left-0 top-0 w-full h-full pointer-events-none stroke-primary stroke-1 fill-none"
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

    const ref = React.useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = React.useState<
        { width: number; height: number }
    >({ width: 0, height: 0 });

    const badgesCount = 5;
    const badges = Array.from({ length: badgesCount }, () => ({
        x: Math.random() * (containerSize.width - 50),
        y: Math.random() * (containerSize.height - 50),
    }));
    const center = {
        x: containerSize.width / 2 - 20,
        y: containerSize.height / 2 - 20,
    };

    React.useEffect(() => {
        if (ref.current) {
            setContainerSize({
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight,
            });
        }
    }, [ref]);

    return (
        <div ref={ref} className="absolute w-full h-full overflow-hidden">
            {badges.map((position, index) => (
                <CurvedLine key={index} from={center} to={position} />
            ))}
            {badges.map((position, index) => (
                <Badge
                    key={index}
                    variant="outline"
                    className="absolute bg-background"
                    style={{ left: position.x, top: position.y }}
                >
                    <a href="#">Watch</a>
                </Badge>
            ))}
        </div>
    );
}

export default GadgetsContainer;
