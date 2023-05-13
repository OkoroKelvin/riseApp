import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Pressable,
} from "react-native";

import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Ionicons as Icon } from "@expo/vector-icons";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import tw from "twrnc";

interface secureInputNode {
  isSecure: boolean;
  setIsSecure: (value: React.SetStateAction<boolean>) => void;
}

type Props = React.ComponentProps<typeof TextInput> & {
  label?: string;
  errorText?: string | null;
  iconName?: any;
  icon?: any;
  password?: secureInputNode;
  refs?: React.RefObject<TextInput>;
};

const TextField: React.FC<Props> = (props) => {
  const {
    label,
    errorText,
    icon,
    iconName,
    refs,
    password,
    value,
    style,
    onBlur,
    onFocus,
    ...restOfProps
  } = props;
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const focusAnim = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused || !!value ? 1 : 0,
      duration: 150,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [focusAnim, isFocused, value]);

  let color = isFocused ? "#0898A0" : Colors[colorScheme].text;
  if (errorText) {
    color = "#B00020";
  }

  const handleFocus = () => {
    refs ? refs.current?.focus() : inputRef.current?.focus();
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isFocused ? color : "#E1E8ED",
        },
        style,
      ]}
    >
      <View style={styles.inputCase}>
        <TextInput
          ref={refs ? refs : inputRef}
          style={[styles.input, { color: Colors[colorScheme].text }]}
          {...restOfProps}
          value={value}
          secureTextEntry={password ? password.isSecure : false}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
        />

        {label && (
          <TouchableWithoutFeedback onPress={handleFocus}>
            <Animated.View
              style={[
                styles.labelContainer,
                {
                  transform: [
                    {
                      scale: focusAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.85],
                      }),
                    },
                    {
                      translateY: focusAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [16, -12],
                      }),
                    },
                    {
                      translateX: focusAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [5, 0],
                      }),
                    },
                  ],
                  backgroundColor: Colors[colorScheme].background,
                },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  {
                    color,
                  },
                ]}
              >
                {label}
                {errorText ? "*" : ""}
              </Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        )}
      </View>

      {icon && (
        <Text style={tw`text-[${Colors[colorScheme].primary}] text-lg mx-2`}>
          {icon}
        </Text>
      )}

      {iconName && !icon && (
        <View style={styles.icon}>
          <Icon name={iconName} color="#0898A0" size={wp(6)} />
        </View>
      )}

      {password && (
        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            password.setIsSecure(!password.isSecure);
          }}
        >
          <Icon
            name={password.isSecure ? "eye" : "eye-off"}
            color="#0898A0"
            size={wp(6)}
          />
        </TouchableOpacity>
      )}

      {!!errorText && <Text style={styles.error}>{errorText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: wp(2),
  },
  inputCase: {
    flex: 1,
    fontSize: wp(3.8),
  },
  input: {
    padding: wp(4),
    // backgroundColor: "red",
    fontFamily: "DMB",
    fontSize: wp(3.8),
  },
  labelContainer: {
    position: "absolute",
    paddingHorizontal: 8,
  },
  label: {
    fontSize: wp(3.8),
    fontFamily: "DMB",
  },
  icon: {
    marginHorizontal: wp(2),
  },
  error: {
    marginTop: 4,
    marginLeft: 12,
    fontSize: 12,
    color: "#B00020",
    fontFamily: "Avenir-Medium",
  },
});

export default TextField;
