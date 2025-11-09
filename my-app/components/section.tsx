import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

import { FontStyles } from "@/constants/theme/font";
import { VerticalSpacer } from "./spacer";

export type SectionProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

export const Section: FC<SectionProps> = ({ children, title, subtitle }) => {
  return (
    <View style={SectionStyles.container}>
      {title ? (
        <>
          <Text style={SectionStyles.title}>{title}</Text>
          <VerticalSpacer by={0.25} />
          {subtitle ? (
            <>
              <Text style={SectionStyles.subtitle}>{subtitle}</Text>
              <VerticalSpacer by={2} />
            </>
          ) : null}
        </>
      ) : null}
      {children}
    </View>
  );
};

export const SectionStyles = StyleSheet.create({
  container: {
    marginTop: 56,
    marginLeft: 36,
    marginRight: 36,
  },
  title: {
    ...FontStyles.h1,
  },
  subtitle: {
    ...FontStyles.normalLight,
  },
});
