import React from "react";
import {
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeTouchEvent,
  Text,
  View,
  StyleSheet,
} from "react-native";

import { borderRadiusSubtle } from "@/constants/theme/border-radius";
import {
  blue500,
  grayDark,
  grayLight,
  orange300,
  purple200,
  purpleColor,
} from "@/constants/theme/colors";
import { ShadowStyles } from "@/constants/theme/elevation";
import { FontStyles } from "@/constants/theme/font";
import { horizontalScale, verticalScale } from "@/constants/theme/sizing";

export type ButtonAppearance = "subtle" | "normal" | "long" | "accent";
export type ButtonType = "primary" | "secondary" | "tertiary" | "entry";
export type ButtonPaddingType = "compact" | "none" | "normal" | "entry";

export interface ButtonProps {
  children: React.ReactNode;
  type?: ButtonType;
  appearance?: ButtonAppearance;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  meta?: React.ReactNode;
  padding?: ButtonPaddingType;
  onPress?: (evt: NativeSyntheticEvent<NativeTouchEvent>) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const Button = ({
  type = "primary",
  appearance = "normal",
  onPress = noop,
  isDisabled = false,
  children,
  icon,
  meta,
  padding = "normal",
}: ButtonProps) => {
  const buttonStyleTag = `${type}Button`;
  const textStyleTag = `${type}Text`;
  const style = styles[appearance];

  const paddingStyle = paddingStyles[padding];
  const containerStyle = { ...style[buttonStyleTag], ...paddingStyle };

  const text = (
    <Text testID={"evergrowing-button-text"} style={style[textStyleTag]}>
      {children}
    </Text>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      style={containerStyle}
      disabled={isDisabled}
      testID={"evergrowing-button"}
    >
      {meta ? (
        <View style={baseStyles.meta}>
          {text}
          {meta}
        </View>
      ) : (
        text
      )}
      {icon ? <View style={baseStyles.icon}>{icon}</View> : null}
    </TouchableOpacity>
  );
};

const baseStyles = StyleSheet.create({
  normalButton: {
    borderRadius: borderRadiusSubtle,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    ...ShadowStyles.subtle,
  },
  subtleButton: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    ...ShadowStyles.none,
  },
  longButton: {
    borderRadius: borderRadiusSubtle,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "flex-start",
    width: "100%",
  },
  accentButton: {
    borderRadius: borderRadiusSubtle,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "flex-start",
    width: "100%",
    ...ShadowStyles.subtle,
  },
  normalText: {
    ...FontStyles.strong,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  entryText: {
    ...FontStyles.normalLight,
    letterSpacing: 2,
  },
  subtleText: {
    ...FontStyles.strong,
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 2,
  },
  longText: {
    letterSpacing: 0,
    textTransform: "none",
    fontFamily: "Niramit_500Medium",
  },
  accentText: {
    letterSpacing: 0,
    textTransform: "none",
    fontFamily: "Niramit_500Medium",
  },
  icon: {
    paddingLeft: 8,
  },
  meta: {
    display: "flex",
  },
});

const paddingStyles = StyleSheet.create({
  entry: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(64),
  },
  normal: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(24),
  },
  compact: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(16),
  },
  none: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});

const buttonStyles = StyleSheet.create({
  entryButton: {
    ...baseStyles.normalButton,
    backgroundColor: blue500,
  },
  entryText: {
    ...baseStyles.entryText,
    color: "white",
  },
  primaryButton: {
    ...baseStyles.normalButton,
    backgroundColor: purpleColor,
  },
  primaryText: {
    ...baseStyles.normalText,
    color: "white",
  },
  secondaryButton: {
    ...baseStyles.normalButton,
    backgroundColor: "white",
  },
  secondaryText: {
    ...baseStyles.normalText,
    color: purpleColor,
  },
  tertiaryButton: {
    ...baseStyles.normalButton,
    backgroundColor: grayLight,
    ...ShadowStyles.none,
  },
  tertiaryText: {
    ...baseStyles.normalText,
    color: grayDark,
  },
});

const subtleButtonStyles = StyleSheet.create({
  primaryButton: baseStyles.subtleButton,
  primaryText: {
    ...baseStyles.subtleText,
    color: purpleColor,
  },
  secondaryButton: baseStyles.subtleButton,
  secondaryText: {
    ...baseStyles.subtleText,
    color: grayDark,
  },
  tertiaryButton: baseStyles.subtleButton,
  tertiaryText: {
    ...baseStyles.subtleText,
    color: grayDark,
  },
});

const longButtonStyles = StyleSheet.create({
  primaryButton: {
    ...baseStyles.longButton,
    backgroundColor: purpleColor,
  },
  primaryText: {
    ...baseStyles.longText,
    color: "white",
  },
  secondaryButton: {
    ...baseStyles.longButton,
    backgroundColor: "white",
  },
  secondaryText: {
    ...baseStyles.longText,
    color: purpleColor,
  },
  tertiaryButton: {
    ...baseStyles.longButton,
    backgroundColor: grayLight,
  },
  tertiaryText: {
    ...baseStyles.longText,
    color: grayDark,
  },
});

const accentButtonStyles = StyleSheet.create({
  primaryButton: {
    ...baseStyles.accentButton,
    backgroundColor: purpleColor,
  },
  primaryText: {
    ...baseStyles.accentText,
    color: "white",
  },
  secondaryButton: {
    ...baseStyles.accentButton,
    backgroundColor: "white",
    borderColor: purple200,
    borderWidth: 1,
  },
  secondaryText: {
    ...baseStyles.accentText,
    color: grayDark,
  },
  tertiaryButton: {
    ...baseStyles.accentButton,
    backgroundColor: "white",
    borderColor: orange300,
    borderWidth: 1,
  },
  tertiaryText: {
    ...baseStyles.accentText,
    color: grayDark,
  },
});

const styles: Record<ButtonAppearance, StyleSheet.NamedStyles<any>> = {
  normal: buttonStyles,
  long: longButtonStyles,
  subtle: subtleButtonStyles,
  accent: accentButtonStyles,
};

export const buttonGroupStyles = StyleSheet.create({
  buttonGroup: {
    display: "flex",
    flexDirection: "row",
  },
  buttonGroupEnd: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
