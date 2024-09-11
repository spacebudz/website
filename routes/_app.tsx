import { type PageProps } from "$fresh/server.ts";
import { Toaster } from "@/islands/ui/toast/toaster.tsx";
import { ThemeProvider } from "@/islands/providers/theme_provider.tsx";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
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
