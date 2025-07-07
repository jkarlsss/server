import { Query } from "appwrite";
import { appwriteConfig, database } from "./client";

export const getAllTrips = async (limit: number, offset: number) => {
  const trips = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.tripCollectionId,
    [Query.limit(limit), Query.offset(offset), Query.orderDesc("createdAt")]
  );

  if (trips.total === 0) return { trips: [], total: 0 };

  return { allTrips: trips.documents, total: trips.total };
};

export const getTripById = async (tripId: string) => {
  const trip = await database.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.tripCollectionId,
    tripId
  );

  if (!trip) {
    console.log("Trip not found");
    return null;
  }

  return trip;
};
