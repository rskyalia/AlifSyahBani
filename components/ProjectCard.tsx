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
  demo,
}: Props) {
  return (
    <div className="group glass-card rounded-2xl overflow-hidden hover:-translate-y-1">
      {/* Image with overlay */}
      <div className="relative overflow-hidden h-48">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-white leading-snug group-hover:text-blue-100 transition-colors">
            {title}
          </h3>

          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="
                shrink-0 inline-flex items-center gap-1.5
                text-xs text-white/40
                hover:text-blue-300 transition-colors
              "
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Visit
            </a>
          )}
        </div>

        <p className="text-xs text-white/50 leading-relaxed line-clamp-3">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {tech.map((t) => (
            <span
              key={t}
              className="
                px-2.5 py-0.5 text-xs rounded-full
                bg-blue-500/10 border border-blue-500/20
                text-blue-200/60
              "
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
