"use client";

// @deno-types="npm:@types/react@18.3.1"
import * as React from "react";
import { useIsIntersecting } from "@/islands/hooks/use_is_intersecting.tsx";
import { cn, ipfsToHttps, isMobile } from "@/lib/utils.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { PartialCircle } from "@/islands/circle_animation/mod.tsx";
import { Card, CardContent } from "@/components/ui/card/mod.tsx";
import { Combobox } from "@/islands/combobox.tsx";
import {
  ChevronUpIcon,
  ResetIcon,
  ShuffleIcon,
  TextAlignBottomIcon,
  TextAlignTopIcon,
} from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input/mod.tsx";
import { Button } from "@/components/ui/button/mod.tsx";
import { Signal, signal } from "@preact/signals";
import {
  filterCollection,
  type FilterResult,
  MetadataCollection,
} from "@/lib/filter_collection.ts";

const speciesData = [
  "Alien",
  "Ape",
  "Arcane",
  "Bear",
  "Bull",
  "Cat",
  "Dino",
  "Dog",
  "Elephant",
  "Fish",
  "Frog",
  "Lion",
  "Parrot",
  "Rhino",
  "Robot",
  "Shark",
  "Tiger",
  "Wolf",
];

const gadgetsData = [
  "Amulet",
  "Anchor",
  "Arc",
  "Axe",
  "Backpack",
  "Baguette",
  "Bazooka",
  "Belt",
  "Binoculars",
  "Blaster",
  "Camo Suit",
  "Candle",
  "Cardano",
  "Chestplate",
  "Covered Helmet",
  "Eye Patch",
  "Flag",
  "Flowers",
  "Harpoon",
  "Hockey Stick",
  "Jetpack",
  "Jo-Jo",
  "Lamp Fish",
  "Pistol",
  "Revolver",
  "SPO",
  "Ski Goggles",
  "Snorkel",
  "Special Background",
  "Star Suit",
  "Sun Glasses",
  "Sword",
  "Umbrella",
  "VR",
  "Watch",
  "Wine",
  "Wool Boots",
  "X-Ray",
];

const isLongHoveringTriggered = signal<boolean>();

