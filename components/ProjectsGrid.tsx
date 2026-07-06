import ProjectCard from "./ProjectCard";
import SectionHeader from "./SectionHeader";
import { projects } from "./projects.data";

export default function ProjectsGrid() {
  return (
    <section className="min-h-screen px-4 sm:px-8 py-24 md:py-28">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Showcase"
          title="Moments & Achievements"
          description="Highlights from competitions, events, and leadership roles throughout my journey."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
