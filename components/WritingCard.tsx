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
      border border-white/8
      bg-white/4
      backdrop-blur-sm
      transition-all duration-300
      hover:border-white/15
      hover:bg-white/6
      hover:shadow-[0_16px_48px_rgba(0,0,0,0.7)]
    "
    >
      {/* Cover */}
      <div className="h-52 overflow-hidden">
        <img src={cover} alt={title} className="h-full w-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-white/35">
          {category} · {date}
        </p>

        <h3 className="mt-2.5 text-base font-semibold text-white leading-snug">
          {title}
        </h3>

        <p className="mt-3 text-xs text-white/50 leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-between">
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="
            inline-flex items-center gap-1.5
            text-xs text-white/40
            hover:text-white/80
            transition
          "
          >
            <ExternalLink size={14} />
            Visit
          </a>

          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="
            inline-flex items-center gap-1.5
            rounded-full
            border border-white/10
            bg-white/5
            px-3.5 py-1
            text-xs text-white/45
            hover:border-white/20
            hover:bg-white/8
            hover:text-white/80
            transition
          "
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </a>
        </div>
      </div>
    </article>
  );
}
