import { notFound } from "next/navigation";
import { getPublicProperty } from "@/src/lib/public";
import { PublicListingView } from "@/src/routes/PublicListing";

// Server-rendered for SEO: the property data is fetched on the server and
// sent as HTML, so search engines index the listing content.
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPublicProperty(id);

  if (!property) notFound();

  return <PublicListingView property={property} />;
}
