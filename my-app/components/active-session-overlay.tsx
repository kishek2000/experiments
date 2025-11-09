import React from "react";
import { Modal, StyleSheet, Text, View, Image } from "react-native";

import { VerticalSpacer } from "./spacer";
import { noop } from "@/utils/noop";
import { FontStyles } from "@/constants/theme/font";

interface ActiveSessionOverlayProps {
  sessionIsActive: boolean;
  sessionFinishDate: Date;
  sessionFinishTime: string;
}

export const ActiveSessionOverlay: React.FC<ActiveSessionOverlayProps> = ({
  sessionIsActive,
  sessionFinishDate,
  sessionFinishTime,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={sessionIsActive}
      onRequestClose={noop}
    >
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/Swamiji.png")}
          style={styles.image}
        />
        <VerticalSpacer by={1} />
        <Text style={styles.SwamijiLabel}>Sadguru Sadafal Deo Ji Maharaj</Text>
        <VerticalSpacer by={8} />
        <Text style={styles.inProgressText}>Session in Progress</Text>
        {sessionFinishDate && sessionFinishTime ? (
          <Text style={styles.remainingTimeText}>
            Your session will end at {sessionFinishTime}.
          </Text>
        ) : null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(30, 30, 30, 0.95)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: { opacity: 0.6 },
  SwamijiLabel: {
    ...FontStyles.normal,
    color: "#999",
    width: 240,
    textAlign: "center",
  },
  inProgressText: { ...FontStyles.h3, color: "#999" },
  remainingTimeText: { color: "#888", lineHeight: 16 },
});
