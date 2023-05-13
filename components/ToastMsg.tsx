import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from "react-native-toast-message";
import { useState, useRef } from "react";

import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, ScrollView } from "./Themed";
import { RootTabScreenProps } from "../types"
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Ionicons as Icon } from "@expo/vector-icons";

import tw from "twrnc";
import TextField from "./Textfield";
import { inputChecker } from "../static/signup";

/*
  1. Create the config
*/
export const toastConfig: ToastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#EB5757" }}
      contentContainerStyle={tw`px-15`}
      text1Style={[tw`text-lg`, { fontFamily: "tomato" }]}
      text2Style={tw`text-base`}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={[tw`text-base`, { fontFamily: "tomatoB" }]}
      text2Style={[tw`text-base text-[#71879C]`, { fontFamily: "DMB" }]}
    />
  ),

  tomatoToast: ({ text1, props }) => (
    <View style={{ height: 60, width: "100%", backgroundColor: "tomato" }}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};
