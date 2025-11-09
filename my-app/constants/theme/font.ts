import { StyleSheet } from "react-native";

import { fontColor, fontMetadataColor } from "./colors";

export const FontStyles = StyleSheet.create({
  entryHeading: {
    fontSize: 56,
    fontFamily: "Pompiere_400Regular",
    color: "white",
  },
  h1: {
    fontSize: 32,
    fontFamily: "Pompiere_400Regular",
    color: fontColor,
  },
  h2: {
    fontSize: 32,
    fontFamily: "Pompiere_400Regular",
    color: fontColor,
  },
  h3: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 12,
    fontFamily: "Niramit_700Bold",
    color: fontColor,
  },
  h4: {
    fontSize: 16,
    fontFamily: "Niramit_700Bold",
    color: fontColor,
  },
  h5: {
    fontSize: 12,
    fontFamily: "Niramit_300Light",
    color: fontColor,
  },
  h6: {
    fontSize: 12,
    fontFamily: "Niramit_300Light",
    color: fontColor,
  },
  metadata: {
    fontSize: 11,
    fontFamily: "Niramit_500Medium",
    color: fontMetadataColor,
    textTransform: "uppercase",
  },
  strong: {
    fontFamily: "Niramit_700Bold",
    color: fontColor,
  },
  larger: {
    fontSize: 20,
    fontFamily: "Niramit_500Medium",
    color: fontColor,
  },
  largerLight: {
    fontSize: 20,
    fontFamily: "Niramit_300Light",
    color: fontColor,
  },
  normal: {
    fontSize: 14,
    fontFamily: "Niramit_400Regular",
    color: fontColor,
  },
  normalUpper: {
    fontSize: 14,
    fontFamily: "Niramit_400Regular",
    color: fontColor,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  normalLight: {
    fontSize: 14,
    fontFamily: "Niramit_300Light",
    color: fontColor,
  },
  subtle: {
    fontSize: 12,
    fontFamily: "Niramit_500Medium",
    color: fontColor,
  },
  compactButton: {
    fontSize: 14,
    fontFamily: "Niramit_700Bold",
    color: fontColor,
  },
  success: {
    fontSize: 24,
    fontFamily: "Niramit_700Bold",
    color: fontColor,
  },
});
