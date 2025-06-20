import type { ChartDatum, RenderPhase } from "./types";

export class Controller {
  total: number;
  angles: number[];
  data: ChartDatum[];
  percentages: number[];
  renderPhase: RenderPhase = "INITIAL";
  constructor(data: ChartDatum[]) {
    this.data = data;
    this.total = this.sum();
    this.percentages = this.toStrokeLengths();
    this.angles = this.createAngles();
  }

  public update(data: ChartDatum[]) {
    if (data === this.data) {
      return;
    }
    this.renderPhase = "UPDATE";
    this.data = data;
    this.total = this.sum();
    this.percentages = this.toStrokeLengths();
    this.angles = this.createAngles();
  }

  private sum() {
    return this.data.reduce((acc, next) => (acc += next.value), 0);
  }

  private toStrokeLengths() {
    return this.data.map((d) => d.value / this.total);
  }

  private createAngles() {
    const { length } = this.data;
    const angles = new Array<number>(this.data.length).fill(0);
    for (let i = 1; i < length; i++) {
      angles[i] = angles[i - 1] + this.percentages[i - 1] * 360;
    }
    return angles;
  }

  public static parseStroke(label: string, stroke: string | string[]) {
    if (Array.isArray(stroke)) {
      if (stroke.length === 1) {
        return stroke[0];
      }
      return `url(#${label})`;
    }
    return stroke;
  }

  public static renderGradient(stroke: string | string[]): stroke is string[] {
    return Array.isArray(stroke) && stroke.length > 1;
  }
}
