import * as React from "react";

export function useObserveElementDimension<
    T extends HTMLElement | SVGSVGElement,
>() {
    const [dimension, setDimension] = React.useState({ width: 0, height: 0 });
    const ref = React.useRef<T>(null);

    React.useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            setDimension({
                width: entries[0].contentRect.width,
                height: entries[0].contentRect.height,
            });
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            ref.current && observer.unobserve(ref.current);
        };
    }, []);

    return {
        dimension,
        ref,
    };
}
