import { ID, OAuthProvider, Query } from "appwrite";
import { redirect } from "react-router";
import { account, appwriteConfig, database } from "./client";

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/404`
    );
  } catch (error) {
    console.error("Error during OAuth2 session creation:", error);
  }
};

export const getUser = async () => {
  try {
    const user = await account.get();

    if (!user) return redirect("/sign-in");

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal("accountId", user.$id),
        Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),
      ]
    );
    return documents[0];
  } catch (error) {
    console.log("getUser", error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.log("logoutUser", error);
    return null;
  }
};

export const getGooglePicture = async () => {
  try {
    const session = await account.getSession("current");

    const oAuthToken = session.providerAccessToken;

    if (!oAuthToken) {
      console.log("No oAuthToken found");

      return null;
    }

    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      {
        headers: {
          Authorization: `Bearer ${oAuthToken}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to fetch user data");
      return null;
    }

    const data = await response.json();

    const imageUrl = data.photos?.[0]?.url;

    return imageUrl;
  } catch (error) {
    console.log(error);
  }
};

export const storeUserData = async () => {
  try {
    const user = await account.get();
    console.log("storeUserData ", user);

    if (!user) return null;

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", user.$id)]
    );

    if (documents.length > 0) return documents[0];

    const userData = {
      accountId: user.$id,
      name: user.name,
      email: user.email,
      imageUrl: await getGooglePicture(),
      joinedAt: new Date().toISOString(),
    };

    const response = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      userData
    );

    if (response.$id) {
      return response;
    }
  } catch (error) {
    console.log("storeUserData", error);
    return null;
  }
};

export const getExistingUser = async (id: string) => {
  try {
    // const user = await account.get();

    // console.log(id);

    if (!id) return null;

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", id)]
    );

    // console.log("doc ",documents);

    if (documents.length > 0) return documents[0];

    return null;
  } catch (error) {
    console.log("getExistingUser", error);
    return null;
  }
};

export const getAllUsers = async (limit: number, offset: number) => {
  try {
    const { documents: users, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        (Query.limit(limit), Query.offset(offset))
      ]
    );


    if (total === 0) return { users: [], total };

    return { users, total };
  } catch (error) {
    console.log("getAllUsers", error);
    return { users: [], total: 0 };
  }
};
