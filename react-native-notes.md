# React Native

https://colorhunt.co/palette/5f0f40fb8b24e364149a031e
https://colorhunt.co/palette/22092c872341be3144f05941

## Infos über Dateien

### Root Folder

#### tsconfig.json
- wie TypeScript die Typen sicherstellt
- Konfigurationen über die Typen Zuordnung etc

#### app.json
- wird auch app config genannt
- Einstellungen für die gesamte App
- ändern das Verhalten des Projekts
- expo Objekt ist root
- man kann hier ändern
    - Name der App
    - `slug` = unique Identifier für Expo
    - Orientation (Portrait or Landscape)
    - App-Icon
        - bei Android ist es `"foregroundImage"`
        - bei Web `"favicon"`
        - und auch unter expo-splash-screen
    - `scheme` ist für Links/ Routing
    - `userInterfaceStyle` Dark oder Lightmode 
    - `newArchEnabled` sollte true, für neue tolle React Native Sachen
    - ios und android und web spezifische Einstellungen

### scripts Folder
- Project Reset zu minimalem Code

### app folder
- hier kommen verschiedene Screens hin
- index.tsx ist Grundlage

### components Folder
- wie in React auch einen separaten Components Folder im Root erstellen
- die Logik für Funktionen sollte im Parent Component sein, nicht in der reusable Componente selbst, wie Search-Bar

### services Folder
- für API Nutzung und so
- hier im Beispiel für die Movie Database

---

## React Native
- Pages werden Screens genannt
- für jede Routen-Ordner können wir neue _layout.tsx für spezifisches Design machen
- es darf nur **eine** `index.tsx` geben
    - können die aber auch in einen Ordner schieben, wenn wir wollen

### Routing

#### Einfache Routen
- alle Dateien in dem app Ordner
- index.tsx ist der Home Screen
- neue Datei erstellen mit Shortcut `rnfe` oder `rnfes`
    - React Native Functional Export component with Styles
- innerhalb Index oder wo wir brauchen Link Komponente erstellen
    - `import { Link } from "expo-router";`
    - `<Link href="/onboarding">Onboarding</Link>`

#### Dynamische Routen
- innerhalb app Ordner einen Ordner erstellen
- Dateiname muss dann `[]` `[fileName].tsx` haben
- innerhalb Datei holen wir die Params mit 
    - `import { useLocalSearchParams } from "expo-router";`
    - `const { id } = useLocalSearchParams();`

#### Gruppierte Routen
- innerhalb app Ordner einen Ordner erstellen mit `()` und Name darin
    - `(directoryName)`
- für jede Routen-Ordner können wir neue `_layout.tsx` für spezifisches Design machen
    - da dann eine Komponente erstellen
- layout in tabs beeinflusst die Seiten, innerhalb tabs
- layout in app beeinflusst die Gruppen-Router
- mit der `<Tabs></Tabs>` Komponente können wir unten automatisch kleine Navigation erstellen
    - kann man bearbeiten und anpassen

#### Eigene Routen / ==HOOKS==
- mit Router von Expo
    - `import { useRouter } from "expo-router";`
- innerhalb Return Statement
    - `const router = useRouter();`


### Components
#### Nützliche Components
- <View></View>
    - wie <div></div>
- <Text></Text>
    - alles Text-Elemente, hat Props
    - `numberOfLines` = kann auf bestimmte Zeilenanzahl verkürzen automatisch
    - `numberOfLines={1}`
- <Image/>
    - mit nützlichen Props
- `<ScrollView></ScrollView>`
    - Prop geben, um Scrollbar an der Seite zu verstecken
    - `showsVerticalScrollIndicator={false}`
- `<ActivityIndicator/>`
- `<FlatList />` von React Native
    - `data` = welche Daten will ich haben
    - `renderItem` = wie soll es die Daten anzeigen
        - wie .map Method
    - `keyExtractor` = damit React Native weiß, wie viele Elements da sind und wo sie positioniert sind
        - .map method für jedes Item und nehmen id als String
    - `numColumns` = Nummer der Spalten
    - `columnWrapperStyle` = Style für die Spalten 
        - `columnWrapperStyle={{ justifyContent: "flex-start", gap: 20, paddingRight: 5, marginBottom:10 }}`
    - `scrollEnabled` = ob Scroll aktiv oder nicht - brauchen wir nicht, wenn eh schon innerhalb <ScrollView></ScrollView>
- <Link></Link>
    - href = der Pfad wohin
    - asChild bedeutet, dass die Kind-Komponente da drin nur cklickable ist
- <TouchableOpacity><>


#### Eigene Components
- wie in React auch einen separaten Components Folder im Root erstellen
- die Logik für Funktionen sollte im Parent Component sein, nicht in der reusable Componente selbst, wie Search-Bar
- wir holen Props von Eltern Komponente
    - müssen das für TS aber noch konkret mit einem Interface definieren
    - oberhalb des Returns
    - die Funktion ist optional und gibt nichts zurück
    
```ts
interface Props {
    placeholder: string;
    onPress?: () => void;
}
```

