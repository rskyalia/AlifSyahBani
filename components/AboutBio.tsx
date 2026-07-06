export default function AboutBio() {
  return (
    <div className="text-white max-w-xl">
      <p className="section-label mb-5">About Me</p>

      <h1 className="section-title mb-8">Muhammad Alif Sya&apos;bani</h1>

      <div className="space-y-4 text-blue-100/65 leading-relaxed text-sm md:text-base">
        <p>
          Hello, I&apos;m Alif. I am currently pursuing a degree in{" "}
          <span className="font-semibold text-blue-100/90">
            Informatics Engineering at Politeknik Negeri Malang
          </span>
          , where I continue to strengthen
          my knowledge in software development, computer systems, and emerging
          technologies. Previously, I graduated from a vocational high school
          with a background in Computer and Network Engineering, which provided
          me with a solid technical foundation and sparked my passion for
          technology.
        </p>

        <p>
          My interests lie at the intersection of software engineering, artificial
          intelligence, and user-centered design. I am passionate about exploring
          the potential of AI and Machine Learning to create innovative solutions
          for real-world challenges — and I believe powerful technology should
          always be paired with intuitive, engaging user experiences.
        </p>

        <p>
          Beyond academics, I have experience as a Programmer, Graphic Designer,
          and Public Speaker, allowing me to blend technical expertise with
          creativity and effective communication. I enjoy building impactful
          digital products, designing user-friendly interfaces, and presenting
          ideas that inspire others.
        </p>

        <p>
          Outside of technology, I enjoy listening to music, cycling to explore
          new places, and sharing experiences in tech, design, and personal growth
          through social media.
        </p>
      </div>

      <div className="glass-card rounded-xl p-4 mt-8">
        <p className="text-white/70 text-sm">
          Let&apos;s connect —{" "}
          <a
            href="mailto:muhammad.alif396177@smk.belajar.id"
            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors font-medium"
          >
            muhammad.alif396177@smk.belajar.id
          </a>
        </p>
      </div>
    </div>
  );
}
