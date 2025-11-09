import React, { Fragment } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { noop } from "@/utils/noop";
import { orange300, purple200 } from "@/constants/theme/colors";
import { ShadowStyles } from "@/constants/theme/elevation";
import { FontStyles } from "@/constants/theme/font";
import { horizontalScale, verticalScale } from "@/constants/theme/sizing";

export interface SessionCardProps {
  /**
   * Title of the session
   */
  name: string;
  createdAt: string;
  totalPractices?: number;
  /**
   * The type of session
   */
  type?: "challenge" | "personal";
  onPress?: VoidFunction;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  type = "personal",
  name: title,
  createdAt,
  totalPractices,
  onPress = noop,
}) => {
  const showTotalPracticesString = typeof totalPractices === "number";
  const totalPracticesString = `Practiced ${totalPractices} time${
    totalPractices === 1 ? "" : "s"
  }`;

  return (
    <TouchableOpacity style={styles[type]} onPress={onPress}>
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.containerMetadata}>
            <Text style={styles.metadata}>
              {getTimeAgo(new Date(createdAt))}
            </Text>
            {showTotalPracticesString ? (
              <Fragment>
                <Text style={styles.metadata}> • </Text>
                <Text style={styles.metadata}>{totalPracticesString}</Text>
              </Fragment>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const baseStyles = StyleSheet.create({
  base: {
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    width: "100%",
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...ShadowStyles.subtle,
  },
});

const styles = StyleSheet.create({
  personal: {
    ...baseStyles.base,
    borderColor: purple200,
  },
  challenge: {
    ...baseStyles.base,
    borderColor: orange300,
  },
  content: {
    display: "flex",
  },
  containerMetadata: {
    display: "flex",
    flexDirection: "row",
  },
  title: {
    ...FontStyles.h4,
    ...FontStyles.strong,
  },
  metadata: { ...FontStyles.metadata, textTransform: "none" },
});

// Helper function to get time ago string
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}
