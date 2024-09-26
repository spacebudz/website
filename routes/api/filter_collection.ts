import { FreshContext } from "$fresh/server.ts";
import {
  filterCollection,
  MetadataCollection,
} from "@/lib/filter_collection.ts";
import metadata from "https://raw.githubusercontent.com/spacebudz/wormhole/refs/heads/main/artifacts/metadata.json" with {
  type: "json",
};

export const handler = (req: Request, _ctx: FreshContext): Response => {
  const params = new URLSearchParams(req.url);
  const result = filterCollection({
    metadataCollection: metadata as MetadataCollection,
    params,
    page: parseInt(params.get("page") || "0"),
  });
  return Response.json(result);
};
