import WritingCard from "./WritingCard";
import SectionHeader from "./SectionHeader";
import { writings } from "./writing.data";

export default function WritingGrid() {
  return (
    <section className="min-h-screen px-4 sm:px-8 py-24 md:py-28">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          label="Portfolio"
          title="Projects"
          description="Web applications and portfolio sites I've designed and built."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {writings.map((w) => (
            <WritingCard key={w.title} {...w} />
          ))}
        </div>
      </div>
    </section>
  );
}
