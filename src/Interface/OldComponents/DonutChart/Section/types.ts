import type { ReactNode } from "react";
import type { EasingFunction, StyleProp, ViewStyle } from "react-native";
import type { Linecap } from "react-native-svg";
import type { RenderPhase } from "../types";
import type { Interpolation } from "./Interpolation";

export interface SectionProps {
  size: number;
  gap: number;
  value: number;
  delay: number;
  radius: number;
  center: number;
  stroke: string;
  duration: number;
  rotation: number;
  strokeWidth: number;
  children?: ReactNode;
  circumference: number;
  strokeLinecap: Linecap;
  easing: EasingFunction;
  renderPhase: RenderPhase;
  style?: StyleProp<ViewStyle>;
}

export interface SectionState {
  drawInterpolation: Interpolation<number>;
  rotateInterpolation: Interpolation<string>;
}
