import { assembleContent } from "@/db/queries";
import { SiteContentProvider } from "@/lib/content";
import Home from "@/components/Home";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const data = await assembleContent();

  return (
    <SiteContentProvider data={data}>
      <Home />
    </SiteContentProvider>
  );
}