import React from "react";
import { Composition } from "remotion";
import { LiminalismosVideo } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Liminalismos"
        component={LiminalismosVideo}
        durationInFrames={500}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
