import React from "react";
import { StyleSheet, TextInput } from "react-native";

import { purple200 } from "@/constants/theme/colors";
import { horizontalScale, verticalScale } from "@/constants/theme/sizing";

export interface FeelingInputProps {
  feeling: string;
  handleFeeling: (feeling: string) => void;
}

export const FeelingInput: React.FC<FeelingInputProps> = ({
  feeling,
  handleFeeling,
}) => {
  return (
    <TextInput
      style={styles.container}
      value={feeling}
      onChangeText={(text) => handleFeeling(text)}
      placeholder="Type something here..."
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(12),
    borderRadius: 4,
    textAlign: "center",
    borderColor: purple200,
    borderWidth: 1,
    backgroundColor: "white",
  },
});
