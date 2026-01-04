import { Github } from 'lucide-react'

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
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-black transition hover:border-white/20">
      
      {/* Cover */}
      <div className="h-56 overflow-hidden">
        <img
          src={cover}
          alt={title}
          className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-xs uppercase tracking-widest text-white/50">
          {category} · {date}
        </p>

        <h3 className="mt-3 text-2xl font-medium text-white leading-snug">
          {title}
        </h3>

        <p className="mt-4 text-sm text-white/70 leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          {/* Visit */}
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/60 hover:text-white transition"
          >
            Visit →
          </a>

          {/* GitHub Button */}
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/70 hover:border-white/30 hover:text-white transition"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>
    </article>
  )
}
