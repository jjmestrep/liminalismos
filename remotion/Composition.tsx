import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";

const CREAM = "#fafafa";
const DARK = "#2c2c2c";
const GREY = "#666";

const FadeText: React.FC<{
  text: string;
  delay: number;
  style?: React.CSSProperties;
}> = ({ text, delay, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame - delay, [0, 25], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

const LineDivider: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const width = interpolate(frame - delay, [0, 30], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width: `${width}%`,
        maxWidth: 120,
        height: 1,
        backgroundColor: GREY,
        margin: "20px auto",
        opacity: 0.4,
      }}
    />
  );
};

export const LiminalismosVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade out at the end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: CREAM,
        fontFamily: "Georgia, 'Times New Roman', serif",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Scene 1: Title */}
      <Sequence from={0} durationInFrames={80}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <FadeText
            text="Liminalismos"
            delay={10}
            style={{
              fontSize: 64,
              fontStyle: "italic",
              fontWeight: 400,
              color: DARK,
              letterSpacing: "-0.02em",
            }}
          />
          <FadeText
            text="pensando desde los márgenes"
            delay={30}
            style={{
              fontSize: 20,
              fontStyle: "italic",
              color: GREY,
              marginTop: 12,
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: What is it */}
      <Sequence from={80} durationInFrames={100}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "0 80px",
            textAlign: "center",
          }}
        >
          <FadeText
            text="Un cuaderno de cartografías interiores"
            delay={0}
            style={{
              fontSize: 36,
              color: DARK,
              fontWeight: 400,
              lineHeight: 1.4,
            }}
          />
          <LineDivider delay={20} />
          <FadeText
            text="lugares, símbolos y sistemas para pensar mejor"
            delay={30}
            style={{
              fontSize: 20,
              color: GREY,
              fontStyle: "italic",
              marginTop: 8,
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: The maps */}
      <Sequence from={180} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "0 80px",
            textAlign: "center",
            gap: 16,
          }}
        >
          <FadeText
            text="Escribo para dibujar mapas:"
            delay={0}
            style={{
              fontSize: 28,
              color: DARK,
              marginBottom: 20,
            }}
          />
          <FadeText
            text="de ciudades que se vuelven ideas"
            delay={20}
            style={{ fontSize: 22, color: GREY, fontStyle: "italic" }}
          />
          <FadeText
            text="de ideas que se vuelven rituales"
            delay={40}
            style={{ fontSize: 22, color: GREY, fontStyle: "italic" }}
          />
          <FadeText
            text="de rituales que se vuelven destino"
            delay={60}
            style={{ fontSize: 22, color: GREY, fontStyle: "italic" }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 4: The mix */}
      <Sequence from={300} durationInFrames={110}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "0 80px",
            textAlign: "center",
            gap: 14,
          }}
        >
          <FadeText
            text="Una mezcla rara y necesaria"
            delay={0}
            style={{
              fontSize: 30,
              color: DARK,
              marginBottom: 20,
            }}
          />
          <FadeText
            text="Lo bello que orienta."
            delay={20}
            style={{ fontSize: 22, color: GREY }}
          />
          <FadeText
            text="Lo íntimo que revela."
            delay={35}
            style={{ fontSize: 22, color: GREY }}
          />
          <FadeText
            text="Lo útil que sostiene."
            delay={50}
            style={{ fontSize: 22, color: GREY }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 5: Closing */}
      <Sequence from={410} durationInFrames={90}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "0 80px",
            textAlign: "center",
          }}
        >
          <FadeText
            text="Porque lo importante casi nunca grita,"
            delay={0}
            style={{
              fontSize: 24,
              color: GREY,
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          />
          <FadeText
            text="se insinúa en la luz, en la forma y en el umbral."
            delay={20}
            style={{
              fontSize: 24,
              color: GREY,
              fontStyle: "italic",
              lineHeight: 1.6,
              marginTop: 8,
            }}
          />
          <LineDivider delay={45} />
          <FadeText
            text="J."
            delay={55}
            style={{
              fontSize: 28,
              color: DARK,
              marginTop: 16,
            }}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
