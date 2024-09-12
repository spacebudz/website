"use client";

import * as React from "react";
import { useIsIntersecting } from "@/islands/hooks/use_is_intersecting.tsx";
import { cn } from "@/lib/utils.ts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card/mod.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

const BATCH = 50;

export function InfiniteGrid() {
  const [pageData, setPageData] = React.useState<
    { page: number; data: number[]; isDone: boolean }
  >(
    JSON.parse(
      (IS_BROWSER && sessionStorage.getItem("pageData")) ||
        JSON.stringify({ page: 0, data: [...Array(BATCH)], isDone: false }),
    ),
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  function loadNext() {
    setIsLoading(true);
    setTimeout(() => {
      setPageData((prev) => {
        const next = {
          page: prev.page + 1,
          data: [...prev.data, ...Array(BATCH)],
          isDone: prev.page === 5,
        };
        sessionStorage.setItem("pageData", JSON.stringify(next));
        return next;
      });
      setIsLoading(false);
    }, 500);
  }

  return (
    <div className="flex flex-grow flex-col">
      {pageData.data.length > 0
        ? (
          <div>
            <div className="grid grid-cols-infinite lg:grid-cols-lg-infinite gap-1 md:gap-2 overflow-hidden">
              {pageData.data.slice(0, pageData.page * BATCH + BATCH).map((
                _,
                index,
              ) => (
                <Item
                  key={index}
                  id={index}
                  onIntersection={() =>
                    !pageData.isDone && index === pageData.data.length - 1 &&
                    loadNext()}
                />
              ))}
            </div>
            {isLoading && (
              <div className="my-8 flex justify-center items-center">
                <h2 className="text-center flex justify-center">Loading...</h2>
              </div>
            )}
          </div>
        )
        : (
          <div className="w-full h-full font-medium text-slate-500 flex justify-center items-center">
            No items
          </div>
        )}
    </div>
  );
}

function Item(
  { id, onIntersection }: { id: number; onIntersection?: () => unknown },
) {
  const ref = React.useRef(null);
  const isIntersecting = useIsIntersecting(
    ref,
    { rootMargin: "700px" },
    onIntersection,
  );

  return (
    <div
      ref={ref}
      className={cn(
        "w-full pt-[135%] relative",
        !isIntersecting && "invisible",
      )}
    >
      {isIntersecting && (
        <Card className="absolute w-full h-full top-0 left-0">
          <CardHeader>
            <CardTitle>Item: {id}</CardTitle>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
