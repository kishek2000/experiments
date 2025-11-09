import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { FontStyles } from "@/constants/theme/font";

interface StreakProps {
  showLastMeditatedAt?: boolean;
  currentStreak?: number;
  lastMeditatedAt?: Date;
}

export const Streak: React.FC<StreakProps> = ({
  showLastMeditatedAt = false,
  currentStreak = 0,
  lastMeditatedAt,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.streakText}>
        <Text style={styles.streakNumber}>{currentStreak}</Text> day streak
      </Text>
      {showLastMeditatedAt && lastMeditatedAt && (
        <Text style={styles.lastMeditatedText}>
          Last meditated {getTimeAgo(lastMeditatedAt)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafafa",
    width: "100%",
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: "center",
  },
  streakText: {
    ...FontStyles.normal,
    textAlign: "center",
  },
  streakNumber: {
    fontFamily: "Niramit_700Bold",
  },
  lastMeditatedText: {
    ...FontStyles.normal,
    textAlign: "center",
    marginTop: 8,
    color: "#666",
  },
});

// Helper function to get time ago string
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} weeks ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} years ago`;
}
