import { type ClassValue, clsx } from "npm:clsx";
import { twMerge } from "npm:tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const isMobile = "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;
