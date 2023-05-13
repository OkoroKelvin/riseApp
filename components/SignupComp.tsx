import React, { useState, useRef } from "react";

import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { Text, View } from "../components/Themed";
import { SignUpStackScreenProps } from "../types";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Ionicons as Icon } from "@expo/vector-icons";

import DateTimePicker from "@react-native-community/datetimepicker";

import tw from "twrnc";
import TextField from "./Textfield";
import { handleTextChange, signInfo } from "../static/signup";

import Success from "../assets/images/success.svg";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import DateModal from "./DateModal";
import { usePost } from "../services/queries";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "./Button";

export function SignUpInfo({
  navigation,
  route,
}: SignUpStackScreenProps<"SignUpInfo">) {
  // Credential states
  const { email, password } = route?.params;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [Nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());

  // Date picker
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [dateModal, setDateModal] = useState(false);

  // Success Prompt
  const [successModal, setSuccessModal] = useState(false);

  const phoneInput = useRef<PhoneInput>(null);

  const today = new Date();
  const colorScheme = useColorScheme();

  const datePicked = new Date(dateOfBirth)
    .toISOString()
    .replace(/T.*/, "")
    .split("-")
    .reverse()
    .join("-");

  function handleNav() {
    navigation.navigate("SignUpScreen");
  }

  const onChange = (event: any, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate || dateOfBirth;
    if (Platform.OS === "android") {
      setIsPickerShow(false);
    }
    setDateOfBirth(currentDate);
  };

  async function handleSuccess(data: any) {
    navigation.navigate("SuccessModal", {
      btnTitle: "Okay",
      title: "You just created your Rise account",
      sub: "Welcome to Rise, let's take you home",
      nextScreen: "SignIn",
    });
  }

  function handleError(error: Error) {
    const toast = () =>
      Toast.show({
        type: "error",
        text1: "SigUp Error",
        text2: error.message,
        topOffset: 50,
        visibilityTime: 5000,
      });

    toast();
  }

  const { isLoading, mutate: handleSignUp } = usePost({
    url: "/users",
    payload: {
      first_name: firstName,
      last_name: lastName,
      email_address: email,
      username: Nickname,
      password: password,
      date_of_birth: dateOfBirth,
      phone_number: phoneNumber,
    },
    onSuccess: (data) => handleSuccess(data),
    onError: (error) => handleError(error),
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={tw`mt-10 mb-5`}>
        <Text style={styles.title}>Tell Us More About You</Text>
        <Text style={styles.sub}>
          Please use your name as it appears on your ID.
        </Text>
      </View>

      <View>
        {signInfo.map((res, idx) => {
          const value =
            idx === 0
              ? firstName
              : idx == 1
              ? lastName
              : idx === 2
              ? Nickname
              : undefined;
          return (
            <View style={tw`mt-4`} key={idx}>
              <TextField
                value={value}
                label={res.title}
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                enablesReturnKeyAutomatically={true}
                blurOnSubmit={false}
                onChangeText={(text) => {
                  handleTextChange({
                    text,
                    idx,
                    stateFunctions: {
                      setFirstName,
                      setLastName,
                      setNickname,
                    },
                  });
                }}
              />
            </View>
          );
        })}

        <View style={[styles.phoneCase]}>
          <View
            style={[
              styles.phoneBg,
              { backgroundColor: Colors[colorScheme].background },
            ]}
          >
            <Text style={styles.phoneText}>Phone number</Text>
          </View>

          <PhoneInput
            ref={phoneInput}
            defaultValue={phoneNumber}
            defaultCode="NG"
            layout="first"
            textContainerStyle={{
              backgroundColor: Colors[colorScheme].background,
            }}
            countryPickerButtonStyle={{
              backgroundColor: Colors[colorScheme].background,
            }}
            codeTextStyle={{ color: Colors[colorScheme].text }}
            textInputStyle={{ color: Colors[colorScheme].text }}
            onChangeText={(text) => {
              setPhoneNumber(text);
            }}
            onChangeFormattedText={(text) => {
              //   setFormattedValue(text);
            }}
            // withDarkTheme
            // withShadow
            // autoFocus
          />
        </View>

        {/* Date of Birth */}

        <TouchableOpacity
          style={[styles.phoneCase]}
          onPress={() => {
            Platform.OS === "android"
              ? setIsPickerShow(true)
              : setDateModal(true);
          }}
        >
          <View
            style={[
              styles.phoneBg,
              { backgroundColor: Colors[colorScheme].background },
            ]}
          >
            <Text style={styles.phoneText}>Date of Birth</Text>
          </View>

          <View style={styles.dateCase}>
            <Text style={styles.selectedDate}>
              {today.getTime() === dateOfBirth.getTime()
                ? "Choose date"
                : datePicked}
            </Text>
            <Icon name={"calendar-outline"} color="#0898A0" size={wp(5.5)} />
          </View>

          {isPickerShow && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateOfBirth}
              mode={"date"}
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChange}
              style={{ display: "none" }}
            />
          )}

          <DateModal
            open={dateModal}
            setOpen={setDateModal}
            date={dateOfBirth}
            onChange={onChange}
          />
        </TouchableOpacity>
      </View>

      <View style={tw`mt-10`}>
        <Button
          title="Sign In"
          isLoading={isLoading}
          style={
            firstName && lastName && phoneNumber
              ? tw`opacity-100`
              : tw`opacity-50`
          }
          disabled={
            firstName && lastName && phoneNumber && !isLoading ? false : true
          }
          onPress={() => {
            handleSignUp();
          }}
        />
      </View>

      <View style={tw`mb-6`}>
        <Text style={styles.agree}>
          By clicking Continue, you agree to our
          <Text style={styles.terms}> Terms of Service </Text>
          and <Text style={styles.terms}>Privacy Policy.</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  title: {
    fontSize: wp(5.8),
    fontFamily: "tomato",
  },
  sub: {
    fontSize: wp(4),
    color: "#71879C",
    marginTop: wp(1),
  },
  textCase: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E1E8ED",
    borderRadius: 8,
    marginVertical: wp(2),
  },
  textInput: {
    flex: 1,
    padding: wp(4),
    fontFamily: "DMB",
    color: "#222222",
    fontSize: wp(3.8),
  },
  reqText: {
    fontSize: wp(3.8),
  },
  phoneCase: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: wp(2),
    borderColor: "#0898A0",
    marginTop: wp(3.9),
  },
  phoneBg: {
    backgroundColor: "white",
    paddingHorizontal: wp(2),
    marginTop: -wp(2),
    width: wp(23),
  },
  phoneText: {
    fontSize: wp(3),
    fontFamily: "DMB",
    color: "#0898A0",
  },
  btn: {
    padding: wp(3),
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0898A0",
  },
  btnText: {
    fontSize: wp(4),
    fontFamily: "DMB",
  },
  dateCase: {
    flexDirection: "row",
    marginVertical: wp(2.5),
    alignItems: "center",
  },
  selectedDate: {
    flex: 1,
    fontSize: wp(3.5),
    marginLeft: wp(4),
    fontFamily: "DMB",
  },
  agree: {
    textAlign: "center",
    alignSelf: "center",
    marginTop: wp(8),
    fontSize: wp(3.5),
    maxWidth: wp(60),
  },
  terms: {
    color: "#0898A0",
  },
  promptModalBg: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: wp(5),
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
