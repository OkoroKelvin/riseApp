import React, { useState, useRef, FC } from "react";
import { Text, View } from "../components/Themed";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native";

import tw from "twrnc";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { SlideAreaChart } from "react-native-slide-charts";

interface dataNode {
  data: {
    id: string;
    created_at: string;
    plan_name: string;
    invested_amount: number;
    total_returns: number;
    target_amount: number;
    maturity_date: string;
    user_id: string;
    returns: [
      {
        id: string;
        created_at: string;
        amount: number;
        plan_id: string;
      }
    ];
  };
}

export default function PerformanceChart({ data }: dataNode) {
  const colorScheme = useColorScheme();

  const color = Colors[colorScheme];

  const values = ["$100,000", "$50,000", "$20,000", "$0"];
  const timeValues = ["1M", "3M", "6M", "All"];

  const initDate = new Date(data.maturity_date)
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

  function TimeRange() {
    const [active, setActive] = useState(0);
    return (
      <View
        style={tw`bg-transparent bg-[rgba(255,255,255,0.15)] rounded-lg flex-row`}
      >
        {timeValues.map((res, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={[
                tw`px-5 py-2 rounded-lg flex-1 items-center`,
                {
                  backgroundColor: active === index ? "white" : "transparent",
                },
              ]}
              onPress={() => {
                setActive(index);
              }}
            >
              <Text
                style={tw`text-[${
                  active === index ? color.primary : "#fff"
                }] text-base `}
              >
                {res}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <View style={tw`bg-[${color.primary}] rounded-xl p-6 my-6`}>
      <View style={tw`justify-center items-center mb-3 bg-transparent`}>
        <Text style={tw`text-base text-[#71879C] text-white`}>Performance</Text>
        <Text style={[tw`text-2xl text-white`, { fontFamily: "tomatoB" }]}>
          $0
        </Text>
        <Text style={tw`text-base text-[#71879C] text-white`}>{date}</Text>
      </View>

      <View style={tw`flex-row justify-between mt-4 bg-transparent`}>
        <View style={tw`flex-row items-center bg-transparent`}>
          <View style={tw`h-3 w-3 rounded-full bg-[#94A1AD]`} />
          <Text style={tw`text-base ml-2 text-white`}>Investments • $0</Text>
        </View>

        <View style={tw`flex-row items-center bg-transparent`}>
          <View style={tw`h-3 w-3 rounded-full bg-[#41BCC4]`} />
          <Text style={tw`text-base ml-2 text-white`}>Returns • $ 0</Text>
        </View>
      </View>

      <View style={tw`bg-transparent my-5`}>
        <View style={tw`bg-transparent`}>
          {values.map((value: any, index: number) => {
            return (
              <View style={tw`bg-transparent mt-6`} key={index}>
                <View
                  style={tw`border border-dashed border-[#41BCC4] bg-transparent`}
                />
                <Text
                  style={[
                    tw`text-sm text-white mt-2`,
                    { fontFamily: "tomato" },
                  ]}
                >
                  {value}
                </Text>
              </View>
            );
          })}
        </View>
        <SlideAreaChart
          data={[
            { x: 0.2, y: 0.2 },
            { x: 1, y: 3.3 },
            { x: 2, y: 10 },
            { x: 3, y: 3.2 },
            { x: 4, y: 2 },
          ]}
          width={wp(80)}
          chartLineColor={"#22D8E2"}
          style={tw`bg-transparent absolute `}
          cursorProps={{
            cursorColor: color.primary,
          }}
          yAxisProps={{
            verticalLineWidth: 0,
            horizontalLineWidth: 0,
          }}
        />
      </View>

      <TimeRange />
    </View>
  );
}
