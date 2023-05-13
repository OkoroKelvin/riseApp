import React, { useState, useRef } from "react";

import { TouchableOpacity, StyleSheet } from "react-native";
import { Text, View } from "./Themed";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import Success from "../assets/images/success.svg";
import { RootStackScreenProps } from "../types";

export default function SuccessModal({
  navigation,
  route,
}: RootStackScreenProps<"SuccessModal">) {
  const { nextScreen } = route?.params;
  return (
    <View style={styles.promptModalBg}>
      <View style={styles.promptCase}>
        <Success />

        <Text style={styles.promptTitle}>
          You just created your Rise account
        </Text>
        <Text style={styles.promptSub}>
          Welcome to Rise, let's take you home
        </Text>
      </View>

      <View>
        <TouchableOpacity
          style={[styles.promptBtn]}
          onPress={() => {
            navigation.replace(nextScreen);
          }}
        >
          <Text style={[styles.btnText, { color: "white" }]}>Okay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  promptModalBg: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: wp(5),
  },
  btnText: {
    fontSize: wp(4),
    fontFamily: "DMB",
  },
  promptCase: {
    justifyContent: "center",
    alignItems: "center",
    maxWidth: wp(60),
    margin: wp(16),
  },
  promptBtn: {
    paddingVertical: wp(4),
    paddingHorizontal: wp(40),
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0898A0",
  },
  promptTitle: {
    fontSize: wp(6.5),
    fontFamily: "tomato",
    marginTop: wp(10),
    textAlign: "center",
    marginBottom: wp(5),
  },
  promptSub: {
    fontSize: wp(4.5),
    color: "#71879C",
    textAlign: "center",
  },
});
