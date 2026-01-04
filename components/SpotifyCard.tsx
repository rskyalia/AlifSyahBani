type Props = {
  embedId: string;
};

export default function SpotifyCard({ embedId }: Props) {
  return (
    <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
      <iframe
        src={`https://open.spotify.com/embed/track/${embedId
          .split(":")
          .pop()}`}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}

