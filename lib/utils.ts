import { type ClassValue, clsx } from "npm:clsx";
import { twMerge } from "npm:tailwind-merge";
import { fromText, toLabel } from "https://deno.land/x/lucid@0.10.10/mod.ts";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const isMobile = "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

export function idToBud(id: number): string {
    return toLabel(222) + fromText(`Bud${id}`);
}

export function ipfsToHttps(ipfs: string, width?: number): string {
    return `https://spacebudz.mypinata.cloud/ipfs/${
        ipfs.split("ipfs://")[1]
    }?pinataGatewayToken=sSzgtarDGSZukrz9lNYbbF30wPGLmIr_UWug05lQPddzrCK5tXa-G-QI7zMgG79m${
        width ? `&img-width=${width}` : ""
    }`;
}
