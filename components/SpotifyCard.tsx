type Props = {
  embedId: string;
};

export default function SpotifyCard({ embedId }: Props) {
  return (
    <div
      className="
        rounded-xl overflow-hidden
        glass-card
        transition-transform duration-300
        hover:-translate-y-0.5
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
