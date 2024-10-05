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
  ValueNoneIcon,
} from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input/mod.tsx";
import { Button } from "@/components/ui/button/mod.tsx";
import { Signal, signal } from "@preact/signals";
import {
  filterCollection,
  type FilterResult,
  MetadataCollection,
} from "@/lib/filter_collection.ts";
import { useMode } from "@/islands/providers/mode_provider.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/islands/ui/popover/mod.tsx";
import * as RovingTabIndex from "https://esm.sh/@radix-ui/react-roving-focus@1.1.0?external=react,react-dom,react/jsx-runtime&target=es2022";

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

const gadgetsDataExt = [
  "Flag (l)",
  "Flag (r)",
  "Cardano (l)",
  "Cardano (r)",
  "Sword (l)",
  "Sword (r)",
  "Fire sword (l)",
  "Ice sword (l)",
  "Flowers (l)",
  "Flowers (r)",
  "Revolver (l)",
  "Revolver (r)",
  "Amulet (l)",
  "Amulet (n)",
  "Belt (w/ pipe)",
  "Belt (w/o pipe)",
];

const emotionsData = [
  "Amazed",
  "Angry",
  "Confused",
  "Greedy",
  "Happy",
  "Joking",
  "Laughing",
  "Sad",
  "Serious",
  "Shocked",
  "Shy",
  "Superior",
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
  const [isShowing, setIsShowing] = React.useState<boolean>();
  const isStickyRef = React.useRef(isSticky);
  const isShowingRef = React.useRef(isShowing);

  const [top, setTop] = React.useState<number>();

  const [url, setUrl] = React.useState(
    (IS_BROWSER && new URL(globalThis.location.href)) as URL,
  );

  const { mode } = useMode();

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
    () => [
      ...url.searchParams?.getAll("gadgets") || [],
      ...url.searchParams?.getAll("gadgets_ext") || [],
    ],
  );
  const [isGadgetsUnion, setIsGadgetsUnion] = React.useState<boolean>(
    () => JSON.parse(url.searchParams?.get("gadgets_union") || "false"),
  );
  const [gadgetsRange, setGadgetsRange] = React.useState<number[]>(() =>
    JSON.parse(
      url.searchParams?.get("gadgets_range") || JSON.stringify([0, 12]),
    )
  );
  const [emotions, setEmotions] = React.useState<string[]>(() =>
    url.searchParams?.getAll("emotions") || []
  );
  const [colors, setColors] = React.useState<
    { speciesColor?: string; suitColor?: string; glovesColor?: string }
  >(() => ({
    speciesColor: url.searchParams?.get("species_color") || undefined,
    suitColor: url.searchParams?.get("suit_color") || undefined,
    glovesColor: url.searchParams?.get("gloves_color") || undefined,
  }));

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
      if (
        g.includes("(")
      ) {
        params.append("gadgets_ext", g);
      } else {
        params.append("gadgets", g);
      }
    });
    emotions.forEach((e) => {
      params.append("emotions", e);
    });
    if (colors.speciesColor) params.set("species_color", colors.speciesColor);
    if (colors.suitColor) params.set("suit_color", colors.suitColor);
    if (colors.glovesColor) params.set("gloves_color", colors.glovesColor);

    return params;
  }, [
    sort,
    id,
    species,
    gadgets,
    isGadgetsUnion,
    gadgetsRange,
    emotions,
    colors,
  ]);

  const hasMatchingParams = typeof url.searchParams === "undefined" ||
    urlSearchParams.toString() === url.searchParams.toString();

  React.useEffect(() => {
    function handleScroll() {
      const activeElement = document.activeElement;
      if (
        !isMobile && ref.current && ref.current.contains(activeElement) &&
        activeElement instanceof HTMLElement
      ) {
        activeElement.blur();
      }

      if (isStickyRef.current) {
        setIsShowing(false);
      }
    }
    globalThis.addEventListener("scroll", handleScroll);
    return () => {
      globalThis.removeEventListener("scroll", handleScroll);
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

  function resetAll() {
    setId({ value: "" });
    setSort(null);
    setSpecies([]);
    setGadgets([]);
    setIsGadgetsUnion(false);
    setGadgetsRange([0, 12]);
    setEmotions([]);
    setColors({});
    applyFilter({ reset: true });
  }

  const hasMounted = React.useRef(false);
  React.useEffect(() => {
    if (hasMounted.current) resetAll();
    else hasMounted.current = true;
  }, [mode]);

  React.useEffect(() => {
    isStickyRef.current = isSticky;
    isShowingRef.current = isShowing;
  }, [isSticky, isShowing]);

  React.useEffect(() => {
    let startY = 0;
    let currentY = 0;
    const offset = mode === "core" ? -130 : -254;

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
            setTop(Math.min(offset + Math.floor(deltaY), -1));
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
        "w-full h-full sticky -top-[130px] mt-2 shadow-none overflow-hidden z-20 will-change-[top,transform]",
        mode === "advanced" && "-top-[254px]",
        isSticky &&
          "rounded-t-none border shadow",
        isSticky && !Number.isInteger(top) &&
          "transition-all duration-300",
        isSticky && isShowing && "-top-[1px]",
        isLongHoveringTriggered.value && "opacity-10 z-0",
        isLongHoveringTriggered.value && isSticky && "opacity-0",
      )}
      style={Number.isInteger(top) ? { top: `${top}px` } : {}}
    >
      <CardContent className="pt-7 pb-[60px] md:pt-12 md:pb-24 md:px-20 w-full grid grid-cols-2 lg:grid-cols-3 justify-start items-center gap-5 md:gap-x-32 md:gap-y-10 relative">
        <div className="flex flex-col items-start justify-start w-full">
          <div className="font-semibold text-lg mb-2 md:mb-4">
            Species
          </div>
          <Combobox
            category="species"
            data={speciesData}
            value={species}
            onChange={setSpecies}
          />
        </div>
        <div className="flex flex-col items-start justify-start w-full">
          <div className="font-semibold text-lg mb-2 md:mb-4">
            Gadgets
          </div>
          <Combobox
            category="gadgets"
            data={mode === "core" ? gadgetsData : [
              ...gadgetsData.filter((g) =>
                ![
                  "Cardano",
                  "Flag",
                  "Sword",
                  "Flowers",
                  "Revolver",
                  "Amulet",
                  "Belt",
                ].includes(g)
              ),
              ...gadgetsDataExt,
            ].sort()}
            value={gadgets}
            onChange={setGadgets}
            isGadgetsUnion={isGadgetsUnion}
            setIsGadgetsUnion={setIsGadgetsUnion}
            gadgetsRange={gadgetsRange}
            setGadgetsRange={setGadgetsRange}
          />
        </div>
        <div className="flex flex-col items-start justify-start w-full col-span-2 lg:col-span-1">
          <div className="font-semibold text-lg mb-2 md:mb-4">
            Tag
          </div>
          <div className="flex">
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
              {sort === "desc" &&
                <TextAlignBottomIcon className="ml-1 -mt-1" />}
            </Button>
          </div>
        </div>
        {mode === "advanced" && (
          <>
            <div className="flex flex-col items-start justify-start w-full col-span-1">
              <div className="font-semibold text-lg mb-2 md:mb-4">
                Emotions
              </div>
              <Combobox
                category="emotions"
                data={emotionsData}
                value={emotions}
                onChange={setEmotions}
              />
            </div>
            <div className="flex flex-col items-start justify-start w-full col-span-1 lg:col-span-2">
              <div className="font-semibold text-lg mb-2 md:mb-4">
                Colors
              </div>
              <div className="flex space-x-4">
                <ColorItem
                  colors={[
                    "Black",
                    "Blue",
                    "Brown",
                    "Gray",
                    "Green",
                    "Orange",
                    "Pink",
                    "Purple",
                    "Red",
                    "White",
                    "Yellow",
                  ]}
                  value={colors.speciesColor}
                  onChange={(value) =>
                    setColors((c) => ({ ...c, speciesColor: value }))}
                >
                  <img
                    draggable={false}
                    src="/head.svg"
                    className="w-7 dark:invert"
                  />
                </ColorItem>
                <ColorItem
                  colors={[
                    "Black",
                    "Blue",
                    "Brown",
                    "Gray",
                    "Green",
                    "Pink",
                    "Purple",
                    "Red",
                    "Yellow",
                  ]}
                  value={colors.suitColor}
                  onChange={(value) =>
                    setColors((c) => ({ ...c, suitColor: value }))}
                >
                  <img
                    draggable={false}
                    src="/suit.svg"
                    className="w-7 dark:invert"
                  />
                </ColorItem>
                <ColorItem
                  colors={[
                    "Black",
                    "Blue",
                    "Brown",
                    "Green",
                    "Pink",
                    "Purple",
                    "Red",
                  ]}
                  value={colors.glovesColor}
                  onChange={(value) =>
                    setColors((c) => ({ ...c, glovesColor: value }))}
                >
                  <img
                    draggable={false}
                    src="/gloves.svg"
                    className="w-7 dark:invert"
                  />
                </ColorItem>
              </div>
            </div>
          </>
        )}
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
          onClick={resetAll}
        >
          <ResetIcon />
        </Button>
      </CardContent>
    </Card>
  );
}

function ColorItem(
  { children, colors, value, onChange }: {
    colors: string[];
    value?: string;
    onChange?: (value: string) => void;
  } & React.PropsWithChildren,
) {
  const colorMap: Record<string, string> = {
    "Blue": "#3b82f6",
    "Green": "#10b981",
    "Red": "#ef4444",
    "Yellow": "#eab308",
    "Purple": "#a855f7",
    "Black": "black",
    "Pink": "#ec4899",
    "Brown": "#977669",
    "Orange": "#f97316",
    "White": "white",
    "Gray": "#6b7280",
  };
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="border touch-manipulation"
          size="icon"
          variant="secondary"
          style={{ backgroundColor: value && colorMap[value] }}
        >
          <div
            className={cn(
              value && "invert dark:invert-0",
              value === "White" && "invert-0 dark:invert",
            )}
          >
            {children}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <RovingTabIndex.Root asChild>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color, index) => (
              <RovingTabIndex.Item asChild key={index}>
                <Button
                  tabIndex={0}
                  variant="outline"
                  size="icon"
                  style={{ backgroundColor: colorMap[color] }}
                  onClick={() => {
                    onChange?.(color);
                    setOpen(false);
                  }}
                />
              </RovingTabIndex.Item>
            ))}
            <RovingTabIndex.Item asChild>
              <Button
                disabled={!value}
                variant="outline"
                size="icon"
                onClick={() => {
                  onChange?.("");
                  setOpen(false);
                }}
              >
                <ValueNoneIcon />
              </Button>
            </RovingTabIndex.Item>
          </div>
        </RovingTabIndex.Root>
        {}
      </PopoverContent>
    </Popover>
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
