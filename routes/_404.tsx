import { Head } from "$fresh/runtime.ts";
import { Button } from "@/components/ui/button/mod.tsx";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - inhabitable zone</title>
      </Head>
      <div className="flex flex-col w-full h-screen items-center justify-center">
        <div className="text-3xl font-bold">404</div>
        <a href="/">
          <Button variant="link" className="mt-2">
            <ChevronLeftIcon className="mr-1" />
            Back to habitable zone
          </Button>
        </a>
      </div>
    </>
  );
}
