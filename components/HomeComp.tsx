import { useState, useRef, FC } from "react";

import { StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { Text, View, ScrollView } from "../components/Themed";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import {
  Ionicons as Icon,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";

import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

import tw from "twrnc";
import Button from "../components/Button";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

// Images
import Add from "../assets/images/add.svg";
import Question from "../assets/images/question.svg";
import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useGet } from "../services/queries";
import { ErrorComp } from "./ErrorComp";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useRefreshOnFocus } from "../hooks/useRefrestOnFocus";
import { useRefreshByUser } from "../hooks/useRefreshByUser";

interface BalanceNode {
  amount?: number;
}

interface PlanNode {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList, "Home">,
    NativeStackNavigationProp<RootStackParamList, "Root">
  >;
}

export function Balance({ amount }: BalanceNode) {
  const [active, setActive] = useState(0);

  const colorScheme = useColorScheme();

  const color = Colors[colorScheme];

  const { isLoading, isError, data, error, refetch, isRefetching } = useGet({
    url: "/sessions",
    id: "sessions",
    options: { staleTime: 40 },
  });

  useRefreshOnFocus(refetch);

  if (isLoading) {
    return <BalanceLoader />;
  }

  if (isError) {
    return <ErrorComp title="Failed to fetch plans" action={() => refetch()} />;
  }

  const balanceValues = [data?.total_balance, data?.total_returns];

  const BalanceDots: React.FC = ({}) => {
    return (
      <Pagination
        dotsLength={balanceValues.length}
        activeDotIndex={active}
        containerStyle={{
          //   backgroundColor: "rgba(0, 0, 0, 0.75)",
          width: wp(20),
        }}
        dotStyle={{
          width: 18,
          height: 8,
          borderRadius: 5,
          backgroundColor: color.primary,
        }}
        inactiveDotStyle={{
          backgroundColor: "#C4C4C4",
          width: 8,
          height: 8,
        }}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    );
  };

  return (
    <View>
      <ImageBackground
        source={require("../assets/images/gradient.png")}
        resizeMode="cover"
        style={tw`-mx-5 px-5`}
      >
        <View
          style={tw`flex-row justify-between items-center my-3 bg-transparent`}
        >
          <View style={tw`bg-transparent`}>
            <Text style={tw`text-lg`}>Good morning ☀️</Text>

            <Text
              style={[
                tw`text-xl`,
                {
                  fontFamily: "DMB",
                },
              ]}
            >
              Deborah
            </Text>
          </View>

          <View style={tw`flex-row items-center bg-transparent`}>
            <Button
              title="Earn 3% bonus"
              titleSize={wp(3)}
              style={[tw`rounded-full max-w-[${wp(50)}]`]}
            />

            <View style={tw`mx-2 bg-transparent`}>
              <MaterialCommunityIcons
                name="bell"
                size={wp(8)}
                color={color.primary}
              />

              <View
                style={tw`p-1 absolute -top-1 right-0 rounded-full justify-center items-center bg-[#EB5757]`}
              >
                <Text
                  style={[tw`text-xs text-white`, { fontFamily: "tomato" }]}
                >
                  9+
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View>
          <Carousel
            data={balanceValues}
            decelerationRate="fast"
            renderItem={(item) => <BalanceRenderComp {...item} />}
            sliderWidth={wp(90)}
            itemWidth={wp(90)}
            onSnapToItem={(idx) => {
              setActive(idx);
            }}
          />

          <View style={tw`items-center -mt-4 `}>
            <BalanceDots />
          </View>
        </View>
      </ImageBackground>

      <View>
        <Button
          style={tw`border border-[rgba(113,135,156,0.2)] bg-transparent mt-6`}
          title="+ Add money"
          titleColor={color.primary}
        />
      </View>
    </View>
  );
}

