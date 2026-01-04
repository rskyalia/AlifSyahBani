"use client";

import { useEffect, useRef, useState } from "react";

export default function ExperienceAwards() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="min-h-screen px-6 md:px-20 py-32">
      <div
        className={`
          grid grid-cols-1 md:grid-cols-2 gap-20
          transition-all duration-1000
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
        `}
      >
        {/* Experiences */}
        <div>
          <h2 className="font-cabinet text-3xl font-bold mb-10">Experiences</h2>

          <ul className="space-y-8 text-white/80">
            <li>
              <p className="font-semibold text-white">
                apprenticeship @ E-Solusindo Software House
              </p>
              <p className="text-sm">July 2025 – Desember 2025</p>
            </li>

            <li>
              <p className="font-semibold text-white">
                Robotics Leader @ SMK Nuris Jember
              </p>
              <p className="text-sm">August 2024 – August 2025</p>
            </li>

            <li>
              <p className="font-semibold text-white">
                Coordinator Public Speaking @ Language Extracurricular
              </p>
              <p className="text-sm">August 2024 – August 2025</p>
            </li>
          </ul>
        </div>

        {/* Awards */}
        <div>
          <h2 className="font-cabinet text-3xl font-bold mb-10">Awards</h2>

          <ul className="space-y-8 text-white/80">
            <li>
              <p className="font-semibold text-white">
                Finalists of the Provincial News Anchor - BIG SMK JATIM CUP 1 2024 Festival @ Brawijaya University.
              </p>
              <p className="text-sm">November 2024</p>
            </li>

            <li>
              <p className="font-semibold text-white">
                First place in the Jember Regency News Anchor - BIG SMK JATIM CUP 1 2024 Festival.
              </p>
              <p className="text-sm">November 2024</p>
            </li>

            <li>
              <p className="font-semibold text-white">
                Second place in the Jember Regency News Anchor - BIG SMK JATIM CUP 2 2025 Festival.
              </p>
              <p className="text-sm">September 2025</p>
            </li>

            <li>
              <p className="font-semibold text-white">
                Second Runner Up Story Telling Competition @ E-Fest UNARS 2023
              </p>
              <p className="text-sm">August 2023</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
