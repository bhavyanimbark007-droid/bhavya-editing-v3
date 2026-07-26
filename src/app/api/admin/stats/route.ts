import { stats } from "@/db/schema";
import { makeCrud } from "@/lib/adminCrud";

export const { GET, POST, PUT, DELETE } = makeCrud(stats, (b) => ({
  label: b.label ?? "",
  value: b.value ?? 0,
  suffix: b.suffix ?? "+",
  sort: b.sort ?? 0,
}));
