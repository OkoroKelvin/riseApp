import { Text, View, ScrollView } from "../components/Themed";
import tw from "twrnc";

import Close from "../assets/images/close.svg";
import Back from "../assets/images/back.svg";
import { TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

type navNode = React.ComponentProps<typeof View> & {
  title?: string;
  sub?: string;
  color?: string;
  close?: boolean;
  action?: () => void;
  RightIcon?: React.FC<SvgProps>;
};

export function TopNav({
  title,
  sub,
  color,
  close,
  action,
  style,
  RightIcon,
  ...restOfProps
}: navNode) {
  return (
    <View
      style={[tw`flex-row  items-center mt-3 justify-between`, style]}
      {...restOfProps}
    >
      <TouchableOpacity onPress={action}>
        {close ? <Close /> : <Back />}
      </TouchableOpacity>

      <View style={tw`flex-1 items-center bg-transparent`}>
        <Text
          style={[
            tw`text-2xl capitalize`,
            { fontFamily: "tomatoB", color: color },
          ]}
        >
          {title}
        </Text>
        {sub && <Text style={[tw`text-lg `, { color: color }]}>{sub}</Text>}
      </View>

      {RightIcon ? <RightIcon /> : <View style={tw`mr-10`} />}
    </View>
  );
}
