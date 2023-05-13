import { useState, useRef, FC } from "react";

import { Platform } from "react-native";
import { Text, View, ScrollView } from "../components/Themed";
import {
  PlanParamList,
  PlanStackScreenProps,
  RootStackScreenProps,
} from "../types";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import * as Progress from "react-native-progress";

import { Ionicons as Icon } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import tw from "twrnc";
import Button from "../components/Button";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { TopNav } from "./TopNav";
import Carousel from "react-native-snap-carousel";
import {
  handleTextChangeP,
  incomeNode,
  incomeValues,
} from "../static/createPlan";
import DateTimePicker from "@react-native-community/datetimepicker";

import TextField from "./Textfield";
import DateModal from "./DateModal";

// Chart dependencies
import {
  SlideAreaChart,
  SlideBarChart,
  SlideBarChartProps,
  SlideAreaChartProps,
  YAxisProps,
  XAxisProps,
  XAxisLabelAlignment,
  YAxisLabelAlignment,
  CursorProps,
  ToolTipProps,
  ToolTipTextRenderersInput,
  GradientProps,
} from "react-native-slide-charts";
import { useGetMutation, usePost } from "../services/queries";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UseMutateFunction } from "react-query";
import { AxiosResponse } from "axios";
import { useRoute } from "@react-navigation/native";

