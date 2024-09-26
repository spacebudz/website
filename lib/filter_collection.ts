export const BATCH_SIZE = 20;

export type MetadataCollection = Record<string, Metadata>;

export type Metadata = {
    name: string;
    traits: string[];
    type: string;
    image: string;
    sha256: string;
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
        .byGadget()
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
    constructor(
        metadataCollection: MetadataCollection,
        params: URLSearchParams,
    ) {
        this.metadata = Object.entries(metadataCollection).map(([id, m]) => ({
            ...m,
            id: parseInt(id),
        }));
        this.params = params;
    }

    byId(): Filter {
        const id = this.params.get("id");
        if (id) this.metadata = [this.metadata[parseInt(id)]];
        return this;
    }

    bySort(): Filter {
        if (this.params.get("sort") === "desc") {
            this.metadata.reverse();
        }
        return this;
    }

    bySpecies(): Filter {
        const species = this.params.getAll("species");
        if (species.length > 0) {
            this.metadata = this.metadata.filter((m) =>
                species.some((s) => m.type === s)
            );
        }
        return this;
    }

    byGadget(): Filter {
        const isUnion = this.params.get("gadgets_union") === "true";
        const gadgets = this.params.getAll("gadgets");
        function check(gadget: string, gadgets: string[]): boolean {
            return gadget.startsWith("!")
                ? !gadgets.includes(gadget.slice(1))
                : gadgets.includes(gadget);
        }
        if (gadgets.length > 0) {
            this.metadata = this.metadata.filter((m) =>
                isUnion
                    ? gadgets.some((g) => check(g, m.traits))
                    : gadgets.every((g) => check(g, m.traits))
            );
        }
        return this;
    }

    done(): LeanMetadata {
        return this.metadata.map((m) => ({
            id: m.id,
            image: m.image,
            species: m.type,
        }));
    }
}
