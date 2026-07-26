import { assembleContent } from "@/db/queries";
import { SiteContentProvider } from "@/lib/content";
import Home from "@/components/Home";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await assembleContent(); // server-side read, zero client waterfalls
  return (
    <SiteContentProvider data={data}>
      <Home />
    </SiteContentProvider>
  );
}
