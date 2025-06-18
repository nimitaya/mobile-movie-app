# Appwrite
- für Backend Server und Database Kombination
- ein Backend as a Service (BaaS)
- neues Projekt erstellen und ID kopieren (ruhig automatisch generieren lassen)
    - in .env einfügen

## Aufsetzen
- neues Projekt in Appwrite erstellen und Plattform wählen
- dann `npx expo install react-native-appwrite react-native-url-polyfill` installieren

### Database
- im Dashboard des Projekts auf Database gehen
- neue Database erstellen
    - Database ID kopieren und in .env einfügen
- neue Collection erstellen
    - Collection ID kopieren und in .env einfügen
- in Collection Attributes erstellen, die gebraucht werden
    - in Settings noch zu Permissions gehen, damit Rechte da sind
    - dort kann man Rollen und rechte für CRUD Operationen festlegen - wer darf was

## in App
### `appwrite.ts` für Funktionalität
- innerhalb `services` Ordner erstellen
- müssen Client und Databases von Appwrite importieren
    - `import { Client, Databases } from "react-native-appwrite";`
- dann einen neuen Appwrite Client erstellen (für Verbindung)
    -const `client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);`
- und eine neue Database (Verbindung) erstellen
    - `const database = new Databases(client);`

```ts
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
```

#### Track User Searches
- öffnen try-catch Block
- müssen die Datenbank anfragen mit Appwrite Methode `.listDocuments(database, collection, [Query.equal("searchTerm", query)])`
    - erstes ist die Datenbank - brauchen ID aus Appwrite
    - zweites die Collection - brauchen ID aus Appwrite
    - drittes Aray prüft, ob die Query (von Appwrite) gleich sind
        - also der searchTerm und die vom User genutzt query (geben wir in die Funktion als Agrument)
        - Array, weil mehrere Suchoptionen möglich (Filter etc)
- falls Antwort von Datenbank größer Null (also dDokumente gefunden wurden, dass Movie schonmal gesucht wurde)
    - dann speichern wir den zuerst gefundenen Movie
    - und updaten dann ein Dokument mit Appwrite Methode .`updateDocument(database-id, collection-id, zuUpdatendeID, {key: was gemacht werden soll})`
        - in welcher Datenbnak updaten
        - in welcher Collection updaten
        - welche (Movie-)ID soll updaten
        - was genau wir anpassen wollen
- wenn keine Antwort von Datenbank, bzw. kleiner Null
    - dann erstellen wir neues Dokument mit Appwrite Methode `.createDocument(database-id, collection-id, ID.unique, {key: was gemacht werden soll})`
        - in welcher Datenbnak erstellen
        - in welcher Collection erstellen
        - eine einzigartige ID geben mit Appwrite `ID.unique`

```ts
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
```

#### Fetch Trending Movies
- die meistgesuchten Movies der User anzeigen
- Funktion gibt ein Promise mit den TrendingMovies als Array wieder oder undefined
    - TrendingMovie ist Interface, mit Array dahinter weiß TS, dass mehrere im Array kommen
- öffnen try-catch Block
- holen uns erstmal das Ergebnos aus der Datenbank und listen auf
    - `const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [ Query.limit(5), Query.orderDesc("count")]);`
        - wie oben
        - Query.limit(5) limitiert auf 5
        - Query.orderDesc("count") zeigt Ergebnisse in Absteigender Reihenfolge basierend auf dem count Field