"use client";

// @deno-types="npm:@types/react@18.3.1"
import * as React from "react";
import { useIsIntersecting } from "@/islands/hooks/use_is_intersecting.tsx";
import { cn, isMobile } from "@/lib/utils.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import metadata from "@/data/metadata.json" with { type: "json" };
import { PartialCircle } from "@/islands/circle_animation/mod.tsx";

const BATCH = 20;

export function InfiniteGrid() {
  const [data, setData] = React.useState<
    {
      page: number;
      array: {
        id: number;
        image: string;
        name: string;
        type: string;
        traits: string[];
      }[];
      isDone: boolean;
    }
  >(
    JSON.parse(
      (IS_BROWSER && sessionStorage.getItem("data")) ||
        JSON.stringify({
          page: 0,
          array: metadata.slice(0, BATCH),
          isDone: false,
        }),
    ),
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  function loadNext() {
    setIsLoading(true);
    setTimeout(() => {
      setData((prev) => {
        const nextPage = prev.page + 1;
        const nextArray = [
          ...prev.array,
          ...metadata.slice(
            nextPage * BATCH,
            nextPage * BATCH + BATCH,
          ),
        ];
        const next = {
          page: nextPage,
          array: nextArray,
          isDone: nextArray.length >= 10000,
        };
        sessionStorage.setItem("data", JSON.stringify(next));
        return next;
      });
      setIsLoading(false);
    }, 500);
  }

  const [isLongHoveringTriggered, setIsLongHoveringTriggered] = React
    .useState<boolean>(false);

  return (
    <div>
      {data.array.length > 0
        ? (
          <div className="relative flex justify-center items-center flex-col w-full">
            <div className="relative grid grid-cols-[repeat(auto-fit,minmax(300px,300px))] gap-3 w-full justify-center">
              {data.array.map((
                metadata,
                index,
              ) => (
                <Item
                  key={index}
                  metadata={metadata}
                  onIntersection={() =>
                    !data.isDone && index === data.array.length - 1 &&
                    loadNext()}
                  isLongHoveringTriggered={isLongHoveringTriggered}
                  onLongHovering={(v) => {
                    setIsLongHoveringTriggered(v);
                  }}
                />
              ))}
            </div>
            {isLoading && (
              <div className="my-8 flex justify-center items-center">
                <h1 className="text-center flex justify-center font-bold text-3xl space-x-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </h1>
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
  { metadata, isLongHoveringTriggered = false, onLongHovering, onIntersection }:
    {
      metadata: {
        id: number;
        image: string;
        name: string;
        type: string;
        traits: string[];
      };
      isLongHoveringTriggered?: boolean;
      onLongHovering?: (value: boolean) => unknown;
      onIntersection?: () => unknown;
    },
) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isIntersecting = useIsIntersecting(
    ref,
    { rootMargin: "700px" },
    onIntersection,
  );

  const imageRef = React.useRef<HTMLImageElement>(null);
  const [isLoadingImage, setIsLoadingImage] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (imageRef.current) {
      imageRef.current.src = `https://spacebudz.mypinata.cloud/ipfs/${
        metadata.image.split("ipfs://")[1]
      }?pinataGatewayToken=sSzgtarDGSZukrz9lNYbbF30wPGLmIr_UWug05lQPddzrCK5tXa-G-QI7zMgG79m&img-width=500`;
      imageRef.current.onload = () => {
        setIsLoadingImage(false);
      };
    }
    return () => {
      if (imageRef.current) {
        imageRef.current.src = "";
        clearTimeout(hoverTimeout.current);
      }
    };
  }, [isIntersecting]);

  const [isLongHovering, setIsLongHovering] = React.useState<boolean>(false);

  const hoverTimeout = React.useRef<number>();

  function onMouseEnter(_e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (isMobile) return;
    hoverTimeout.current = setTimeout(() => {
      onLongHovering?.(true);
      setIsLongHovering(true);
    }, 800);
  }

  function onMouseLeave(_e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (isMobile) return;

    clearTimeout(hoverTimeout.current);
    onLongHovering?.(false);
    setIsLongHovering(false);
  }

  return (
    <div
      ref={ref}
      className={cn(
        "w-full h-[300px] relative",
        !isIntersecting && "invisible",
        isLongHovering && "z-10",
      )}
    >
      {isIntersecting && (
        <a
          tabIndex={0}
          href={`/budz/${metadata.id}`}
          className="group"
        >
          <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="absolute w-full h-full"
          >
            {isLongHovering &&
              (
                <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 w-[528px] h-[528px]">
                  <PartialCircle
                    className="absolute animate-in spin-in-90 fade-in-0 duration-1000 w-full h-full"
                    radius={235}
                    offsetDegree={-90}
                  />
                  <PartialCircle
                    className="absolute animate-in spin-in-[-90deg] fade-in-0 duration-1000 w-full h-full"
                    radius={235}
                    offsetDegree={90}
                  />
                </div>
              )}
            <div
              className={cn(
                "group-focus-visible:ring-1 gropu-focus-visible:ring-ring absolute w-full h-full top-1/2 bg-transparent overflow-hidden left-1/2 -translate-x-1/2 -translate-y-1/2  will-change-transform rounded transition-all ease-in-out",
                isLongHovering &&
                  "w-[528px] h-[528px] duration-700",
                isLongHoveringTriggered && !isLongHovering &&
                  "opacity-10 grayscale duration-500",
                !isLongHovering &&
                  "group-active:scale-[99%] group-active:duration-100",
              )}
            >
              <div
                className={cn(
                  "relative w-full h-full transition-opacity duration-300 ease-in-out",
                  isLoadingImage ? "opacity-0" : "opacity-100",
                )}
              >
                <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4">
                  <img
                    draggable={false}
                    className={cn(
                      "min-w-[536px] contrast-[95%]",
                      isLongHovering &&
                        "visible group-active:scale-[99%] group-active:duration-100",
                    )}
                    ref={imageRef}
                  />
                </div>
              </div>
            </div>
            {isLongHovering &&
              (
                <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4">
                  <div className="mt-[580px] flex justify-center items-center flex-col">
                    <div className="font-bold text-4xl animate-out fade-out-100 opacity-0 delay-300 duration-300 fill-mode-forwards">
                      {metadata.type}
                    </div>
                    <div className="font-semibold text-xl mt-2 animate-out fade-out-100 opacity-0 delay-500 duration-300 fill-mode-forwards">
                      #{metadata.id}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </a>
      )}
    </div>
  );
}
