import { skills } from "@/db/schema";
import { makeCrud } from "@/lib/adminCrud";

export const { GET, POST, PUT, DELETE } = makeCrud(skills, (b) => ({
  name: b.name ?? b.title ?? "",
  category: b.category ?? "",
  level: b.level ?? 100,
  tags: b.tags ?? [],
  points: b.points ?? [],
  isNew: !!b.isNew,
  sort: b.sort ?? 0,
}));
