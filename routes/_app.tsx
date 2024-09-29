import { type PageProps } from "$fresh/server.ts";
import { Toaster } from "@/islands/ui/toast/toaster.tsx";
import { ThemeProvider } from "@/islands/providers/theme_provider.tsx";

export default function App({ Component, url }: PageProps) {
  const title = "SpaceBudz";
  const description =
    "A collection of cosmic explorers embarking on adventures through the limitless frontier of a decentralized universe.";
  const image = new URL("/logo.svg", url.origin).href;

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
        <title>{title}</title>
        <link rel="stylesheet" href="/styles.css" />
        <meta name="description" content={description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@spacebudznft" />
        <meta name="twitter:title" content="SpaceBudz" />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image"
          content={image}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url.href} />
        <meta property="og:title" content="SpaceBudz" />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content={image}
        />
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
