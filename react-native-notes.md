# React Native

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
    - `scheme` ist für Links/ Routing
    - `userInterfaceStyle` Dark oder Lightmode 
    - `newArchEnabled` sollte true, für neue tolle React Native Sachen
    - ios und android und web spezifische Einstellungen

### scripts Folder
- Project Reset zu minimalem Code

### app folder
- hier kommen verschiedene Screens hin
- index.tsx ist Grundlage


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