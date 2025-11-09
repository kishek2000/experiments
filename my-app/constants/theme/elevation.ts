import { StyleSheet } from "react-native";

export const ELEVATION_NORMAL = 5;
export const ELEVATION_SUBTLE = 2.5;

export const ShadowStyles = StyleSheet.create({
  normal: {
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  subtle: {
    shadowColor: "black",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  none: {
    shadowColor: "unset",
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
  },
});
