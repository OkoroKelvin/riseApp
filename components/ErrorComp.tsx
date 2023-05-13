import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, ScrollView } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Ionicons as Icon } from "@expo/vector-icons";
import { BarIndicator } from "react-native-indicators";

import tw from "twrnc";
import TextField from "../components/Textfield";
import { inputChecker } from "../static/signup";
import Button from "./Button";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

interface ErrorNode {
  title: String;
  action: () => void;
}

export function ErrorComp({ title, action }: ErrorNode) {
  const colorScheme = useColorScheme();

  const color = Colors[colorScheme];
  return (
    <View style={tw`justify-center px-15 my-8`}>
      <View style={tw`items-center mb-4`}>
        <Icon name="alert-circle-outline" size={wp(9)} color={color.tint} />

        <Text style={tw`text-lg mt-2 text-[#71879C]`}>{title}</Text>
      </View>

      <Button
        title="Retry"
        titleColor={color.primary}
        onPress={action}
        style={{ backgroundColor: color.background2 }}
      />
    </View>
  );
}
