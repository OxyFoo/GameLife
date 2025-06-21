import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  inner: {
    position: "relative",
    flex: 1,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-90deg" }],
  },
});
