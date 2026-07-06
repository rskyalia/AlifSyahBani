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
    <article className="group glass-card card-float rounded-2xl overflow-hidden">
      {/* Cover */}
      <div className="relative w-full overflow-hidden">
        <img
          src={cover}
          alt={title}
          className="w-full h-auto block"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-300/80">
            {category}
          </span>
          <span className="text-xs text-white/30">{date}</span>
        </div>

        <h3 className="mt-3 text-base md:text-lg font-semibold text-white leading-snug group-hover:text-blue-100 transition-colors">
          {title}
        </h3>

        <p className="mt-3 text-xs md:text-sm text-white/50 leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-3">
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs py-2 px-4"
          >
            <ExternalLink size={13} />
            Visit Site
          </a>

          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs py-2 px-4"
          >
            <Github size={13} />
            GitHub
          </a>
        </div>
      </div>
    </article>
  );
}
