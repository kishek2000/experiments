import { useState, useMemo, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { CustomSlider } from "@/components/custom-slider";

import { Page } from "@/components/page";
import { Section } from "@/components/section";
import { Button } from "@/components/button";
import { VerticalSpacer } from "@/components/spacer";
import { ActiveSessionOverlay } from "@/components/active-session-overlay";
import { FontStyles } from "@/constants/theme/font";
import { MeditationTimer } from "@/services/meditation-timer";

const GAYATRI_REPETITIONS = 11;
const DURATION_OPTIONS = [5, 10, 15, 20, 30]; // in minutes

export default function PracticeSessionScreen() {
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [sessionIsActive, setSessionIsActive] = useState(false);
  const [timer, setTimer] = useState<MeditationTimer | null>(null);

  const [estimatedTotalDuration, setEstimatedTotalDuration] =
    useState<number>(0);

  // Load audio duration on mount to calculate total session duration
  useEffect(() => {
    const loadDuration = async () => {
      const timer = new MeditationTimer(selectedDuration * 60);
      const totalDuration = await timer.getTotalDuration();
      setEstimatedTotalDuration(totalDuration);
    };
    loadDuration();
  }, [selectedDuration]);

  // Calculate session finish time based on estimated total duration
  const sessionFinishDate = useMemo(() => {
    if (estimatedTotalDuration === 0) return new Date();
    const currentTime = new Date().getTime();
    const endTime = currentTime + estimatedTotalDuration * 1000;
    return new Date(endTime);
  }, [estimatedTotalDuration]);

  const sessionFinishTime = useMemo(() => {
    return new Date(sessionFinishDate).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
      minute: "numeric",
    });
  }, [sessionFinishDate]);

  const onStartSession = async () => {
    // Create timer with the selected meditation duration
    const meditationTimer = new MeditationTimer(selectedDuration * 60);
    setTimer(meditationTimer);
    setSessionIsActive(true);
    const startTime = new Date().getTime();

    try {
      await meditationTimer.start();
      // Session completed successfully
      const endTime = new Date().getTime();
      setSessionIsActive(false);
      router.push({
        pathname: "/practice-log",
        params: {
          duration: estimatedTotalDuration.toString(),
          startTime: startTime.toString(),
          endTime: endTime.toString(),
        },
      });
    } catch (error) {
      console.log("Session error:", error);
      setSessionIsActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timer) {
        timer.cleanup();
      }
    };
  }, [timer]);

  return (
    <Page>
      <Section title="Practice" subtitle="Meditate with the Gayatri mantra.">
        <Text style={FontStyles.h3}>Meditation Type</Text>
        <Text style={styles.durationText}>
          {GAYATRI_REPETITIONS}x Gayatri Mantra
        </Text>

        <VerticalSpacer by={2} />
        <Text style={FontStyles.h3}>Session Duration</Text>
        <Text style={styles.durationText}>{selectedDuration} minutes</Text>
        <VerticalSpacer by={0.5} />

        <CustomSlider
          style={styles.slider}
          minimumValue={5}
          maximumValue={30}
          step={5}
          value={selectedDuration}
          onValueChange={setSelectedDuration}
          minimumTrackTintColor="#020882"
          maximumTrackTintColor="#C4C4C4"
          thumbStyle={styles.sliderThumb}
        />

        <View style={styles.durationLabels}>
          {DURATION_OPTIONS.map((duration) => (
            <Text key={duration} style={styles.durationLabel}>
              {duration}m
            </Text>
          ))}
        </View>

        <VerticalSpacer by={2} />
        <Text style={FontStyles.normal}>
          Your session will finish at {sessionFinishTime}.
        </Text>

        <VerticalSpacer by={2} />
        <Button
          type="primary"
          onPress={onStartSession}
          isDisabled={sessionIsActive}
        >
          {sessionIsActive ? "Session in Progress..." : "Start Meditation"}
        </Button>
      </Section>

      <ActiveSessionOverlay
        sessionIsActive={sessionIsActive}
        sessionFinishDate={sessionFinishDate}
        sessionFinishTime={sessionFinishTime}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  durationText: {
    ...FontStyles.normal,
    fontSize: 36,
    textAlign: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderThumb: {
    backgroundColor: "#020882",
    width: 20,
    height: 20,
  },
  durationLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  durationLabel: {
    ...FontStyles.metadata,
    fontSize: 12,
  },
});
