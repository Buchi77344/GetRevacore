import { supabase } from "./supabase";

export interface PublicProperty {
  id: string;
  title: string;
  type: string;
  price: number;
  currency: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number | null;
  image_url: string | null;
  description: string | null;
  features: string[] | null;
  status: string;
  listing_type: string;
  is_public: boolean;
  created_at: string;
}

const mapRow = (row: Record<string, unknown>): PublicProperty => ({
  id: row.id as string,
  title: (row.title as string) || "",
  type: (row.property_type as string) || (row.type as string) || "",
  price: (row.price as number) || 0,
  currency: (row.currency as string) || "USD",
  location: (row.location as string) || "",
  bedrooms: (row.bedrooms as number) || 0,
  bathrooms: (row.bathrooms as number) || 0,
  size_sqft:
    (row.size_sqft as number | null) || (row.sqft as number | null) || null,
  image_url:
    (row.image_url as string | null) ||
    (row.primary_photo_url as string | null) ||
    null,
  description: (row.description as string | null) || null,
  features: (row.features as string[] | null) || [],
  status: (row.status as string) || "available",
  listing_type: (row.listing_type as string) || "sale",
  is_public: (row.is_public as boolean) || false,
  created_at: (row.created_at as string) || "",
});

// Public, server-safe fetch used by both the SPA and Next.js server routes
// (the anon key is public, suitable for reading publicly-listed properties).
export async function getPublicProperty(
  id: string,
): Promise<PublicProperty | null> {
  if (!id) return null;
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("is_public", true)
    .single();

  if (error || !data) return null;
  return mapRow(data as Record<string, unknown>);
}


