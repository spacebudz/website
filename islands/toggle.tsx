import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button/mod.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/islands/ui/dropdown_menu/mod.tsx";
import { useTheme } from "@/islands/providers/theme_provider.tsx";
import { Switch } from "@/islands/ui/switch/mod.tsx";
import { useMode } from "@/islands/providers/mode_provider.tsx";

export function ThemeToggle() {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function ModeToggle() {
    const { mode, setMode } = useMode();

    return (
        <div className="flex justify-end items-center">
            <div className="mr-2 text-sm opacity-80">
                {mode[0].toUpperCase() + mode.slice(1)}
            </div>
            <Switch
                checked={mode === "advanced"}
                onCheckedChange={(checked) =>
                    setMode(checked ? "advanced" : "core")}
            />
        </div>
    );
}
