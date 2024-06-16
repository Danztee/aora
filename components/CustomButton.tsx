import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  TextStyle,
  ViewStyle,
} from "react-native";

type CustomButtonProps = {
  title: string;
  handlePress: () => void;
  containerStyles?: ViewStyle | string;
  textStyles?: TextStyle | string;
  isLoading?: boolean;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] items-center justify-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
