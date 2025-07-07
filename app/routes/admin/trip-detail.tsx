import type { LoaderFunctionArgs } from "react-router";
import { getAllTrips, getTripById } from "../../appwrite/trips";
import Header from "../../components/Header";
import TripCard from "../../components/TripCard";
import { Badge } from "../../components/ui/badge";
import { cn, parseTripData } from "../../lib/utils";
import type { Route } from "./+types/trip-detail";
import InfoPill from "../../components/InfoPill";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { tripId } = params;

  if (!tripId) throw new Error("Trip not found");

  const [trip, trips] = await Promise.all([
    getTripById(tripId),
    getAllTrips(4, 0),
  ]);

  return {
    trip,
    allTrips: trips.allTrips?.map(({ $id, tripDetail, imagesUrls }) => ({
      ...parseTripData(tripDetail),
      id: $id,
      imageUrls: imagesUrls ?? [],
    })),
  };
};

export function HydrateFallback() {
  return (
    <p className="h-screen flex items-center justify-center">Loading Game...</p>
  );
}

const TripDetail = ({ loaderData }: Route.ComponentProps) => {
  const { trip, allTrips } = loaderData as unknown as {
    trip: {
      tripDetail: string;
      imagesUrls: string[];
    };
    allTrips: Trip[];
  };

  const {
    name,
    country,
    duration,
    itinerary,
    travelStyle,
    interests,
    budget,
    groupType,
    estimatedPrice,
    description,
    bestTimeToVisit,
    weatherInfo,
  } = parseTripData(trip.tripDetail);

  const imagesUrls = trip.imagesUrls;

  const pillItems = [
    {
      text: travelStyle,
      bg: "!bg-pink-50 !text-pink-500",
    },
    {
      text: groupType,
      bg: "!bg-blue-50 !text-blue-500",
    },
    {
      text: budget,
      bg: "!bg-green-50 !text-green-500",
    },
    {
      text: interests,
      bg: "!bg-violet-50 !text-violet-500",
    },
  ];

  const visitTimeAndWeatherInfo = [
    {
      title: "Best Time to Visit",
      items: bestTimeToVisit,
    },
    {
      title: "Weather Info",
      items: weatherInfo,
    },
  ];

  return (
    <main className="travel-detail wrapper">
      <Header
        title="Trip Detail"
        description="View and edit AI-generated travel plans"
      />
      <section className="container wrapper-md">
        <header>
          <h1 className="p-40-semibold">{name}</h1>
          <div className="flex items-center gap-5">
            <InfoPill
              text={`${duration} day plan`}
              image="/assets/icons/calendar.svg"
            />
            <InfoPill
              text={itinerary
                ?.slice(0, 2)
                .map((item) => item.location)
                .join(", ")}
              image="/assets/icons/calendar.svg"
            />
          </div>
        </header>
        <section className="gallery">
          {imagesUrls.map((image, index) => (
            <img
              src={image}
              alt={name}
              key={index}
              className={cn(
                "size-full rounded-xl object-cover",
                index === 0
                  ? "md:col-span-2 md:row-span-2 h-[330px]"
                  : "md:row-span-1 h-[150px]"
              )}
            />
          ))}
        </section>
        <section className="flex gap-3 md:gap-5 items-center flex-wrap">
          {pillItems.map((item, index) => (
            <Badge key={index} className={item.bg}>
              {item.text}
            </Badge>
          ))}

          <ul className="flex gap-1 items-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index}>
                <img src="/assets/icons/star.svg" alt="star" />
              </li>
            ))}
            <li className="ml-1">
              <Badge className="bg-yellow-50 text-yellow-700">4.9/5</Badge>
            </li>
          </ul>
        </section>
        <section className="title">
          <article>
            <h3>
              {duration}-Day {country} {travelStyle} Trip
            </h3>
          </article>
          <h2>{estimatedPrice}</h2>
        </section>
        <p className="text-sm md:text-lg font-normal text-dark-400">
          {description}
        </p>
        <ul className="itinerary">
          {itinerary?.map((dayPlan: DayPlan, index: number) => (
            <li key={index}>
              <h3>
                Day {dayPlan.day}: {dayPlan.location}
              </h3>
              <ul>
                {dayPlan.activities.map((activity: Activity, index: number) => (
                  <li key={index}>
                    <span className="flex-shrink-0 p-18-semibold mt-2">
                      {activity.time}
                    </span>
                    <p className="flex-grow">{activity.description}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {visitTimeAndWeatherInfo.map((section) => (
          <section key={section.title} className="visit">
            <div>
              <h3>{section.title}</h3>
              <ul>
                {section.items.map((item, index) => (
                  <li key={index}>
                    <p className="flex-grow">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </section>
      <section className="flex flex-col gap-6">
        <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>
        <div className="trip-grid">
          {allTrips.map(
            ({
              id,
              name,
              itinerary,
              imageUrls,
              travelStyle,
              estimatedPrice,
            }) => (
              <TripCard
                key={id + name}
                id={id}
                name={name}
                location={itinerary.map((item) => item.location).join(", ")}
                imageUrl={imageUrls[0] ?? ""}
                tags={[interests, travelStyle]}
                price={estimatedPrice}
              />
            )
          )}
        </div>
      </section>
    </main>
  );
};

export default TripDetail;
