import { type PageProps } from "$fresh/server.ts";
import { Toaster } from "@/islands/ui/toast/toaster.tsx";
import { ThemeProvider } from "@/islands/providers/theme_provider.tsx";
import { ModeProvider } from "@/islands/providers/mode_provider.tsx";

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
        <title>SpaceBudz</title>
        <link rel="stylesheet" href="/styles.css" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      </head>
      <body>
        <ThemeProvider>
          <ModeProvider>
            <>
              {/* @ts-ignore */}
              <Component />
              <Toaster />
            </>
          </ModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