##### Props in Components
- wenn mit .map methode in `renderItem={({ item }) => ( )}` etwas dynamisch machen möchten
- spreaden alle Daten des Items aus
    - `{...item}` und geben das Component als Props
    - innerhalb der Component suchen wir uns dann das raus, was wir brauchen

```jsx
// in index.tsx
<FlatList
    data={movies}
    renderItem={({ item }) => (
      <MovieCard
      {...item}
    /> )}
/>

// in MovieCard.tsx Component
const MovieCard = ({id, poster_path, title, vote_average, release_date}: Movie) => {
  return (
    <Link href={`/movies/${id}`} asChild>
        <TouchableOpacity className='w-[30%]'>
            <Image 
            source={{uri: poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : "https://placehold.co/600x400/1a1a1a/ffffff.png"}} className='w-full h-52 rounded-lg' resizeMode='cover' />
            <Text className="text-sm font-bold text-white mt-2">{title}</Text>
        </TouchableOpacity>
    </Link>
  )
}
export default MovieCard
```

### API Connection
- neuer Ordner `services`
- Datei api.ts
- machen eine reusable API Configuration
    - mit einer Base URL
    - em API Key
    - und `headers` mit
        - `accept` welche Daten akzeptiert werden
        - `Authorization` wie autorisieren, mit API Key
- fetchMovies mit asynchroner Funktion und Typ der Query nicht vergessen

**Allgemeine fetchPopularMovies:**
```ts
export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    // which data shall be accepted
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchPopularMovies = async ({ query }: { query: string }) => {
  const endpoint = "/discover/movie?sort_by=popularity.desc";
  // Sortierungsfunktion/ query von TMDB

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies", response.statusText);
    // additional information in the Status Text
  }

  const data = await response.json();

  return data.results;
};
```

**Reusable mit Query**
```ts
export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    // which data shall be accepted
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;
  // wenn query, such danach (mit encoded Version, falls komische Zeichen), sonst Sortierungsfunktion/ query von TMDB

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies", response.statusText);
    // additional information in the Status Text
  }

  const data = await response.json();

  return data.results;
};
``` 

### Custom Hooks
- können custom Hooks erstellen, um uns nicht zu oft zu wiederholen
- mit einem useFetch, können wir fetchMovies, fetchMovieDetails etc. aufrufen
- erstellen eine Hook-Funktion, der wir eine andere Funktion als Argument geben
    - useFetch(fetchMovies), useFetch(fetchMovieDetails)
    - Argument-Function ist generic Type `<T>`, generci Function, damit wir später die spezifischen Typen weitergeben können
    - `const useFetch = <T>(fetchFunction: ()=> Promise<T>, autoFetch = true) => {}`
- können gewohnt mit `useState` von React arbeiten
- nutzen useEffect um Funktion zum Start zu rufen
- alle Hooks müssen etwas returnen, daher geben wir einige Sachen wieder
    - `return { data, loading, error, refetch: fetchData, reset };`

```ts
import { useEffect, useState } from "react";

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction();
      setData(result);
    } catch (error) {
      // @ts-ignore
      setError(error instanceof Error ? error : new Error("An error occurred"));
    } finally {
      // wird ausgeführt, wenn entweder try succeeds or cath finishes
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);

  // alle Hooks müssen was returnen
  return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
```

- können diesen Hook dann innerhalb index.tsx nutzen
- kombinieren dafür den Hook und unsere fetchMovies Funktionen
    - destructure die data, loading und error States
    - nutzen unten in Komponente dann, um zu zeigen
    - noch oberhalb Return Statement

```ts
const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));
  // destructure states of data, loading, error and rename into movies, moviesLoading, moviesError
  // nutzen useFetch Hook und dann die fetchMovies Function with empty query
```


---

## Frameworks/ Packages
- `npm install nativewind tailwindcss react-native-reanimated react-native-safe-area-context`
- NativeWind --> für Tailwind
    - `npx tailwindcss init`
    - `tailwind.config.js` anpassen
        - `content: ["./app/**/*.{js,jsx,ts,tsx}"],`
    - in app Ordner global.css erstellen
    - https://www.nativewind.dev/docs/getting-started/installation
    - babel.config.js in Root erstellen
    - Create or modify your metro.config.js
        - mit `npx expo customize metro.config.js`
        - Pfad ggf. anpassen (im Beispiel ist in `./app/global.css`)
    - innerhalb app Ordner in `_layout.tsx` dann `global.css` importieren
    - in Root `nativewind-env.d.ts` erstellen
        - Einstellung für TS `/// <reference types="nativewind/types" />`
- TailwindCss
- React Native Reanimated
- React Native Safe Area Context
- --> die vier brauchen wir zusammen für Styling

### more to Tailwind Configuration
- wenn wir Tailwind auch in anderen Orten, als nur dem app Ordner anwenden wollen, müssen wir in der config was ändern!
    - fügen auch component Ordner hinzu
    - `content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],`
- innerhalb `tailwind.config.js` in theme, in extend
```js
theme: {
    extend: {
      colors: {
        primary: "#FB8B24",
        accent: "#9A031E",
        secondary: "#E36414",
        background: "#5F0F40",
        light: {
          100: "#FB8B24"
        },
        dark: {
          100: "#5F0F40"
        }
      }
    },
  },
```