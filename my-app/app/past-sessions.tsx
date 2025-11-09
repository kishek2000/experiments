import { useCallback } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { Page } from "@/components/page";
import { Section } from "@/components/section";
import { Button } from "@/components/button";
import { VerticalSpacer } from "@/components/spacer";
import { SessionCard } from "@/components/session-card";
import { Streak } from "@/components/streak";
import { FontStyles } from "@/constants/theme/font";
import { useSessionStore } from "@/state/sessions";

export default function PastSessionsScreen() {
  const router = useRouter();
  const { getSessions, getCurrentStreak, getLastMeditatedAt } =
    useSessionStore();

  const sessions = getSessions();
  const currentStreak = getCurrentStreak();
  const lastMeditatedAt = getLastMeditatedAt();

  const onStartNewSession = useCallback(() => {
    router.push("/practice-session");
  }, [router]);

  const onBackToHome = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <Page>
      <Section title="Practice" subtitle="Your meditation journey.">
        <Streak
          currentStreak={currentStreak}
          lastMeditatedAt={lastMeditatedAt}
        />

        <VerticalSpacer by={2} />
        <Text style={FontStyles.h3}>Your Sessions</Text>

        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={FontStyles.normal}>
              You haven't completed any meditation sessions yet.
            </Text>
            <VerticalSpacer by={1} />
            <Button type="primary" onPress={onStartNewSession}>
              Start Your First Session
            </Button>
          </View>
        ) : (
          <ScrollView style={styles.sessionsList}>
            {sessions.map((session) => (
              <View key={session.id}>
                <SessionCard
                  name={`${session.duration} minute meditation`}
                  createdAt={session.startTime.toISOString()}
                  onPress={() => {
                    // Could navigate to session details in the future
                    console.log("Session details:", session);
                  }}
                />
                <VerticalSpacer by={1} />
              </View>
            ))}
          </ScrollView>
        )}

        <VerticalSpacer by={2} />
        <View style={styles.buttonGroup}>
          <Button type="secondary" onPress={onBackToHome}>
            Back to Home
          </Button>
          <VerticalSpacer by={1} />
          <Button type="primary" onPress={onStartNewSession}>
            Start New Session
          </Button>
        </View>
      </Section>
    </Page>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  sessionsList: {
    maxHeight: 400,
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
  },
});
