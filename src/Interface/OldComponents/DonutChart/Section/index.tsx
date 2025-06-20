import { Component } from "react";
import { Animated } from "react-native";
import { Circle, Svg } from "react-native-svg";
import { Controller } from "./Controller";
import { Styles } from "./Styles";
import type { SectionProps, SectionState } from "./types";

const AnimatedSVG = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export class Section extends Component<SectionProps, SectionState> {
  private draw = new Animated.Value(0);
  private rotate = new Animated.Value(0);
  private opacity = new Animated.Value(0);
  public state: SectionState = Controller.stateFrom(this.props);

  public override componentDidMount() {
    this.animate();
  }

  public override shouldComponentUpdate(nextProps: SectionProps) {
    if (nextProps.value !== this.props.value) {
      this.incrementInterpolations(nextProps);
      return false;
    }
    return true;
  }

  private animate() {
    const { easing } = this.props;
    const { drawInterpolation, rotateInterpolation } = this.state;
    const [delay, duration] = this.delay();
    Animated.parallel([
      Animated.timing(this.opacity, {
        delay,
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(this.draw, {
        delay,
        easing,
        duration,
        useNativeDriver: true,
        toValue: drawInterpolation.toValue,
      }),
      Animated.timing(this.rotate, {
        delay,
        easing,
        duration,
        useNativeDriver: true,
        toValue: rotateInterpolation.toValue,
      }),
    ]).start();
  }

  private delay() {
    const { duration } = this.props;
    if (this.isPhaseUpdate) {
      const updateDuration = duration / 2;
      return [updateDuration + 100, updateDuration];
    }
    return [this.phaseDelay, duration];
  }

  private incrementInterpolations(props: SectionProps) {
    const { drawInterpolation, rotateInterpolation } = this.state;
    const nextDraw = drawInterpolation.add(Controller.strokeDashoffset(props));
    const nextRotation = rotateInterpolation.add(`${props.rotation || 0}deg`);
    this.setState(
      {
        drawInterpolation: nextDraw,
        rotateInterpolation: nextRotation,
      },
      () => {
        this.animate();
      },
    );
  }

  private get phaseDelay() {
    const { renderPhase, delay = 0 } = this.props;
    return renderPhase === "INITIAL" ? delay : 0;
  }

  private get isPhaseUpdate() {
    const { renderPhase } = this.props;
    const { drawInterpolation } = this.state;
    return (
      renderPhase === "UPDATE" && drawInterpolation.inputRange.length === 2
    );
  }

  public override render() {
    const {
      size,
      style,
      radius,
      center,
      stroke,
      children,
      strokeWidth,
      strokeLinecap,
      circumference,
    } = this.props;
    const { drawInterpolation, rotateInterpolation } = this.state;
    return (
      <AnimatedSVG
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={[
          Styles.svg,
          {
            transform: [
              {
                rotateZ: this.rotate.interpolate(rotateInterpolation),
              },
            ],
          },
          style,
        ]}
      >
        <AnimatedCircle
          r={radius}
          cx={center}
          cy={center}
          stroke={stroke}
          originX={center}
          originY={center}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap={strokeLinecap}
          strokeDasharray={circumference}
          strokeDashoffset={this.draw.interpolate(drawInterpolation)}
          opacity={this.opacity.interpolate(Controller.opacityInterpolation)}
        />
        {children}
      </AnimatedSVG>
    );
  }
}
