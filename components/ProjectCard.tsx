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
    <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden hover:border-white/20 transition">
      {/* Image */}
      <img src={image} alt={title} className="h-48 w-full object-cover" />

      {/* Content */}
      <div className="p-6 flex flex-col gap-4">
        {/* Title + Icons */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <div className="flex gap-3 text-white/70">
            {demo && (
              <a href={demo} target="_blank">
                <ExternalLink className="w-5 h-5 hover:text-white" />
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-white/70 leading-relaxed">{description}</p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t}
              className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/80"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
