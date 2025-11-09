import { useState, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { Page } from "@/components/page";
import { Section } from "@/components/section";
import { Button, buttonGroupStyles } from "@/components/button";
import { VerticalSpacer, HorizontalSpacer } from "@/components/spacer";
import { FeelingList } from "@/components/feeling-list";
import { FontStyles } from "@/constants/theme/font";
import { useSessionStore } from "@/state/sessions";
import { FeelingItemProps } from "@/components/feeling-item";

export default function PracticeLogScreen() {
  const router = useRouter();
  const { duration, startTime, endTime } = useLocalSearchParams<{
    duration: string;
    startTime: string;
    endTime: string;
  }>();
  const { addSession } = useSessionStore();

  const [feelings, setFeelings] = useState<FeelingItemProps[]>([]);
  const [feelingContent, setFeelingContent] = useState("");

  const handleFeelings = useCallback((newFeelings: FeelingItemProps[]) => {
    setFeelings(newFeelings);
  }, []);

  const handleFeelingContent = useCallback((content: string) => {
    setFeelingContent(content);
  }, []);

  const onSubmit = useCallback(() => {
    if (feelings.length === 0) {
      alert("Don't forget to select how you felt after the session!");
      return;
    }

    const session = {
      id: Date.now().toString(),
      duration: parseInt(duration || "10", 10),
      startTime: new Date(parseInt(startTime || "0", 10)),
      endTime: new Date(parseInt(endTime || "0", 10)),
      feelings: feelings.map((f) => f.name),
      customFeeling: feelingContent || undefined,
    };

    addSession(session);
    router.push("/");
  }, [
    feelings,
    feelingContent,
    duration,
    startTime,
    endTime,
    addSession,
    router,
  ]);

  const onReset = useCallback(() => {
    setFeelings([]);
    setFeelingContent("");
  }, []);

  return (
    <Page>
      <Section title="Practice" subtitle="How did your meditation session go?">
        <Text style={FontStyles.h3}>Session Summary</Text>
        <Text style={FontStyles.normal}>
          You completed a {duration} minute meditation session.
        </Text>

        <VerticalSpacer by={3} />
        <Text style={FontStyles.h3}>How did you feel after the session?</Text>
        <VerticalSpacer by={0.5} />
        <FeelingList
          handleFeelings={handleFeelings}
          feelings={feelings}
          feelingContent={feelingContent}
          handleFeelingContent={handleFeelingContent}
        />

        <VerticalSpacer by={2} />
        <View style={buttonGroupStyles.buttonGroupEnd}>
          <Button type="secondary" onPress={onReset}>
            Reset
          </Button>
          <HorizontalSpacer by={1} />
          <Button type="primary" onPress={onSubmit}>
            Submit
          </Button>
        </View>
      </Section>
    </Page>
  );
}

const styles = StyleSheet.create({
  // Add any additional styles if needed
});
