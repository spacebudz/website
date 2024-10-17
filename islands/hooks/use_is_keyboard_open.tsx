import * as React from "react";

export function useIsKeyboardOpen(
    minKeyboardHeight = 300,
    defaultValue?: boolean,
) {
    const [isKeyboardOpen, setIsKeyboardOpen] = React.useState(defaultValue);

    React.useEffect(() => {
        function listener() {
            const newState = globalThis.screen.height - minKeyboardHeight >
                globalThis.visualViewport!.height;
            if (isKeyboardOpen != newState) {
                setIsKeyboardOpen(newState);
            }
        }
        if (globalThis.visualViewport) {
            globalThis.visualViewport.addEventListener("resize", listener);
        }
        return () => {
            if (globalThis.visualViewport) {
                globalThis.visualViewport.removeEventListener(
                    "resize",
                    listener,
                );
            }
        };
    }, []);

    return isKeyboardOpen;
}