export function ScrollPanel(
  { data: { value: { total } } }: { data: Signal<FilterResult> },
) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isIntersecting = useIsIntersecting(ref, {
    threshold: [1],
    rootMargin: "-1px 0px 0px 0px",
  });
  const isSticky = typeof isIntersecting !== "undefined" && !isIntersecting;
  const [isShowing, setIsShowing] = React.useState<boolean>(true);
  const isStickyRef = React.useRef(isSticky);
  const isShowingRef = React.useRef(isShowing);

  const [top, setTop] = React.useState<number>();

  const [url, setUrl] = React.useState(
    (IS_BROWSER && new URL(globalThis.location.href)) as URL,
  );

  const [sort, setSort] = React.useState<"asc" | "desc" | null>(() =>
    url.searchParams?.get("sort") as "asc" | "desc" | null || null
  );
  const [id, setId] = React.useState<{ value: string }>(() => ({
    value: url.searchParams?.get("id") || "",
  }));
  const [species, setSpecies] = React.useState<string[]>(
    () => url.searchParams?.getAll("species") || [],
  );
  const [gadgets, setGadgets] = React.useState<string[]>(
    () => url.searchParams?.getAll("gadgets") || [],
  );
  const [isGadgetsUnion, setIsGadgetsUnion] = React.useState<boolean>(
    () => JSON.parse(url.searchParams?.get("gadgets_union") || "false"),
  );
  const [gadgetsRange, setGadgetsRange] = React.useState<number[]>(() =>
    JSON.parse(
      url.searchParams?.get("gadgets_range") || JSON.stringify([0, 12]),
    )
  );

  const urlSearchParams = React.useMemo(() => {
    const params = new URLSearchParams();

    if (sort) params.set("sort", sort);
    if (id.value) params.set("id", id.value);
    if (isGadgetsUnion) params.set("gadgets_union", JSON.stringify(true));
    if (gadgetsRange.toString() !== [0, 12].toString()) {
      params.set("gadgets_range", JSON.stringify(gadgetsRange));
    }
    species.forEach((s) => {
      params.append("species", s);
    });
    gadgets.forEach((g) => {
      params.append("gadgets", g);
    });
    return params;
  }, [sort, id, species, gadgets, isGadgetsUnion, gadgetsRange]);

  const hasMatchingParams = typeof url.searchParams === "undefined" ||
    urlSearchParams.toString() === url.searchParams.toString();

  React.useEffect(() => {
    let distance = 0;
    let timeout: number;
    function onScroll() {
      const activeElement = document.activeElement;
      if (
        !isMobile && ref.current && ref.current.contains(activeElement) &&
        activeElement instanceof HTMLElement
      ) {
        activeElement.blur();
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        distance = 0;
      }, 200);

      distance++;
      if (distance > 4 && isStickyRef.current) {
        setTimeout(() => setIsShowing(false));
      }
    }
    globalThis.addEventListener("scroll", onScroll);
    return () => {
      globalThis.removeEventListener("scroll", onScroll);
    };
  }, []);

  function applyFilter({ reset }: { reset?: boolean } = {}) {
    const newUrl = new URL(
      reset ? "" : "?" + urlSearchParams.toString(),
      url.origin + url.pathname,
    );
    globalThis.history.replaceState(
      {},
      "",
      newUrl,
    );
    setUrl(newUrl);
    const event = new CustomEvent("appliedFilter", { detail: newUrl });
    globalThis.dispatchEvent(event);
    globalThis.scrollTo({ top: 0 });
  }

  React.useEffect(() => {
    isStickyRef.current = isSticky;
    isShowingRef.current = isShowing;
  }, [isSticky, isShowing]);

  React.useEffect(() => {
    let startY = 0;
    let currentY = 0;

    if (ref.current) {
      const handleTouchStart = (event: TouchEvent) => {
        const touch = event.touches[0];
        startY = touch.clientY;
      };

      const handleTouchMove = (event: TouchEvent) => {
        if (event.cancelable && isStickyRef.current) {
          event.preventDefault();
        }
        if (isStickyRef.current && !isShowingRef.current) {
          event.preventDefault();
          const touch = event.touches[0];
          currentY = touch.clientY;
          const deltaY = currentY - startY;

          if (deltaY > 0) {
            setTop(Math.min(-128 + Math.floor(deltaY), -1));
          }
        }
      };

      const handleTouchEnd = () => {
        setIsShowing(true);
        setTop(undefined);
      };

      ref.current.addEventListener("touchstart", handleTouchStart);
      ref.current.addEventListener("touchmove", handleTouchMove);
      ref.current.addEventListener("touchend", handleTouchEnd);

      return () => {
        if (ref.current) {
          ref.current.removeEventListener("touchstart", handleTouchStart);
          ref.current.removeEventListener("touchmove", handleTouchMove);
          ref.current.removeEventListener("touchend", handleTouchEnd);
        }
      };
    }
  }, []);

  return (
    <Card
      onMouseEnter={() => setIsShowing(true)}
      onClick={() => setIsShowing(true)}
      ref={ref}
      className={cn(
        "w-full h-full sticky -top-32 mt-2 shadow-none overflow-hidden z-20",
        isSticky &&
          "rounded-t-none border border-t-0 shadow will-change-transform",
        isSticky && !Number.isInteger(top) &&
          "transition-all duration-300",
        isSticky && isShowing && "-top-[1px]",
        isLongHoveringTriggered.value && "opacity-10 z-0",
        isLongHoveringTriggered.value && isSticky && "opacity-0",
      )}
      style={Number.isInteger(top) ? { top: `${top}px` } : {}}
    >
      <CardContent className="py-14 lg:py-6 lg:px-20 w-full h-[250px] lg:h-[220px] grid grid-cols-2 lg:grid-cols-3 justify-start items-center gap-6 lg:gap-x-32 relative">
        <div className="flex items-center justify-center w-full h-full relative">
          <div className="absolute -top-6 lg:top-6 left-0 font-semibold text-lg mb-4">
            Species
          </div>
          <Combobox
            category="species"
            data={speciesData}
            value={species}
            onChange={setSpecies}
          />
        </div>
        <div className="flex items-center justify-center w-full h-full relative">
          <div className="absolute -top-6 lg:top-6 left-0 font-semibold text-lg mb-4">
            Gadgets
          </div>
          <Combobox
            category="gadgets"
            data={gadgetsData}
            value={gadgets}
            onChange={setGadgets}
            isGadgetsUnion={isGadgetsUnion}
            setIsGadgetsUnion={setIsGadgetsUnion}
            gadgetsRange={gadgetsRange}
            setGadgetsRange={setGadgetsRange}
          />
        </div>
        <div className="flex items-center justify-center relative w-full h-full col-span-2 lg:col-span-1">
          <div className="absolute -top-6 lg:top-6 left-0 font-semibold text-lg mb-4">
            Tag
          </div>
          <Input
            onKeyDown={(e) => {
              if (e.key === "Enter" && !hasMatchingParams) {
                applyFilter();
              }
            }}
            className="mr-10"
            placeholder="Search id..."
            value={id.value}
            maxLength={4}
            onChange={(e) =>
              setId(
                { value: e.target.value.replace(/[^0-9]/g, "") },
              )}
          />
          <Button
            variant="outline"
            onClick={() => {
              setSort((v) => {
                if (v === "asc") return "desc";
                return "asc";
              });
            }}
          >
            Sort
            {!sort && <ShuffleIcon className="ml-1 scale-[85%]" />}
            {sort === "asc" && <TextAlignTopIcon className="ml-1 mt-1" />}
            {sort === "desc" && <TextAlignBottomIcon className="ml-1 -mt-1" />}
          </Button>
        </div>
        <Button
          disabled={hasMatchingParams}
          variant={hasMatchingParams ? "secondary" : "default"}
          className="w-full absolute left-0 bottom-0"
          onClick={() => applyFilter()}
        >
          {!isShowing && isSticky && <ChevronUpIcon className="mr-4" />}
          <div>
            {hasMatchingParams
              ? (
                <>
                  Showing result (
                  <span className="font-light">
                    {total.toLocaleString()}
                  </span>)
                </>
              )
              : <>Apply...</>}
          </div>
        </Button>
        <Button
          disabled={url.searchParams?.size <= 0 && urlSearchParams?.size <= 0}
          className="absolute right-3 top-3"
          variant="ghost"
          size="icon"
          onClick={() => {
            setId({ value: "" });
            setSort(null);
            setSpecies([]);
            setGadgets([]);
            setIsGadgetsUnion(false);
            setGadgetsRange([0, 12]);
            applyFilter({ reset: true });
          }}
        >
          <ResetIcon />
        </Button>
      </CardContent>
    </Card>
  );
}

