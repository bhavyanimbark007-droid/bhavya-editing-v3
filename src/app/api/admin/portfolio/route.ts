import { portfolioItems } from "@/db/schema";
import { makeCrud } from "@/lib/adminCrud";

export const { GET, POST, PUT, DELETE } = makeCrud(portfolioItems, (b) => ({
  tag: b.tag ?? "",
  title: b.title ?? "",
  sub: b.sub ?? "",
  thumbnailUrl: b.thumbnailUrl ?? b.img ?? "",
  videoUrl: b.videoUrl ?? b.video ?? "",
  category: b.category ?? "work",
  sort: b.sort ?? 0,
}));
