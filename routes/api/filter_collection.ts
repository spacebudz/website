import { FreshContext } from "$fresh/server.ts";
import { filterCollection } from "@/lib/filter_collection.ts";
import { metadataCollection } from "@/lib/metadata.ts";

export const handler = (req: Request, _ctx: FreshContext): Response => {
  const params = new URLSearchParams(req.url);
  const result = filterCollection({
    metadataCollection,
    params,
    page: parseInt(params.get("page") || "0"),
  });
  return Response.json(result);
};
