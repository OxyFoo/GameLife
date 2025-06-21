import { useRef } from "react";

export const useController = <T>(Controller: T) => {
  const controller = useRef(Controller);
  return controller.current;
};
