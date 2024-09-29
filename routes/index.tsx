import { Base } from "@/islands/base.tsx";
import { Head } from "$fresh/runtime.ts";

export default function BasePage() {
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
            <Base />
        </>
    );
}
