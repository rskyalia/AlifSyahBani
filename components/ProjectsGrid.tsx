import ProjectCard from './ProjectCard'
import { projects } from './projects.data'

export default function ProjectsGrid() {
  return (
    <section className="min-h-screen px-8 py-24">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p) => (
          <ProjectCard key={p.title} {...p} />
        ))}
      </div>
    </section>
  )
}
