"use client";

// @deno-types="npm:@types/react@18.3.1"
import * as React from "react";
import { cn } from "@/lib/utils.ts";
import { useObserveElementDimension } from "@/islands/hooks/use_observe_dimension.tsx";

export interface PartialCircleProps
    extends React.HTMLAttributes<HTMLDivElement> {
    partial?: number;
    offsetDegree?: number;
    radius?: number;
}

const PartialCircle = React.forwardRef<HTMLDivElement, PartialCircleProps>(
    (
        { className, partial = 0.2, offsetDegree = 0, ...props },
        ref,
    ) => {
        const { ref: internalRef, dimension: { width } } =
            useObserveElementDimension<
                HTMLDivElement
            >();
        const center = Math.floor(width / 2);
        const radius = props.radius || center;
        const circumference = 2 * Math.PI * radius;
        const visiblePart = partial * circumference;
        const hiddenPart = (1 - partial) * circumference;
        const dashOffset = circumference *
            (1 - offsetDegree / 360);

        React.useImperativeHandle(ref, () => internalRef.current!);

        return (
            <div
                ref={internalRef}
                {...props}
                className={cn(
                    "stroke-primary stroke-1 fill-none",
                    className,
                )}
            >
                <svg
                    className="w-full h-full"
                    viewBox={`0 0 ${width} ${width}`}
                >
                    <circle
                        className="fill-none"
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeDasharray={`${visiblePart}, ${hiddenPart}`}
                        strokeDashoffset={dashOffset}
                    />
                </svg>
            </div>
        );
    },
);

PartialCircle.displayName = "PartialCircle";
export { PartialCircle };

export interface DashedCircleProps
    extends React.HTMLAttributes<HTMLDivElement> {
    dashes?: number;
    dashLength?: number;
    radius?: number;
}

const DashedCircle = React.forwardRef<HTMLDivElement, DashedCircleProps>(
    (
        { className, dashes = 100, dashLength = 10, ...props },
        ref,
    ) => {
        const { ref: internalRef, dimension: { width } } =
            useObserveElementDimension<
                HTMLDivElement
            >();
        const center = Math.floor(width / 2);
        const radius = props.radius || center;

        React.useImperativeHandle(ref, () => internalRef.current!);

        function renderDashes() {
            const angleStep = (2 * Math.PI) / dashes;
            const dashLengthInternal = Number.isInteger(dashLength)
                ? dashLength
                : dashLength * radius;

            return Array.from({ length: dashes }).map((_, i) => {
                const angle = i * angleStep;
                const x1 = center + radius * Math.cos(angle);
                const y1 = center + radius * Math.sin(angle);
                const x2 = center +
                    (radius - dashLengthInternal) * Math.cos(angle);
                const y2 = center +
                    (radius - dashLengthInternal) * Math.sin(angle);

                return (
                    <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                    />
                );
            });
        }

        return (
            <div
                ref={internalRef}
                className={cn(
                    "stroke-primary stroke-1 fill-none",
                    className,
                )}
                {...props}
            >
                <svg
                    className="w-full h-full"
                    viewBox={`0 0 ${width} ${width}`}
                >
                    {renderDashes()}
                </svg>
            </div>
        );
    },
);

DashedCircle.displayName = "DashedCircle";

export { DashedCircle };
