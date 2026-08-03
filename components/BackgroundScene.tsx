"use client";

import { useTheme } from "./ThemeContext";
import SpaceBackground from "./SpaceBackground";
import RoomBackground from "./RoomBackground";
import PlanetModel from "./PlanetModel";

export default function BackgroundScene() {
  const { theme } = useTheme();

  return (
    <>
      {theme === "dark" ? <SpaceBackground /> : <RoomBackground />}
      <div className="model-bg-canvas">
        <PlanetModel theme={theme} />
      </div>
    </>
  );
}
