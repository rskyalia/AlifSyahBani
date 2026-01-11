import { Github, ExternalLink } from "lucide-react";

export default function WritingCard({
  title,
  excerpt,
  date,
  category,
  cover,
  github,
  website,
}: {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  cover: string;
  github: string;
  website: string;
}) {
  return (
    <article
      className="
      group
      relative
      overflow-hidden
      rounded-2xl
      border border-white/10
      bg-white/5
      backdrop-blur-xl
      transition-all duration-300
      hover:border-white/20
      hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]
    "
    >
      {/* subtle glass glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-6rem] h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl" />
      </div>

      {/* Cover (NO dimming, NO overlay) */}
      <div className="h-56 overflow-hidden">
        <img src={cover} alt={title} className="h-full w-full object-cover" />
      </div>

      {/* Content */}
      <div className="relative p-6">
        <p className="text-xs uppercase tracking-widest text-white/60">
          {category} · {date}
        </p>

        <h3 className="mt-3 text-xl font-semibold text-white leading-snug">
          {title}
        </h3>

        <p className="mt-4 text-sm text-white/75 leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="
            inline-flex items-center gap-2
            text-sm text-white/70
            hover:text-white
            transition
          "
          >
            <ExternalLink size={16} />
            Visit
          </a>

          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="
            inline-flex items-center gap-2
            rounded-full
            border border-white/20
            bg-white/5
            px-4 py-1.5
            text-sm text-white/70
            backdrop-blur-md
            hover:border-white/40
            hover:bg-white/10
            hover:text-white
            transition
          "
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>
    </article>
  );
}
