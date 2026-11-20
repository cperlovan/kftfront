export const instant = false;

import api from "@/lib/api";
import { ClientReviews } from "./client-reviews";

export default async function LocationReviewsPage({
  params,
}: {
  params: Promise<{ locationId: string }>;
}) {
  const { locationId } = await params;

  let reviews: any[] = [];
  try {
    const response = await api.get(`/reviews/location/${locationId}`);
    reviews = response.data || [];
  } catch {
    reviews = [];
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClientReviews locationId={locationId} initialReviews={reviews} />
      </div>
    </div>
  );
}
