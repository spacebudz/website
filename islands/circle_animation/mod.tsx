"use client";

// @deno-types="npm:@types/react@18.3.1"
import * as React from "react";
import { cn } from "@/lib/utils.ts";
import { useObserveElementDimension } from "@/islands/hooks/use_observe_dimension.tsx";

export interface PartialCircleProps extends React.SVGProps<SVGSVGElement> {
    partial?: number;
    offsetDegree?: number;
}

const PartialCircle = React.forwardRef<SVGSVGElement, PartialCircleProps>(
    (
        { className, partial = 0.2, offsetDegree = 0, ...props },
        ref,
    ) => {
        const { ref: internalRef, dimension: { width } } =
            useObserveElementDimension<
                SVGSVGElement
            >();
        const center = Math.floor(width / 2);
        const radius = parseInt(props.radius as string) || center;
        const circumference = 2 * Math.PI * radius;
        const visiblePart = partial * circumference;
        const hiddenPart = (1 - partial) * circumference;
        const dashOffset = circumference *
            (1 - offsetDegree / 360);

        React.useImperativeHandle(ref, () => internalRef.current!);

        return (
            <svg
                ref={internalRef}
                className={cn(
                    "stroke-primary stroke-1 fill-none",
                    className,
                )}
                viewBox={`0 0 ${width} ${width}`}
                {...props}
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
        );
    },
);

PartialCircle.displayName = "PartialCircle";
export { PartialCircle };

export interface DashedCircleProps extends React.SVGProps<SVGSVGElement> {
    dashes?: number;
    dashLength?: number;
}

const DashedCircle = React.forwardRef<SVGSVGElement, DashedCircleProps>(
    (
        { className, dashes = 100, dashLength = 10, ...props },
        ref,
    ) => {
        const { ref: internalRef, dimension: { width } } =
            useObserveElementDimension<
                SVGSVGElement
            >();
        const center = Math.floor(width / 2);
        const radius = parseInt(props.radius as string) || center;

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
            <svg
                ref={internalRef}
                className={cn(
                    "stroke-primary stroke-1 fill-none",
                    className,
                )}
                viewBox={`0 0 ${width} ${width}`}
                {...props}
            >
                {renderDashes()}
            </svg>
        );
    },
);

DashedCircle.displayName = "DashedCircle";

export { DashedCircle };
