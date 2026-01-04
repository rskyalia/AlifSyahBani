import WritingCard from "./WritingCard";
import { writings } from "./writing.data";

export default function WritingGrid() {
  return (
    <section className="min-h-screen px-8 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-12 text-4xl font-semibold text-white">Projects</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {writings.map((w) => (
            <WritingCard key={w.title} {...w} />
          ))}
        </div>
      </div>
    </section>
  );
}
