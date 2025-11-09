import { Stack } from "expo-router";
import React, { FC } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";

import { VerticalSpacer } from "./spacer";

interface PageProps {
  children: React.ReactNode;
  onRefresh?: VoidFunction;
  refreshing?: boolean;
}

export const Page: FC<PageProps> = ({
  children,
  onRefresh = () => {},
  refreshing = false,
}) => {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={PageStyles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {children}
          <VerticalSpacer by={10} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const PageStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    position: "relative",
    minWidth: "100%",
    minHeight: "100%",
  },
});
