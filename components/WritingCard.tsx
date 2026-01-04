import { Github, ExternalLink } from 'lucide-react'

export default function WritingCard({
  title,
  excerpt,
  date,
  category,
  cover,
  github,
  website,
}: {
  title: string
  excerpt: string
  date: string
  category: string
  cover: string
  github: string
  website: string
}) {
  return (
    <article
      className="
        overflow-hidden
        rounded-2xl
        border border-white/10
        bg-gradient-to-b from-[#111] to-[#0b0b0b]
        transition
        hover:border-white/20
        hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]
      "
    >
      {/* Cover */}
      <div className="h-56 bg-black">
        <img
          src={cover}
          alt={title}
          className="h-full w-full object-cover opacity-90"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-xs uppercase tracking-widest text-white/50">
          {category} · {date}
        </p>

        <h3 className="mt-3 text-xl font-semibold text-white leading-snug">
          {title}
        </h3>

        <p className="mt-4 text-sm text-white/70 leading-relaxed line-clamp-3">
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
              border border-white/15
              px-4 py-1.5
              text-sm text-white/60
              hover:border-white/30
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
  )
}
