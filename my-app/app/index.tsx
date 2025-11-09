import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { Page } from "@/components/page";
import { Button } from "@/components/button";
import { Streak } from "@/components/streak";
import { VerticalSpacer } from "@/components/spacer";
import { FontStyles } from "@/constants/theme/font";
import { useSessionStore } from "@/state/sessions";

export default function HomeScreen() {
  const router = useRouter();
  const { getCurrentStreak, getLastMeditatedAt } = useSessionStore();

  const currentStreak = getCurrentStreak();
  const lastMeditatedAt = getLastMeditatedAt();

  const onStartPractice = () => {
    router.push("/practice-session");
  };

  const onViewPastSessions = () => {
    router.push("/past-sessions");
  };

  return (
    <Page>
      <VerticalSpacer by={2} />
      <Text style={styles.homeHeroTitle}>
        Welcome back!{`\n`}Ready to meditate?
      </Text>
      <VerticalSpacer by={0.5} />
      <Text style={styles.homeSubTitle}>Today is your day.</Text>
      <VerticalSpacer by={2} />
      <Streak
        showLastMeditatedAt
        currentStreak={currentStreak}
        lastMeditatedAt={lastMeditatedAt || undefined}
      />
      <VerticalSpacer by={2.5} />
      <View style={styles.homeMenuContainer}>
        <Button
          type="primary"
          appearance="long"
          padding="compact"
          onPress={onStartPractice}
        >
          Start Practice
        </Button>
        <VerticalSpacer by={1.5} />
        <Button
          type="secondary"
          appearance="long"
          padding="compact"
          onPress={onViewPastSessions}
        >
          View Past Sessions
        </Button>
      </View>
      <VerticalSpacer by={2} />
    </Page>
  );
}

const styles = StyleSheet.create({
  homeMenuContainer: {
    width: "85%",
    alignSelf: "center",
  },
  homeHeroTitle: {
    ...FontStyles.h1,
    textAlign: "center",
  },
  homeSubTitle: {
    ...FontStyles.normal,
    textAlign: "center",
  },
});
