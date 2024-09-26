import { type PageProps } from "$fresh/server.ts";
import { Toaster } from "@/islands/ui/toast/toaster.tsx";
import { ThemeProvider } from "@/islands/providers/theme_provider.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              `document.documentElement.classList[localStorage.theme === "dark" || (localStorage.theme === "system" && globalThis.matchMedia("(prefers-color-scheme: dark)").matches) || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) ? 'add' : 'remove']("dark");
            `,
          }}
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>fresh-project</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <ThemeProvider>
          <>
            {/* @ts-ignore */}
            <Component />
            <Toaster />
          </>
        </ThemeProvider>
      </body>
    </html>
  );
}
