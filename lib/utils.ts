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

export function shuffleArrayWithSeed<T>(array: T[], seed: string): T[] {
    function cyrb128(str: string): number[] {
        let h1 = 1779033703,
            h2 = 3144134277,
            h3 = 1013904242,
            h4 = 2773480762;
        for (let i = 0, k; i < str.length; i++) {
            k = str.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
        return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
    }

    function sfc32(...[a, b, c, d]: number[]) {
        return function () {
            a |= 0;
            b |= 0;
            c |= 0;
            d |= 0;
            const t = (a + b | 0) + d | 0;
            d = d + 1 | 0;
            a = b ^ b >>> 9;
            b = c + (c << 3) | 0;
            c = c << 21 | c >>> 11;
            c = c + t | 0;
            return (t >>> 0) / 4294967296;
        };
    }

    const random = sfc32(...cyrb128(seed));

    const shuffledArray = array.slice();

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [
            shuffledArray[j],
            shuffledArray[i],
        ];
    }

    return shuffledArray;
}
