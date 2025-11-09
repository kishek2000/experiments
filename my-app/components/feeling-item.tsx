import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { green200, purple200 } from "@/constants/theme/colors";
import { FontStyles } from "@/constants/theme/font";
import { verticalScale } from "@/constants/theme/sizing";

export interface FeelingItemProps {
  name: string;
  emoji: string;
  onPress?: VoidFunction;
  isSelected?: boolean;
}

export const FeelingItem: React.FC<FeelingItemProps> = ({
  name,
  emoji,
  onPress,
  isSelected = false,
}) => {
  const style = isSelected ? styles.selected : styles.unselected;

  return (
    <TouchableOpacity style={style} onPress={onPress} disabled={!onPress}>
      <Text style={FontStyles.normal}>{name} </Text>
      <Text style={FontStyles.normal}>{emoji}</Text>
    </TouchableOpacity>
  );
};

const baseStyles = StyleSheet.create({
  container: {
    width: "48.5%",
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(12),
    borderRadius: 4,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

const styles = StyleSheet.create({
  selected: {
    ...baseStyles.container,
    backgroundColor: green200,
  },
  unselected: {
    ...baseStyles.container,
    borderColor: purple200,
    borderWidth: 1,
    backgroundColor: "white",
  },
});
