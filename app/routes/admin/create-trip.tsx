import { useState } from "react";
import { Combobox } from "../../components/Combobox";
import Header from "../../components/Header";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { comboBoxItems, selectItems } from "../../constants";
import { cn, formatKey } from "../../lib/utils";
import type { Route } from "./+types/create-trip";
import { account } from "../../appwrite/client";
import { useNavigate } from "react-router";

export const loader = async () => {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,latlng,flag,maps"
  );
  const countries = await response.json();

  return countries.map((country: any) => ({
    name: country.flag + country.name.common,
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps?.openStreetMap,
  }));
};

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [trip, setTrip] = useState<TripFormData>({
    country: "",
    travelStyle: "",
    interest: "",
    budget: "",
    duration: 0,
    groupType: "",
  });
  const navigate = useNavigate();

  const countries = loaderData as Country[];

  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setTrip({ ...trip, [key]: value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (
      !trip.country ||
      !trip.duration ||
      !trip.travelStyle ||
      !trip.interest ||
      !trip.budget ||
      !trip.groupType
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (trip.duration < 1 || trip.duration > 10) {
      setError("Duration must be between 1 and 10 days");
      setLoading(false);
      return;
    }

    const user = await account.get();
    if (!user.$id) {
      setError("You must be logged in to create a trip");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/create-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: trip.country,
          numberOfDays: trip.duration,
          travelStyle: trip.travelStyle,
          interests: trip.interest,
          budget: trip.budget,
          groupType: trip.groupType,
          userId: user.$id,
        }),
      });
      
      const result: CreateTripResponse = await response.json();
      
      if (result?.id) navigate("/trips/" + result.id)

      else console.log("Failed to create trip");

    } catch (error) {
      console.log("handleSubmit", error);
      return;
    } finally {
      setLoading(false);
    }

  };

  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header
        title="Add a New Trip"
        description="Create or customize your trip"
      />
      <section className="mt-2.5 wrapper-md">
        <form className="trip-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country</label>
            <Combobox
              value={trip.country}
              onChange={(value) =>
                setTrip((prev) => ({ ...prev, country: value }))
              }
              frameworks={countries}
              placeholder="Select a country"
            />
          </div>

          <div>
            <label htmlFor="duration">Duration</label>
            <Input
              type="number"
              placeholder="Duration"
              value={trip.duration === 0 ? "" : trip.duration}
              onChange={(e) =>
                setTrip((prev) => ({
                  ...prev,
                  duration: Number(e.target.value),
                }))
              }
            />
          </div>

          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{formatKey(key)}</label>
              <Combobox
                frameworks={comboBoxItems[key].map((item) => ({
                  value: item,
                }))}
                value={trip[key]}
                placeholder={`Select a ${formatKey(key)}`}
                onChange={(value) =>
                  setTrip((prev) => ({ ...prev, [key]: value }))
                }
              />
            </div>
          ))}

          <div>
            <label htmlFor="location">Location on the world map</label>
          </div>
          {error && (
            <div>
              <p className="error">{error}</p>
            </div>
          )}
          <footer className="px-6 w-full">
            <Button type="submit" disabled={loading} className="w-full">
              <img
                className={cn("size-5", loading && "animate-spin")}
                src={`/assets/icons/${
                  loading ? "loader.svg" : "magic-star.svg"
                }`}
                alt=""
              />
              <span className="p-16-semibold text-white">
                {loading ? "Creating..." : "Create Trip"}
              </span>
            </Button>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;
