import { ExternalLink } from "lucide-react";

type Props = {
  title: string;
  image: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
};

export default function ProjectCard({
  title,
  image,
  description,
  tech,
  github,
  demo,
}: Props) {
  return (
  <div
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
    {/* Image */}
    <img
      src={image}
      alt={title}
      className="h-48 w-full object-cover"
    />

    {/* Content */}
    <div className="p-5 flex flex-col gap-3">
      {/* Title + Visit */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-white leading-snug">
          {title}
        </h3>

        {demo && (
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className="
              shrink-0
              inline-flex items-center gap-1.5
              text-xs text-white/40
              hover:text-white/80
              transition
            "
          >
            <ExternalLink className="w-4 h-4" />
            Visit
          </a>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-white/50 leading-relaxed">
        {description}
      </p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1.5 mt-1">
        {tech.map((t) => (
          <span
            key={t}
            className="
              px-2.5 py-0.5
              text-xs
              rounded-full
              bg-white/6
              border border-white/8
              text-white/50
            "
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  </div>
)

}
