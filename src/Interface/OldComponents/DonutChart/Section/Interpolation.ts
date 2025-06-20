export class Interpolation<T extends string | number> {
  outputRange: T[];
  inputRange: number[];
  constructor(...range: T[]) {
    this.outputRange = range;
    this.inputRange = Array.from(range, (_, i) => i);
  }

  public add(value: T) {
    return new Interpolation(...this.outputRange, value);
  }

  public get toValue() {
    return this.inputRange[this.inputRange.length - 1];
  }
}
