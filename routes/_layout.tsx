import { PageProps } from "$fresh/server.ts";
import { ModeToggle, ThemeToggle } from "@/islands/toggle.tsx";
import { Button } from "@/components/ui/button/mod.tsx";
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Head } from "$fresh/runtime.ts";

export default function Layout({ Component, url }: PageProps) {
  const image = new URL("/logo.png", url.origin).href;
  const description =
    "A collection of cosmic explorers embarking on adventures through the limitless frontier of a decentralized universe.";
  return (
    <>
      <Head>
        <meta name="description" content={description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@spacebudznft" />
        <meta name="twitter:title" content="SpaceBudz" />
        <meta
          name="twitter:description"
          content={description}
          key="twitter:description"
        />
        <meta
          name="twitter:image"
          content={image}
          key="twitter:image"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url.href} />
        <meta property="og:title" content="SpaceBudz" />
        <meta
          property="og:description"
          content={description}
          key="og:description"
        />
        <meta
          property="og:image"
          content={image}
          key="og:image"
        />
      </Head>
      <div>
        <div className="w-full h-full flex justify-center">
          <div className="w-full max-w-screen-2xl h-full flex flex-col">
            <div className="w-full min-h-screen">
              {/* @ts-ignore */}
              <Component />
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <div className="w-full text-center mt-72 p-8 md:p-20 relative flex items-center justify-center flex-col">
      <div className="w-full flex flex-col-reverse lg:flex-row gap-14">
        <div className="flex flex-col text-left w-full">
          <div className="max-w-md text-xl font-mono">
            In the vastness of space, true freedom is found not in the stars,
            but in the code that binds them.
          </div>
          <div className="text-sm md:text font-light break-all mt-4">
            <a
              href="https://github.com/spacebudz/wormhole"
              className="hover:underline"
            >
              4523c5e21d409b81c95b45b0aea275b8ea1406e6cafea5583b9f8a5f
            </a>
          </div>
        </div>
        <div className="w-full flex justify-center space-x-20">
          <div className="flex flex-col items-start space-y-3">
            <a
              href="/"
              className="hover:underline underline-offset-4"
            >
              Base
            </a>
            <a
              href="/collection"
              className="hover:underline underline-offset-4"
            >
              Collection
            </a>
            <a
              href="/about"
              className="hover:underline underline-offset-4"
            >
              About
            </a>
          </div>
          <div className="flex flex-col items-start space-y-3">
            <a
              href="https://spacebudz.gitbook.io/spacebudz"
              target="_blank"
              className="hover:underline underline-offset-4"
            >
              Guide
            </a>
            <a
              href="/license.pdf"
              target="_blank"
              className="hover:underline underline-offset-4"
            >
              License
            </a>
            <a
              href="https://github.com/spacebudz/nebula"
              target="_blank"
              className="hover:underline underline-offset-4"
            >
              Nebula
            </a>
          </div>
        </div>
        <div className="flex items-end space-x-4">
          <Button asChild size="icon" variant="outline">
            <a
              href="https://github.com/spacebudz"
              target="_blank"
            >
              <GitHubLogoIcon />
            </a>
          </Button>
          <Button asChild size="icon" variant="outline">
            <a
              href="https://discord.com/invite/vtmm6RG2Bv"
              target="_blank"
            >
              <DiscordLogoIcon />
            </a>
          </Button>
          <Button
            asChild
            size="icon"
            variant="outline"
          >
            <a
              href="https://x.com/spacebudzNFT"
              target="_blank"
            >
              <img
                draggable={false}
                src="/x.svg"
                className="invert dark:invert-0 w-3"
              />
            </a>
          </Button>
          <Button
            asChild
            size="icon"
            variant="outline"
          >
            <a
              href="https://t.me/spacebudz"
              target="_blank"
            >
              <img
                draggable={false}
                src="/telegram.svg"
                className="invert dark:invert-0 w-3"
              />
            </a>
          </Button>
        </div>
      </div>
      <div className="w-full mt-24 ml-8">
        <img
          draggable={false}
          src="/spacebudz.svg"
          className="w-16 h-16 invert dark:invert-0 pointer-events-none"
        />
      </div>
      <div className="flex w-full -mt-7 items-end justify-between">
        <div className="text-left flex flex-col">
          <div className="w-full text-left mb-2">
            <a href="/terms.pdf" className="hover:underline underline-offset-4">
              Terms and conditions
            </a>
          </div>
          <div className="opacity-70 text-xs md:text-sm font-light">
            © SpaceBudz. All rights reserved.
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="mb-8">
            <ModeToggle />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
