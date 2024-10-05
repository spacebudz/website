import { shuffleArrayWithSeed } from "@/lib/utils.ts";

export const BATCH_SIZE = 50;

export type MetadataCollection = Record<string, Metadata>;

type ExtendedProperty = {
    trait?: string;
    position?: "Left" | "Right" | "Both" | "Neck";
    emotion?: string;
    color?: string;
    typeColor?: string;
    extra?: "Pipe";
};

export type Metadata = {
    name: string;
    traits: string[];
    type: string;
    image: string;
    sha256: string;
    extendedProperties: ExtendedProperty[];
};

type FilterCollection = {
    metadataCollection: MetadataCollection;
    params: URLSearchParams;
    page?: number;
    batchSize?: number;
};

export type LeanMetadata = Array<
    { id: number; image: Metadata["image"]; species: Metadata["type"] }
>;

export type FilterResult = {
    batch: LeanMetadata;
    isDone: boolean;
    query: string;
    total: number;
    page: number;
};

export function filterCollection({
    metadataCollection,
    params,
    page = 0,
    batchSize = BATCH_SIZE,
}: FilterCollection): FilterResult {
    const result = new Filter(metadataCollection, params)
        .bySort()
        .byId()
        .bySpecies()
        .byGadgets()
        .byGadgetsRange()
        .byEmotions()
        .byColors()
        .byGadgetsExtended()
        .done();

    const start = page * batchSize;
    const end = (page + 1) * batchSize;

    const batch = result.slice(start, end);

    return {
        batch,
        isDone: end >= result.length,
        total: result.length,
        query: params.toString(),
        page,
    };
}

class Filter {
    metadata: Array<Metadata & { id: number }>;
    params: URLSearchParams;
    predicates: Array<(m: Metadata & { id: number }) => boolean>;

    constructor(
        metadataCollection: MetadataCollection,
        params: URLSearchParams,
    ) {
        this.metadata = Object.entries(metadataCollection).map(([id, m]) => ({
            ...m,
            id: parseInt(id),
        }));
        this.params = params;
        this.predicates = [];
    }

    bySort(): Filter {
        const sort = this.params.get("sort") as "asc" | "desc" | null;
        if (sort === "asc") {
            return this;
        }
        if (sort === "desc") {
            this.metadata.reverse();
            return this;
        }
        this.metadata = shuffleArrayWithSeed(this.metadata, generateDateSeed());
        return this;
    }

    byId(): Filter {
        const id = parseInt(this.params.get("id") || "");
        if (id) {
            this.predicates.push((m) => m.id === id);
        }
        return this;
    }

    bySpecies(): Filter {
        const species = this.params.getAll("species");
        if (species.length > 0) {
            this.predicates.push((m) => species.some((s) => m.type === s));
        }
        return this;
    }

    byGadgets(): Filter {
        const isUnion: boolean | null = JSON.parse(
            this.params.get("gadgets_union") || "null",
        );
        const gadgets = this.params.getAll("gadgets");

        function check(gadget: string, gadgets: string[]): boolean {
            return gadget.startsWith("!")
                ? !gadgets.includes(gadget.slice(1))
                : gadgets.includes(gadget);
        }

        if (gadgets.length > 0) {
            this.predicates.push((m) =>
                isUnion
                    ? gadgets.some((g) => check(g, m.traits))
                    : gadgets.every((g) => check(g, m.traits))
            );
        }
        return this;
    }

    byGadgetsRange(): Filter {
        const gadgetsRange: number[] | null = JSON.parse(
            this.params.get("gadgets_range") || "null",
        );
        if (gadgetsRange) {
            this.predicates.push((m) =>
                m.traits.length >= gadgetsRange[0] &&
                m.traits.length <= gadgetsRange[1]
            );
        }
        return this;
    }

    byEmotions(): Filter {
        const emotions = this.params.getAll("emotions");

        if (emotions.length > 0) {
            this.predicates.push((m) => {
                const emotion = m.extendedProperties.find((p) => p.emotion)
                    ?.emotion;
                return emotions.some((e) => emotion === e);
            });
        }
        return this;
    }

    byColors(): Filter {
        const speciesColor = this.params.get("species_color");
        const suitColor = this.params.get("suit_color");
        const glovesColor = this.params.get("gloves_color");

        if (speciesColor) {
            this.predicates.push((m) =>
                m.extendedProperties.find((p) => p.typeColor)?.typeColor ===
                    speciesColor
            );
        }
        if (suitColor) {
            this.predicates.push((m) =>
                m.extendedProperties.find((p) => p.trait?.includes("Suit"))
                    ?.color === suitColor
            );
        }
        if (glovesColor) {
            this.predicates.push((m) =>
                m.extendedProperties.find((p) => p.trait === "Gloves")
                    ?.color === glovesColor
            );
        }
        return this;
    }

    byGadgetsExtended(): Filter {
        function transform(g: string) {
            function mapping(
                g: string,
            ) {
                return {
                    l: "Left",
                    r: "Right",
                    n: "Neck",
                    "w/ pipe": "Pipe",
                    "w/o pipe": undefined,
                }[g.split("(")[1].split(")")[0]];
            }

            const negation = g.startsWith("!");
            const gadget = (g.includes("Fire") || g.includes("Ice"))
                ? "Sword"
                : g.replace("!", "").split(" (")[0];
            const color = g.includes("Fire")
                ? { color: "Red" }
                : g.includes("Ice")
                ? { color: "Blue" }
                : gadget === "Sword"
                ? { color: "Gray" }
                : undefined;
            const property = gadget === "Belt"
                ? { extra: mapping(g) as ExtendedProperty["extra"] }
                : { position: mapping(g) as ExtendedProperty["position"] };
            return { ...property, ...color, negation, trait: gadget };
        }

        function check(
            { negation, trait, position, extra, color }: ExtendedProperty & {
                negation: boolean;
            },
            gadgets: ExtendedProperty[],
        ): boolean {
            return negation !==
                gadgets.some((g) =>
                    g.trait === trait && g.position === position &&
                    g.extra === extra &&
                    (g.trait === "Sword" ? g.color === color : true)
                );
        }

        const isUnion: boolean | null = JSON.parse(
            this.params.get("gadgets_union") || "null",
        );

        const gadgets = this.params.getAll("gadgets_ext").map(transform);

        if (gadgets.length > 0) {
            this.predicates.push((m) =>
                isUnion
                    ? gadgets.some((g) => check(g, m.extendedProperties))
                    : gadgets.every((g) => check(g, m.extendedProperties))
            );
        }
        return this;
    }

    done(): LeanMetadata {
        const filteredMetadata = this.metadata.filter((m) =>
            this.predicates.every((predicate) => predicate(m))
        );
        return filteredMetadata.map((m) => ({
            id: m.id,
            image: m.image,
            species: m.type,
        }));
    }
}

function generateDateSeed(): string {
    const now = new Date();
    const day = now.getUTCDate();
    const month = now.getUTCMonth();
    const year = now.getUTCFullYear();
    return `${day}${month}${year}`;
}
