import { Client, Databases, ID, Query } from "react-native-appwrite";

// get information from .env
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
// ! für TS, sodass es weiß, dass der Wert da sein wird. TS weiß nicht, was in .env ist und würde sonst meckern
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

// Ist ein Appwrite Client von react-native-appwrite
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

// set up DataBase instance from appwrite
const database = new Databases(client);

// track searches made by a user
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    // check if a record of that search has already been stored
    // if already searched for, we get > 0, so update the count
    // if a document is found, increment the searchCount field
    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        { count: existingMovie.count + 1 }
      );
    } else {
      // if no user searched for this before, create new
      // if no document is found, create a new document in Appwrite Database
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Fetch most searched Movies
export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5), 
    // nur 5 Ergebnisse
      Query.orderDesc("count"),
    // Absteigende Reihenfolge basierend auf count Field
    ]);

    return result.documents as unknown as TrendingMovie[]
    // Explanation for TS mit Interface
    } catch (error) {
        console.log(error)
        return undefined
    }
}