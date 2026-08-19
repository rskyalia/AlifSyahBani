type Props = {
  embedId: string;
};

export default function SpotifyCard({ embedId }: Props) {
  return (
    <div
      className="
        rounded-2xl overflow-hidden
        glass-card-3d
        transition-all duration-300
        hover:-translate-y-1.5
      "
    >
      <iframe
        src={`https://open.spotify.com/embed/track/${embedId.split(":").pop()}`}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="block"
      />
    </div>
  );
}