function BalanceRenderComp({ item, index }: { item: any; index: number }) {
  const [showBalance, setShowBalance] = useState(true);

  const colorScheme = useColorScheme();

  const color = Colors[colorScheme];
  return (
    <View style={tw`bg-[${color.background}]/50 py-5 rounded-xl`}>
      <View style={tw`flex-row justify-center items-center bg-transparent`}>
        <Text style={tw`text-lg text-[${color.tint}]`}>
          {index === 0 ? "Total Balance" : "Total Returns"}
        </Text>

        <TouchableOpacity
          style={tw`px-3`}
          onPress={() => setShowBalance(!showBalance)}
        >
          <Icon name="eye-off" size={wp(5)} color={color.primary} />
        </TouchableOpacity>
      </View>

      <Text style={[tw`text-4xl text-center my-4`, { fontFamily: "tomato" }]}>
        {!showBalance ? "****" : item ? "$ " + item : " $ " + 0}
      </Text>

      <View
        style={tw`border border-[rgba(113,135,156,0.1)] rounded-full mx-16 `}
      />

      <View
        style={tw`flex-row items-center justify-center mt-6 bg-transparent`}
      >
        <Text style={tw`text-lg text-[${color.tint}]`}>Total Gains</Text>

        <View
          style={tw`flex-row items-center justify-center mx-2 bg-transparent`}
        >
          <Feather name="arrow-up-right" color={color.success} size={wp(4)} />
          <Text style={tw`text-lg`}>0.00%</Text>
        </View>

        <Icon name="chevron-forward" color={color.tint} size={wp(4)} b />
      </View>
    </View>
  );
}

function BalanceLoader() {
  const colorScheme = useColorScheme();

  const color = Colors[colorScheme];
  return (
    <View>
      <View
        style={tw`flex-row justify-between items-center my-4 bg-transparent`}
      >
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={tw`w-30 h-5 rounded`}
        />

        <View style={tw`flex-row items-center`}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            style={tw`w-20 h-5 rounded`}
          />

          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            style={tw`w-5 h-5 ml-4 rounded-full`}
          />
        </View>
      </View>

      <View style={tw`bg-[${color.background}]/50 py-5 rounded-xl`}>
        <View style={tw`flex-row justify-center items-center bg-transparent`}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            style={tw`w-40 h-3 mb-2 rounded`}
          />

          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            style={tw`w-5 h-5 ml-4 mb-4 rounded-full`}
          />
        </View>

        <View style={tw`items-center`}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            style={tw`w-30 h-10 mb-6 rounded`}
          />

          <View
            style={tw`border border-[rgba(113,135,156,0.1)] rounded-full mx-16 `}
          />

          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            style={tw`w-50 h-3 mb-6 rounded`}
          />
        </View>
      </View>
    </View>
  );
}

