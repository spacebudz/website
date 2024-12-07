import { Base } from "@/islands/base.tsx";
import { Head } from "$fresh/runtime.ts";

export default function BasePage() {
    return (
        <>
            <Head>
                <script
                    dangerouslySetInnerHTML={{
                        __html:
                            `document.documentElement.setAttribute("data-force-dark","true");document.documentElement.classList.remove("light");document.documentElement.classList.add("dark");`,
                    }}
                />
            </Head>
            <Base />
        </>
    );
}
