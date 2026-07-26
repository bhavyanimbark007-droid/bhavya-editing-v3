import { testimonials } from "@/db/schema";
import { makeCrud } from "@/lib/adminCrud";

export const { GET, POST, PUT, DELETE } = makeCrud(testimonials, (b) => ({
  name: b.name ?? "",
  role: b.role ?? "",
  message: b.message ?? b.quote ?? "",
  avatar: b.avatar ?? "",
  sort: b.sort ?? 0,
}));