export function PlanCard({ navigation }: PlanNode) {
  const colorScheme = useColorScheme();

  const color = Colors[colorScheme];

  const { isLoading, isError, data, error, refetch } = useGet({
    url: "/plans",
    id: "plans",
  });

  useRefreshOnFocus(refetch);

  function handlePlan(value: any) {
    navigation.navigate("Plan", {
      screen: "PlanScreen",
      params: { planId: value.id },
    });
  }

  function handlePlanCreation() {
    navigation.navigate("Plan", { screen: "CreatePlan" });
  }

  if (isLoading) {
    return <PlanCardLoader />;
  }

  if (isError) {
    return <ErrorComp title="Failed to fetch plans" action={() => refetch()} />;
  }

  return (
    <View>
      <View style={tw`flex-row justify-between mt-6 mb-4`}>
        <Text style={[tw`text-xl`, { fontFamily: "tomato" }]}>
          Create a plan
        </Text>

        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-lg text-[#94A1AD] mr-2`}>View all plans</Text>

          <Icon name="chevron-forward" size={wp(5)} color="#94A1AD" />
        </View>
      </View>

      <Text style={tw`text-base text-[${color.tint}]`}>
        Start your investment journey by creating a plan
      </Text>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={[tw`pt-6`]}
      >
        <TouchableOpacity
          style={tw`justify-center items-center p-7 mr-5 rounded-xl bg-[rgba(113,135,156,0.1)] h-[${wp(
            19
          )}] w-[${wp(12)}]`}
          onPress={handlePlanCreation}
        >
          <Add />

          <Text
            style={[
              tw`text-base text-center leading-1 mt-4 `,
              { fontFamily: "DMB" },
            ]}
          >
            Create an investment plan
          </Text>
        </TouchableOpacity>

        {data.items?.map((value: any, index: React.Key) => {
          return (
            <TouchableOpacity
              style={tw`bg-[rgba(113,135,156,0.1)] rounded-xl h-[${wp(
                19
              )}] w-[${wp(12)}] overflow-hidden shadow-xl mr-4`}
              key={index}
              onPress={() => {
                handlePlan(value);
              }}
            >
              <ImageBackground
                source={require("../assets/images/coin.png")}
                style={tw`flex-1 p-5 flex-col-reverse`}
              >
                <View style={tw`shadow-2xl bg-transparent`}>
                  <Text style={tw`text-lg text-white capitalize`}>
                    {value.plan_name}
                  </Text>
                  <Text style={tw`text-2xl leading-1.1 text-white `}>
                    $ {value.invested_amount}
                  </Text>
                  <Text style={tw`text-lg leading-1.1 text-white `}>
                    Mixed assets
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function NeedHelp({}) {
  const colorScheme = useColorScheme();

  const color = Colors[colorScheme];
  return (
    <View
      style={tw`flex-row justify-between items-center my-6 rounded-xl shadow-md shadow-[rgba(53,71,89,0.75)] p-3`}
    >
      <View style={tw`flex-row items-center`}>
        <Question />

        <Text style={tw`text-lg ml-3`}>Need Help?</Text>
      </View>

      <Button title="Contact us" style={tw`px-4 py-2.5`} />
    </View>
  );
}

export function Quote({}) {
  const { isLoading, isError, data, error, refetch } = useGet({
    url: "/quotes",
    id: "quotes",
  });

  if (isLoading) {
    return <QuoteLoader />;
  }

  if (isError) {
    return <ErrorComp title="Failed to fetch plans" action={() => refetch()} />;
  }

  return (
    <View style={tw`bg-[rgba(64,187,195,0.15)] rounded-2xl p-.6`}>
      <View style={tw`bg-[#0898A0] p-5 rounded-2xl border-2 border-[#41BCC4]`}>
        <Text style={[tw`text-lg text-white`, { fontFamily: "DMB" }]}>
          TODAY'S QUOTE
        </Text>

        <View style={tw`w-10 border-white border my-3`} />

        <Text style={tw`text-white text-lg leading-1.3 my-4`}>
          {data?.quote}
        </Text>

        <View style={tw`flex-row justify-between items-center bg-transparent `}>
          <Text style={[tw`text-lg text-white`, { fontFamily: "DMB" }]}>
            {data?.author}
          </Text>

          <TouchableOpacity
            style={tw`rounded-full bg-[rgba(255,255,255,0.2)] p-1.5 pr-2`}
          >
            <Icon name="share-social-outline" size={wp(6)} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function PlanCardLoader() {
  return (
    <View>
      <View style={tw`flex-row mt-4 justify-between`}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={tw`w-40 h-5 mb-2 rounded`}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={tw`w-20 h-5 rounded`}
        />
      </View>

      <View>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={tw`w-90 mt-4 mb-2 rounded`}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={tw`w-40 rounded`}
        />
      </View>

      <View style={tw`flex-row`}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={tw`justify-center items-center mr-5 mt-5 rounded-xl h-[${wp(
            19
          )}] w-[${wp(12)}]`}
        />

        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={tw`justify-center items-center mr-5 mt-5 rounded-xl h-[${wp(
            19
          )}] w-[${wp(12)}]`}
        />
      </View>
    </View>
  );
}

function QuoteLoader() {
  return (
    <View style={tw`bg-[rgba(113,135,156,0.1)] p-5 rounded-2xl `}>
      <View style={tw`bg-transparent`}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={tw`w-40 h-5 mb-6 rounded`}
        />

        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={tw`w-16 h-2`}
        />
      </View>

      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={tw`w-80 h-40 mt-6 rounded`}
      />

      <View
        style={tw`flex-row justify-between items-center mt-4 bg-transparent`}
      >
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={tw`w-30 h-5 mb-2 rounded`}
        />

        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={tw`w-10 h-10 mb-2 rounded-full`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
