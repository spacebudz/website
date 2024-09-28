"use client";

// @deno-types="npm:@types/react@18.3.1"
import * as React from "react";
// import * as SliderPrimitive from "@radix-ui/react-slider";
import * as SliderPrimitivePreact from "@/islands/ui/slider/@radix_ui_slider_preact.tsx";

import { cn } from "@/lib/utils.ts";

// Unfortunately the thumb is not detected in @radix-ui/react-slider with Preact. A slide modification was necessary, hence the manual import.

// const Slider = React.forwardRef<
//     React.ElementRef<typeof SliderPrimitive.Root>,
//     React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
// >(({ className, ...props }, ref) => (
//     <SliderPrimitive.Root
//         ref={ref}
//         className={cn(
//             "relative flex w-full touch-none select-none items-center",
//             className,
//         )}
//         {...props}
//     >
//         <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
//             <SliderPrimitive.Range className="absolute h-full bg-primary" />
//         </SliderPrimitive.Track>
//         <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
//     </SliderPrimitive.Root>
// ));
// Slider.displayName = SliderPrimitive.Root.displayName;

// export { Slider };

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitivePreact.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitivePreact.Root>
>(({ className, ...props }, ref) => {
    const initialValue = Array.isArray(props.value)
        ? props.value
        : [props.min, props.max];
    return (
        <SliderPrimitivePreact.Root
            ref={ref}
            className={cn(
                "relative flex w-full touch-none select-none items-center",
                className,
            )}
            {...props}
        >
            <SliderPrimitivePreact.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
                <SliderPrimitivePreact.Range className="absolute h-full bg-primary" />
            </SliderPrimitivePreact.Track>
            {initialValue.map((_, index) => (
                <SliderPrimitivePreact.Thumb
                    key={index}
                    className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                />
            ))}
        </SliderPrimitivePreact.Root>
    );
});
Slider.displayName = SliderPrimitivePreact.Root.displayName;

export { Slider };
