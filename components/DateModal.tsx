import React, { useState, useRef } from "react";

import { TouchableOpacity, Platform, Modal } from "react-native";
import { Text, View } from "../components/Themed";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import DateTimePicker from "@react-native-community/datetimepicker";

import tw from "twrnc";

import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";

// DatePicker modal ios

interface DateModalNode {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  date: Date;
  minDate?:Date
  onChange: (event: any, selectedDate: any) => void;
}

const DateModal: React.FC<DateModalNode> = ({
  open,
  setOpen,
  date,
  minDate,
  onChange,
}) => {
  const colorScheme = useColorScheme();

  const closeModal = () => {
    setOpen(!open);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={closeModal}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={tw`flex-1 justify-center px-7 bg-[rgba(0,0,0,0.5)]`}
        onPress={closeModal}
      >
        <View
          style={{
            backgroundColor: Colors[colorScheme].background,
            borderRadius: wp(8),
          }}
        >
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            minimumDate={minDate}
            mode={"date"}
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChange}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            tw`px-20 py-3 rounded-lg mb-5 mt-5 items-center`,
            { backgroundColor: "#0898A0" },
          ]}
          onPress={() => {
            setOpen(!open);
          }}
        >
          <Text style={{ color: "white", fontSize: wp(4), fontFamily: "DMB" }}>
            Done
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default DateModal