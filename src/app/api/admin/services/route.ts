import { services } from "@/db/schema";
import { makeCrud } from "@/lib/adminCrud";

export const { GET, POST, PUT, DELETE } = makeCrud(services, (b) => ({
  name: b.name ?? "",
  price: b.price ?? "",
  unit: b.unit ?? "/ video",
  description: b.description ?? "",
  features: b.features ?? [],
  featured: !!b.featured,
  sort: b.sort ?? 0,
}));
