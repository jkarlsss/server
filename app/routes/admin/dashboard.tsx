import { getAllUsers, getUser } from "../../appwrite/auth";
import {
  getTripsByTravelStyle,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "../../appwrite/dashboard";
import { getAllTrips } from "../../appwrite/trips";
import { BarChartData } from "../../components/bar-chart";
import Header from "../../components/Header";
import StatsCard from "../../components/StatsCard";
import TripCard from "../../components/TripCard";
import type { Route } from "./+types/dashboard";

export const clientLoader = async () => {
  const [
    user,
    dashboardStats,
    trips,
    userGrowthPerDay,
    tripsByTravelStyle,
    allUsers,
  ] = await Promise.all([
    getUser(),
    getUsersAndTripsStats(),
    getAllTrips(4, 0),
    getUserGrowthPerDay(),
    getTripsByTravelStyle(),
    getAllUsers(4, 0),
  ]);

  const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
    imageUrl: user.imageUrl,
    name: user.name,
    count: user.itineraryCount,
  }));

  return {
    user,
    dashboardStats,
    mappedUsers,
    userGrowthPerDay,
    tripsByTravelStyle,
    allTrips: trips.allTrips?.map(({ $id, tripDetail, imagesUrls }) => ({
      ...JSON.parse(tripDetail),
      id: $id,
      imageUrls: imagesUrls ?? [],
    })),
  };
};

const dashboard = ({ loaderData }: Route.ComponentProps) => {
  console.log(loaderData);

  const { user, dashboardStats, allTrips, userGrowthPerDay } = loaderData as {
    user: User | null;
    dashboardStats: DashboardStats;
    allTrips: Trip[];
    userGrowthPerDay: { count: number; day: string }[];
  };
  const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole } =
    dashboardStats;
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
            currentMonthCount={usersJoined.currentMonth}
            lastMonthCount={usersJoined.lastMonth}
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
        <h1 className="text-xl font-semibold text-dark-100 mb-4">
          Created Trips
        </h1>
        <div className="trip-grid">
          {allTrips.map(
            ({
              id,
              name,
              imageUrls,
              itinerary,
              travelStyle,
              interests,
              estimatedPrice,
            }) => (
              <TripCard
                key={id}
                id={id.toString()}
                name={name}
                imageUrl={imageUrls[0]}
                location={itinerary?.[0]?.location ?? ""}
                tags={[interests, travelStyle]}
                price={estimatedPrice}
              />
            )
          )}
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BarChartData userGrowth={userGrowthPerDay} />
      </section>
    </main>
  );
};

export default dashboard;
