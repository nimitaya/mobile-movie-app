import { images } from "@/constants/images";
import { Image, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg}/>
    </View>
  );
}