export function InfiniteGrid(
  { data }: { data: Signal<FilterResult> },
) {
  React.useMemo(() => {
    if (IS_BROWSER) {
      const sessionData: FilterResult | false = JSON.parse(
        sessionStorage.getItem("data") || "false",
      );
      if (sessionData && sessionData.query === data.value.query) {
        data.value = sessionData;
      }
    }
  }, []);

  const localMetadataCollection = React.useRef<MetadataCollection>();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    import(
      "@/lib/metadata.ts"
    ).then(({ metadataCollection }) => {
      localMetadataCollection.current = metadataCollection;
    });

    async function onAppliedFilter(e: Event) {
      data.value = { ...data.value, batch: [] };
      // deno-lint-ignore ban-ts-comment
      //@ts-ignore
      const url = e.detail;
      const page = 0;
      const params = url.searchParams;

      const result = await queryMetadata(page, params);

      data.value = {
        total: result.total,
        page,
        batch: result.batch,
        isDone: result.isDone,
        query: params.toString(),
      };

      sessionStorage.setItem("data", JSON.stringify(data.value));
    }

    globalThis.addEventListener("appliedFilter", onAppliedFilter);
    return () => {
      globalThis.removeEventListener("appliedFilter", onAppliedFilter);
    };
  }, []);

  async function queryMetadata(
    page: number,
    params: URLSearchParams,
  ): Promise<FilterResult> {
    return localMetadataCollection.current
      ? filterCollection({
        metadataCollection: localMetadataCollection.current,
        params,
        page,
      })
      : await fetch(
        "/api/filter_collection?" + params.toString() + `&page=${page}`,
      ).then((res) => res.json());
  }

  async function loadNext() {
    setIsLoading(true);

    const nextPage = data.value.page + 1;
    const params = new URLSearchParams(data.value.query);

    const result = await queryMetadata(nextPage, params);

    data.value = {
      ...data.value,
      page: nextPage,
      batch: [
        ...data.value.batch,
        ...result.batch,
      ],
      isDone: result.isDone,
    };
    sessionStorage.setItem("data", JSON.stringify(data.value));

    setIsLoading(false);
  }

  return (
    <div>
      {data.value.batch.length > 0
        ? (
          <div className="relative flex justify-center items-center flex-col w-full">
            <div className="relative grid grid-cols-[repeat(auto-fit,minmax(300px,300px))] gap-3 w-full justify-center">
              {data.value.batch.map((
                metadata,
                index,
              ) => (
                <Item
                  key={index}
                  metadata={metadata}
                  onIntersection={() =>
                    !data.value.isDone &&
                    index === data.value.batch.length - 1 &&
                    loadNext()}
                />
              ))}
              {data.value.batch.length && data.value.batch.length < 4 &&
                [...Array(4 - data.value.batch.length)].map((_, index) => (
                  <div key={index} className="hidden md:block" />
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
          <div className="w-full h-full mt-4 text-center opacity-30">
            No items
          </div>
        )}
    </div>
  );
}

function Item(
  { metadata, onIntersection }: {
    metadata: {
      id: number;
      image: string;
      species: string;
    };
    onIntersection?: () => unknown;
  },
) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isIntersecting = useIsIntersecting(
    ref,
    { rootMargin: "1000px" },
    onIntersection,
  );

  const imageRef = React.useRef<HTMLImageElement>(null);
  const [isLoadingImage, setIsLoadingImage] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (imageRef.current) {
      setIsLoadingImage(true);
      imageRef.current.src = ipfsToHttps(metadata.image, 600);
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
      isLongHoveringTriggered.value = true;
      setIsLongHovering(true);
    }, 800);
  }

  function onMouseLeave(_e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (isMobile) return;

    clearTimeout(hoverTimeout.current);
    isLongHoveringTriggered.value = false;
    setIsLongHovering(false);
  }

  const isLongHoveringAndLoaded = isLongHovering && !isLoadingImage;

  return (
    <div
      ref={ref}
      className={cn(
        "w-full h-[300px] relative",
        !isIntersecting && "invisible",
        isLongHoveringAndLoaded && "z-10",
      )}
    >
      {isIntersecting && (
        <a
          tabIndex={0}
          href={`/collection/${metadata.id}`}
          className="group"
        >
          <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={cn(
              "absolute w-full h-full",
              isLoadingImage && "border rounded-xl",
            )}
          >
            {isLongHoveringAndLoaded &&
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
                "group-focus-visible:ring-1 gropu-focus-visible:ring-ring absolute w-full h-full top-1/2 bg-transparent overflow-hidden left-1/2 -translate-x-1/2 -translate-y-1/2  will-change-transform rounded-xl transition-all ease-in-out",
                isLongHoveringAndLoaded &&
                  "w-[528px] h-[528px] duration-700",
                isLongHoveringTriggered.value && !isLongHovering &&
                  "opacity-10 grayscale duration-500",
                !isLongHoveringAndLoaded &&
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
                      "min-w-[536px] contrast-[95%] group-hover:scale-[101%] transition-transform duration-300",
                      isLongHoveringAndLoaded &&
                        "visible group-active:scale-[99%] group-active:duration-100 group-hover:scale-100",
                    )}
                    ref={imageRef}
                  />
                </div>
              </div>
            </div>
            {isLongHoveringAndLoaded &&
              (
                <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4">
                  <div className="mt-[580px] flex justify-center items-center flex-col">
                    <div className="font-bold text-4xl animate-out fade-out-100 opacity-0 delay-300 duration-300 fill-mode-forwards">
                      {metadata.species}
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
