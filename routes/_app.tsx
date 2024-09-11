import { type PageProps } from "$fresh/server.ts";
import { Toaster } from "@/islands/ui/toast/toaster.tsx";
import { Toaster as SonnerToaster } from "@/islands/ui/sonner/mod.tsx";
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
        {/* @ts-ignore */}
        <Component />
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
