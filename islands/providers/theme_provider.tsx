"use client";

// @deno-types="npm:@types/react@18.3.1"
import * as React from "react";
import { IS_BROWSER } from "$fresh/runtime.ts";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(
    initialState,
);

const isForcingDark = (globalThis as typeof globalThis & {
    isForcingDark?: boolean;
}).isForcingDark;

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = React.useState<Theme>(
        () =>
            (IS_BROWSER && localStorage.getItem(storageKey) as Theme) ||
            defaultTheme,
    );
    const themeRef = React.useRef<Theme>();

    function applyTheme(theme: Theme) {
        if (IS_BROWSER) localStorage.setItem(storageKey, theme);
        if (isForcingDark) return;
        const root = globalThis.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(
            theme === "system"
                ? globalThis.matchMedia("(prefers-color-scheme: dark)")
                        .matches
                    ? "dark"
                    : "light"
                : theme,
        );
        setTheme(theme);
    }

    React.useEffect(() => {
        themeRef.current = theme;
    }, [theme]);

    React.useEffect(() => {
        function onApplyTheme(e: StorageEvent | MediaQueryListEvent) {
            if ("key" in e && "newValue" in e && e.key === "theme") {
                return applyTheme(e.newValue as Theme);
            }
            if ("matches" in e && themeRef.current === "system") {
                return applyTheme("system");
            }
        }
        globalThis.addEventListener("storage", onApplyTheme);
        globalThis.matchMedia("(prefers-color-scheme: dark)")
            .addEventListener(
                "change",
                onApplyTheme,
            );

        return () => {
            globalThis.removeEventListener("storage", onApplyTheme);
            globalThis.matchMedia("(prefers-color-scheme: dark)")
                .removeEventListener("change", onApplyTheme);
        };
    }, []);

    const value = {
        theme: isForcingDark ? "dark" : theme,
        setTheme: (theme: Theme) => applyTheme(theme),
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = React.useContext(ThemeProviderContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};
