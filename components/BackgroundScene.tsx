"use client";
import { useTheme } from "./ThemeContext";
import RoomBackground from "./RoomBackground";
import SpaceBackground from "./SpaceBackground";

export default function BackgroundScene() {
  const { theme } = useTheme();
  return theme === "dark" ? <SpaceBackground /> : <RoomBackground />;
}
