import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return <Stack >
    <Stack.Screen name="(tabs)" options={{headerShown: false}} />
    <Stack.Screen name="(tabs)/profile" options={{title: "Profile"}} />
    <Stack.Screen name="(tabs)/saved" options={{title: "Saved"}} />
    <Stack.Screen name="movies/[id]" options={{headerShown: false}} />
  </Stack>;
}
