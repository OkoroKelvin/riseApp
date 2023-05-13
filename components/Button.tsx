import { useState, useRef } from "react";

import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, ScrollView } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Ionicons as Icon } from "@expo/vector-icons";
import { BarIndicator } from "react-native-indicators";

import tw from "twrnc";
import TextField from "../components/Textfield";
import { inputChecker } from "../static/signup";

type Props = React.ComponentProps<typeof TouchableOpacity> & {
  title?: string;
  titleSize?: number;
  titleColor?: string;
  isLoading?: Boolean;
};

const Button: React.FC<Props> = (props) => {
  const { title, titleSize, titleColor, isLoading, style, ...restOfProps } =
    props;
  return (
    <TouchableOpacity style={[styles.btn, style]} {...restOfProps}>
      {isLoading ? (
        <BarIndicator color="white" size={wp(5.5)} count={5}  />
      ) : (
        <Text
          style={{
            fontFamily: "DMB",
            color: titleColor ? titleColor : "white",
            fontSize: titleSize ? titleSize : wp(4),
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: wp(3.5),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0898A0",
    borderRadius: 8,
  },
  btnText: {},
});

export default Button;
