import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

import { FeelingInput } from "./feeling-input";
import { FeelingItem, FeelingItemProps } from "./feeling-item";

const initFeelings: FeelingItemProps[] = [
  {
    name: "Peaceful",
    emoji: "😌",
  },
  {
    name: "Calm",
    emoji: "🌊",
  },
  {
    name: "Energised",
    emoji: "⚡",
  },
  {
    name: "Happy",
    emoji: "😊",
  },
  {
    name: "Stressed",
    emoji: "😩",
  },
  {
    name: "Nothing",
    emoji: "😶",
  },
];

interface FeelingListProps {
  feelings: FeelingItemProps[];
  feelingContent: string;
  handleFeelings: (feelings: FeelingItemProps[]) => void;
  handleFeelingContent: (feelingContent: string) => void;
}

export const FeelingList = ({
  feelings,
  feelingContent,
  handleFeelings,
  handleFeelingContent,
}: FeelingListProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.feelingsList}>
        {initFeelings.map((feeling) => (
          <FeelingItem
            key={feeling.name}
            {...feeling}
            onPress={() => {
              let updatedFeelings: FeelingItemProps[] = [];
              if (feelings.filter((f) => f.name === feeling.name).length) {
                updatedFeelings = feelings.filter(
                  (f) => f.name !== feeling.name
                );
              } else {
                updatedFeelings = [
                  ...feelings,
                  { ...feeling, isSelected: true },
                ];
              }
              handleFeelings(updatedFeelings);
            }}
            isSelected={
              feelings.filter((f) => f.name === feeling.name).length > 0
            }
          />
        ))}
      </View>
      <FeelingInput
        feeling={feelingContent}
        handleFeeling={handleFeelingContent}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  feelingsList: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
  },
});
