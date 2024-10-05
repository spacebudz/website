"use client";

// @deno-types="npm:@types/react@18.3.1"
import * as React from "react";
import { IS_BROWSER } from "$fresh/runtime.ts";

type Mode = "core" | "advanced";

type ModeProviderProps = {
    children: React.ReactNode;
    defaultMode?: Mode;
    storageKey?: string;
};

type ModeProviderState = {
    mode: Mode;
    setMode: (mode: Mode) => void;
};

const initialState: ModeProviderState = {
    mode: "core",
    setMode: () => null,
};

const ModeProviderContext = React.createContext<ModeProviderState>(
    initialState,
);

export function ModeProvider({
    children,
    defaultMode = "core",
    storageKey = "mode",
    ...props
}: ModeProviderProps) {
    const [mode, setMode] = React.useState<Mode>(
        () =>
            (IS_BROWSER && localStorage.getItem(storageKey) as Mode) ||
            defaultMode,
    );

    function applyMode(mode: Mode) {
        if (IS_BROWSER) localStorage.setItem(storageKey, mode);
        setMode(mode);
    }

    React.useEffect(() => {
        function onApplyMode(e: StorageEvent) {
            if ("key" in e && "newValue" in e && e.key === "mode") {
                return applyMode(e.newValue as Mode);
            }
        }
        globalThis.addEventListener("storage", onApplyMode);

        return () => {
            globalThis.removeEventListener("storage", onApplyMode);
        };
    }, []);

    const value = {
        mode,
        setMode: (mode: Mode) => applyMode(mode),
    };

    return (
        <ModeProviderContext.Provider {...props} value={value}>
            {children}
        </ModeProviderContext.Provider>
    );
}

export const useMode = () => {
    const context = React.useContext(ModeProviderContext);

    if (context === undefined) {
        throw new Error("useMode must be used within a ModeProvider");
    }

    return context;
};
