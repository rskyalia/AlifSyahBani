import { Github, ExternalLink } from "lucide-react";

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

    {/* Image (NO dimming) */}
    <img
      src={image}
      alt={title}
      className="h-48 w-full object-cover"
    />

    {/* Content */}
    <div className="relative p-6 flex flex-col gap-4">
      {/* Title + Visit */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          {title}
        </h3>

        {demo && (
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2
              text-sm text-white/70
              hover:text-white
              transition
            "
          >
            <ExternalLink className="w-5 h-5" />
            Visit
          </a>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-white/75 leading-relaxed">
        {description}
      </p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-2">
        {tech.map((t) => (
          <span
            key={t}
            className="
              px-3 py-1
              text-xs
              rounded-full
              bg-white/10
              text-white/80
              backdrop-blur-md
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
