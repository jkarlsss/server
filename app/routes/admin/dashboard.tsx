import { getUser } from "../../appwrite/auth";
import Header from "../../components/Header";
import StatsCard from "../../components/StatsCard";
import TripCard from "../../components/TripCard";
import type { Route } from "./+types/dashboard";

const dashboardStats = {
  totalUsers: 12450,
  userJoined: {
    currentMonth: 1245,
    lastMonth: 1245,
  },
  totalTrips: 3210,
  tripsCreated: { currentMonth: 32, lastMonth: 345 },
  userRole: { total: 62, currentMonth: 25, lastMonth: 12 },
};

const Alltrips = [
  {
    id: "1",
    name: "Trip to Lagos",
    imageUrls: ["/assets/images/sample.jpeg"],
    itinerary: [{ location: "New York" }],
    tags: ["Adventure", "Culture", "Relaxation"],
    travelStyle: "Solo",
    estimatedPrice: "$1,000",
  },
  {
    id: "2",
    name: "Trip to Lagos",
    imageUrls: ["/assets/images/sample.jpeg"],
    itinerary: [{ location: "New York" }],
    tags: ["Adventure", "Culture", "Relaxation"],
    travelStyle: "Solo",
    estimatedPrice: "$1,000",
  },
  {
    id: "3",
    name: "Trip to Lagos",
    imageUrls: ["/assets/images/sample.jpeg"],
    itinerary: [{ location: "New York" }],
    tags: ["Adventure", "Culture", "Relaxation"],
    travelStyle: "Solo",
    estimatedPrice: "$1,000",
  },
  {
    id: "4",
    name: "Trip to Lagos",
    imageUrls: ["/assets/images/sample.jpeg"],
    itinerary: [{ location: "New York" }],
    tags: ["Adventure", "Culture", "Relaxation"],
    travelStyle: "Solo",
    estimatedPrice: "$1,000",
  },
];

export const clientLoader = async () => await getUser();

const dashboard = ({ loaderData } : Route.ComponentProps ) => {
  const { totalUsers, userJoined, totalTrips, tripsCreated, userRole } =
    dashboardStats;

  const user = loaderData as User | null;

  return (
    <main className="all-users wrapper">
      <Header
        title={`Welcome ${user?.name || "John Doe"}`}
        description="Track Activity trends in real time"
      />
      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsCard
            headerTitle="Total Users"
            total={totalUsers}
            currentMonthCount={userJoined.currentMonth}
            lastMonthCount={userJoined.lastMonth}
          />
          <StatsCard
            headerTitle="Total Trips"
            total={totalTrips}
            currentMonthCount={tripsCreated.currentMonth}
            lastMonthCount={tripsCreated.lastMonth}
          />
          <StatsCard
            headerTitle="Active Users"
            total={userRole.total}
            currentMonthCount={userRole.currentMonth}
            lastMonthCount={userRole.lastMonth}
          />
        </div>
      </section>
      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>
        <div className="trip-grid">
          {Alltrips.slice(0, 4).map(
            ({ id, name, imageUrls, itinerary, tags, estimatedPrice }) => (
              <TripCard
                key={id}
                id={id.toString()}
                name={name}
                imageUrl={imageUrls[0]}
                location={itinerary?.[0]?.location ?? ""}
                tags={tags}
                price={estimatedPrice}
              />
            )
          )}
        </div>
      </section>
    </main>
  );
};

export default dashboard;
