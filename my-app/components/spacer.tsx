import React, { FC } from "react";
import { View } from "react-native";

import { GAP_VERTICAL, GAP_HORIZONTAL } from "@/constants/theme/gap";

export interface GapProps {
  by?: number;
}

export const VerticalSpacer: FC<GapProps> = ({ by = 1 }) => (
  <View style={{ marginBottom: GAP_VERTICAL * by }} />
);

export const HorizontalSpacer: FC<GapProps> = ({ by = 1 }) => (
  <View
    style={{ marginRight: GAP_HORIZONTAL * by }}
    testID={"horizontal-spacer"}
  />
);
