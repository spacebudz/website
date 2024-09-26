import { Landing } from "@/islands/landing.tsx";
import { Head } from "$fresh/runtime.ts";

export default function LandingPage() {
    return (
        <>
            <Head>
                <script
                    dangerouslySetInnerHTML={{
                        __html:
                            `window.isForcingDark=true;document.documentElement.classList.remove("light");document.documentElement.classList.add("dark");`,
                    }}
                />
            </Head>
            <Landing />
        </>
    );
}
