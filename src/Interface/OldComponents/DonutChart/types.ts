import type { ReactNode } from "react";
import type { EasingFunction, StyleProp, ViewStyle } from "react-native";
import type { Linecap } from "react-native-svg";

export interface ChartDatum {
  label: string;
  value: number;
  stroke?: string | string[];
  style?: StyleProp<ViewStyle>;
}

export type RenderPhase = "INITIAL" | "UPDATE";

export interface DonutProps {
  delay?: number;
  duration?: number;
  data: ChartDatum[];
  children?: ReactNode;
  strokeWidth?: number;
  easing?: EasingFunction;
  strokeLinecap?: Linecap;
  style?: StyleProp<ViewStyle>;
  onMeasure?: (dimensions: number) => void;
}
