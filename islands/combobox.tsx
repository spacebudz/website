"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon, MinusIcon } from "@radix-ui/react-icons";

import { cn, isMobile } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button/mod.tsx";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/islands/ui/command/mod.tsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/islands/ui/popover/mod.tsx";
import { Label } from "@/islands/ui/label/mod.tsx";
import { Switch } from "@/islands/ui/switch/mod.tsx";
import { Slider } from "@/islands/ui/slider/mod.tsx";

export function Combobox(
    {
        category,
        data,
        value,
        onChange,
        isGadgetsUnion,
        setIsGadgetsUnion,
        gadgetsRange,
        setGadgetsRange,
    }: {
        category: "species" | "gadgets";
        data: string[];
        value: string[];
        onChange: (value: string[]) => void;
        isGadgetsUnion?: boolean;
        setIsGadgetsUnion?: (value: React.SetStateAction<boolean>) => void;
        gadgetsRange?: number[];
        setGadgetsRange?: (
            value: React.SetStateAction<number[]>,
        ) => void;
    },
) {
    const [open, setOpen] = React.useState(false);
    const focusRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        let distance = 0;
        let timeout: number;
        function onScroll(_e: Event) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                distance = 0;
            }, 200);
            distance++;
            if (distance > 4) {
                setOpen(false);
            }
        }
        globalThis.addEventListener("scroll", onScroll);
        return () => {
            globalThis.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    style={{ touchAction: "manipulation" }}
                >
                    {category === "species" && value.length <= 0 &&
                        "None applied"}
                    {category === "species" && value.length > 0 &&
                        `${value.length} applied`}
                    {category === "gadgets" &&
                        gadgetsRange?.toString() === [0, 12].toString() &&
                        value.length <= 0 &&
                        "None applied"}
                    {category === "gadgets" && value.length > 0 &&
                        `${value.length} (${isGadgetsUnion ? "∪" : "∩"})${
                            gadgetsRange?.toString() !== [0, 12].toString()
                                ? ""
                                : " applied"
                        }`}
                    {category === "gadgets" && gadgetsRange &&
                        gadgetsRange?.toString() !== [0, 12].toString() &&
                        `${value.length > 0 ? "; " : ""}[ ${gadgetsRange[0]}, ${
                            gadgetsRange[1]
                        } ]`}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0"
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                    if (focusRef.current && !isMobile) {
                        focusRef.current.focus();
                    }
                }}
            >
                {category === "gadgets" &&
                    (
                        <>
                            <div className="w-full px-4 mt-4 -mb-2">
                                <Slider
                                    className="w-full h-6"
                                    defaultValue={gadgetsRange}
                                    max={12}
                                    min={0}
                                    step={1}
                                    onValueChange={setGadgetsRange}
                                />
                            </div>
                            <div className="flex justify-center items-center space-x-2 mt-4">
                                <Label className="text-lg">∩</Label>
                                <Switch
                                    checked={isGadgetsUnion}
                                    onCheckedChange={setIsGadgetsUnion}
                                    className="data-[state=checked]:bg-input"
                                    style={{ touchAction: "manipulation" }}
                                />
                                <Label className="text-lg">∪</Label>
                            </div>
                        </>
                    )}
                <Command>
                    <CommandInput
                        ref={focusRef}
                        placeholder={`Search ${category}...`}
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>No {category} found.</CommandEmpty>
                        <CommandGroup>
                            {data.map((d, index) => (
                                <CommandItem
                                    style={{ touchAction: "manipulation" }}
                                    key={index}
                                    value={d}
                                    onSelect={(currentValue) => {
                                        if (
                                            value.includes(currentValue) &&
                                            category === "gadgets"
                                        ) {
                                            onChange(value.map((v) =>
                                                v === currentValue
                                                    ? "!" + currentValue
                                                    : v
                                            ));
                                        } else if (
                                            value.includes(
                                                "!" + currentValue,
                                            ) || value.includes(currentValue)
                                        ) {
                                            onChange(
                                                value.filter((v) =>
                                                    v !== "!" + currentValue &&
                                                    v !== currentValue
                                                ),
                                            );
                                        } else {onChange([
                                                ...value,
                                                currentValue,
                                            ]);}
                                    }}
                                >
                                    {d}
                                    <div
                                        className={cn(
                                            "ml-auto h-4 w-4 flex items-center justify-center rounded",
                                            value.includes(d) &&
                                                "bg-primary text-secondary",
                                            value.includes("!" + d) &&
                                                "bg-destructive text-secondary",
                                        )}
                                    >
                                        {value.includes(d) && (
                                            <CheckIcon
                                                className={cn(
                                                    "h-3 w-3",
                                                )}
                                            />
                                        )}
                                        {value.includes("!" + d) && (
                                            <MinusIcon
                                                className={cn(
                                                    "h-3 w-3",
                                                )}
                                            />
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
