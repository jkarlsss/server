import { useSearchParams, type LoaderFunctionArgs } from "react-router";
import { getAllTrips } from "../../appwrite/trips";
import Header from "../../components/Header";
import TripCard from "../../components/TripCard";
import type { Route } from "./+types/trips";
import { PaginationCards } from "../../components/pagination-cards";

const limit = 8;
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");

  const offset = (page - 1) * limit;

  const response = await getAllTrips(limit, offset);

  if (response.total === 0) {
    return {
      allTrips: [],
      total: 0,
    };
  }

  return {
    allTrips: response.allTrips?.map(({ $id, tripDetail, imagesUrls }) => ({
      ...JSON.parse(tripDetail),
      id: $id,
      imageUrls: imagesUrls ?? [],
    })),
    total: response.total,
  };
};

export function HydrateFallback() {
  return (
    <p className="h-screen flex items-center justify-center">Loading Game...</p>
  );
}

const trips = ({ loaderData }: Route.ComponentProps) => {

  const trips = loaderData.allTrips as Trip[] | [];


  return (
    <main className="all-users wrapper">
      <Header
        title="Trips"
        description="View and edit AI-generated travel plans"
        ctaText="Create Trip"
        ctaUrl="/trips/create"
      />

      <section>
        <h1 className="p-24-semibold mb-2">Manage Created Trips</h1>
        <div className="trip-grid">
          {trips.map(
            ({
              id,
              name,
              estimatedPrice,
              imageUrls,
              interests,
              travelStyle,
              itinerary,
            }) => (
              <TripCard
                key={id}
                name={name}
                imageUrl={imageUrls[0]}
                id={id}
                location={itinerary[0].location}
                tags={[interests, travelStyle]}
                price={estimatedPrice}
              />
            )
          )}
        </div>
        <PaginationCards totalPages={Math.ceil(loaderData.total / limit)} />
      </section>
    </main>
  );
};

export default trips;