export function PlanInfo({ navigation }: PlanStackScreenProps<"PlanInfo">) {
  // states
  const [active, setActive] = useState(0);
  const [planName, setPlanName] = useState("");
  const [planAmount, setPlanAmount] = useState("");
  const [planDate, setPlanDate] = useState(new Date());

  const colorScheme = useColorScheme();

  const color = Colors[colorScheme];
  const ref = useRef<Carousel<incomeNode>>(null);

  const navTitle =
    active === 0
      ? "Goal name"
      : active === 1
      ? "Target amount"
      : active === 2
      ? "Target date"
      : undefined;

  const questionNo = active + 1;

  const progress =
    active === 0 ? 0.3 : active === 1 ? 0.7 : active === 2 ? 1 : 0;

  // functions

  function handlePrev() {
    active === 0 ? navigation.goBack() : ref.current?.snapToItem(active - 1);
  }

  function handleNext(index: number) {
    ref.current?.snapToItem(index + 1);
  }

  function handleSuccess(data: any) {
    console.log(data);

    navigation.navigate("PlanReview", {
      planName,
      planDate,
      planAmount,
      planProj: data,
    });
  }

  function handleError(error: Error) {
    const toast = () =>
      Toast.show({
        type: "error",
        text1: "Plan Error",
        text2: error.message,
        visibilityTime: 5000,
      });

    toast();
  }

  // Requests

  const { isLoading, mutate: handlePlan } = useGetMutation({
    url: "/plans/projection",
    payload: {
      monthly_investment: planAmount,
      maturity_date: planDate,
    },
    onSuccess: (data) => handleSuccess(data),
    onError: (error) => handleError(error),
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1 px-5`}>
      <TopNav title={navTitle} style={tw`mt-3`} action={handlePrev} />

      <View>
        <Text style={tw`text-[#71879C] text-base mt-8 mb-5`}>
          Question {questionNo} of 3
        </Text>

        <Progress.Bar
          progress={progress}
          width={wp(90)}
          color={color.primary}
          unfilledColor="rgba(113,135,156,0.1)"
          borderWidth={0}
          height={wp(2)}
          borderRadius={wp(4)}
        />
      </View>

      <Toast />

      <Carousel
        ref={ref}
        data={incomeValues}
        scrollEnabled={false}
        decelerationRate="fast"
        renderItem={(item) => (
          <RenderComp
            planName={planName}
            planAmount={planAmount}
            planDate={planDate}
            isLoading={isLoading}
            setPlanName={setPlanName}
            setPlanAmount={setPlanAmount}
            setPlanDate={setPlanDate}
            handleNext={handleNext}
            handlePlan={handlePlan}
            {...item}
          />
        )}
        sliderWidth={wp(90)}
        itemWidth={wp(90)}
        onSnapToItem={(idx) => {
          setActive(idx);
        }}
      />
    </ScrollView>
  );
}

interface RenderNode {
  item: any;
  index: number;
  planName: string;
  planAmount: string;
  planDate: Date;
  isLoading: Boolean;
  setPlanName: React.Dispatch<React.SetStateAction<string>>;
  setPlanAmount: React.Dispatch<React.SetStateAction<string>>;
  setPlanDate: React.Dispatch<React.SetStateAction<Date>>;
  handleNext: (index: number) => void;
  handlePlan: UseMutateFunction;
}

const RenderComp: React.FC<RenderNode> = ({
  item,
  index,
  planName,
  planAmount,
  planDate,
  isLoading,
  setPlanName,
  setPlanAmount,
  setPlanDate,
  handleNext,
  handlePlan,
}) => {
  // Date picker
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [dateModal, setDateModal] = useState(false);

  const today = new Date();

  const datePicked = new Date(planDate)
    .toISOString()
    .replace(/T.*/, "")
    .split("-")
    .reverse()
    .join("-");

  var year = new Date().getFullYear();
  var month = new Date().getMonth();
  var day = new Date().getDate();
  var minDate = new Date(year + 1, month, day + 1);

  const value = index === 0 ? planName : index == 1 ? planAmount : undefined;

  //   functions
  const onChange = (event: any, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate || planDate;
    if (Platform.OS === "android") {
      setIsPickerShow(false);
    }
    setPlanDate(currentDate);
  };

  return (
    <View style={tw`mt-16`}>
      <Text style={[tw`text-lg mb-5`, { fontFamily: "DMB" }]}>
        {item.question}
      </Text>

      <TextField
        value={value}
        icon={index === 1 ? "₦" : undefined}
        label={
          index !== 2
            ? undefined
            : index === 2 && today.getTime() === planDate.getTime()
            ? "Choose date"
            : datePicked
        }
        iconName={index === 2 ? "calendar-outline" : undefined}
        style={index === 1 ? tw`flex-row-reverse` : tw`flex-row`}
        editable={index === 2 ? false : true}
        keyboardType={item.keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        enablesReturnKeyAutomatically={true}
        blurOnSubmit={false}
        onChangeText={(text) => {
          index !== 2 &&
            handleTextChangeP({
              text,
              index,
              stateFunctions: {
                setPlanName,
                setPlanAmount,
              },
            });
        }}
        onPressIn={() => {
          if (index === 2) {
            Platform.OS === "android"
              ? setIsPickerShow(true)
              : setDateModal(true);
          }
        }}
      />

      {isPickerShow && (
        <DateTimePicker
          testID="dateTimePicker"
          value={planDate}
          minimumDate={minDate}
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
        date={planDate}
        minDate={minDate}
        onChange={onChange}
      />

      <Button
        title="Continue"
        style={
          (index == 0 && planName === "") || (index == 1 && planAmount === "")
            ? tw`mt-8 opacity-60 `
            : tw`mt-8 opacity-100 `
        }
        disabled={
          (index == 0 && planName === "") || (index == 1 && planAmount === "")
            ? true
            : false
        }
        onPress={() => {
          index === 2 ? handlePlan() : handleNext(index);
        }}
        isLoading={isLoading}
      />
    </View>
  );
};

export function PlanReview({
  navigation,
  route,
}: PlanStackScreenProps<"PlanReview">) {
  const colorScheme = useColorScheme();

  const color = Colors[colorScheme];

  const { planAmount, planDate, planName, planProj } = route?.params;

  const { isLoading, mutate: handlePlanCreation } = usePost({
    url: "/plans",
    payload: {
      plan_name: planName,
      target_amount: planAmount,
      maturity_date: planDate,
    },
    onSuccess: (data) => handleNext(),
    onError: (error) => handleError(error),
  });

  function handlePrev() {
    navigation.goBack();
  }

  function handleNext() {
    navigation.navigate("SuccessModal", {
      title: "You just created your plan.",
      sub: "Well done, Deborah",
      btnTitle: "View plan",
      action: () => {
        navigation.navigate("Root");
      },
    });
  }

  function handleError(error: Error) {
    const toast = () =>
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: error.message,
        topOffset: 50,
        visibilityTime: 5000,
      });

    toast();
  }

  const initDate = new Date(planDate)
    .toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    .replace(", ", " ")
    .replace(",", "")
    .split(" ");

  const date = initDate[2] + " " + initDate[1] + " " + initDate[3];

  function monthDiff(dateFrom: Date, dateTo: Date) {
    return (
      dateTo.getMonth() -
      dateFrom.getMonth() +
      12 * (dateTo.getFullYear() - dateFrom.getFullYear())
    );
  }
  const months = monthDiff(new Date(), planDate);

  return (
    <View style={tw`flex-1 px-5`}>
      <TopNav title="Review" style={tw`mt-3`} action={handlePrev} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={tw`justify-center items-center mt-4`}>
          <Text style={tw`text-base text-[#71879C]`}>{planName}</Text>
          <Text style={[tw`text-2xl my-1`, { fontFamily: "tomatoB" }]}>
            $ {(planProj.total_returns / 2).toFixed(2)}
          </Text>
          <Text style={tw`text-lg`}>by {date} </Text>
        </View>
        <View style={tw`flex-row justify-between px-3 mt-4`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`h-3 w-3 rounded-full bg-[#94A1AD]`} />
            <Text style={tw`text-base ml-2`}>Investments • $0</Text>
          </View>

          <View style={tw`flex-row items-center`}>
            <View style={tw`h-3 w-3 rounded-full bg-[${color.primary}]`} />
            <Text style={tw`text-base ml-2`}>
              Returns • $ {(planProj.total_returns / months).toFixed(2)}
            </Text>
          </View>
        </View>
        <SlideAreaChart
          data={[
            { x: 0.2, y: 0.2 },
            { x: 1, y: 0.3 },
            { x: 2, y: 0.65 },
            { x: 3, y: 1.2 },
            { x: 4, y: 2 },
          ]}
          chartLineColor={"#22D8E2"}
          style={tw`bg-transparent my-8 w-10`}
          cursorProps={{
            cursorColor: color.primary,
          }}
        />
        <View style={tw`flex-row justify-between my-5`}>
          <Text style={tw`text-lg ml-3 text-[#71879C]`}>
            Estimated monthly investment
          </Text>
          <Text style={tw`text-lg ml-3 `}>
            $ {(planProj.total_invested / months).toFixed(2)}
          </Text>
        </View>
        <View style={tw`border border-[rgba(113,135,156,0.2)]`} />
        <View
          style={tw`flex-row items-center p-4 my-5 bg-[rgba(113,135,156,0.05)] rounded-lg `}
        >
          <Icon
            name="information-circle-outline"
            size={wp(7)}
            color={color.primary}
          />
          <Text style={tw`text-base ml-3 text-[#71879C]`}>
            Returns not guaranteed. Investing involves risk. Read our
            Disclosures.
          </Text>
        </View>
        <Text style={tw`text-base text-center text-[#71879C]`}>
          These are your starting settings, they can always be updated.
        </Text>
        <View style={tw`my-7`}>
          <Button
            title="Agree & Continue"
            onPress={() => {
              handlePlanCreation();
            }}
            isLoading={isLoading}
          />
          <Button
            title="Start over"
            titleColor={color.primary}
            style={tw`mt-3 bg-[rgba(113,135,156,0.1)]`}
          />
        </View>
      </ScrollView>
    </View>
  );
}
