"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons.ts";
import { format } from "npm:date-fns";

import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button/mod.tsx";
import { Calendar } from "@/islands/ui/calendar/mod.tsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/islands/ui/popover/mod.tsx";

export function DatePickerDemo() {
    const [date, setDate] = React.useState<Date>();
    const [open, setOpen] = React.useState<boolean>(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    size="lg"
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    defaultMonth={date}
                    mode={"single"}
                    selected={date}
                    onSelect={(e) => {
                        setDate(e);
                        setOpen(false);
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
