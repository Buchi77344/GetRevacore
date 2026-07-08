"use client";

import { useParams } from "next/navigation";
import { LeadCaptureFormView } from "@/src/routes/LeadCaptureForm";

export default function Page() {
  const params = useParams<{ agencyId: string }>();
  return <LeadCaptureFormView agencyId={params?.agencyId} />;
}
