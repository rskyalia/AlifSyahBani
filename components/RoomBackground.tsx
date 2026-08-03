export default function RoomBackground() {
  return (
    <div className="room-bg">
      <div className="room-bg__glow room-bg__glow--1" />
      <div className="room-bg__glow room-bg__glow--2" />
      <div className="room-bg__floor" />

      {/* Floating dust particles */}
      <div className="room-bg__particles" aria-hidden>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="room-particle" />
        ))}
      </div>

      <div className="room-bg__vignette" />
    </div>
  );
}
