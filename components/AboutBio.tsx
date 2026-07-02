export default function AboutBio() {
  return (
    <div className="text-white max-w-xl">
      <h1 className="
        text-5xl font-bold mb-8
        bg-linear-to-br from-white via-blue-100 to-blue-400
        bg-clip-text text-transparent
        drop-shadow-[0_0_25px_rgba(59,130,246,0.35)]
      ">Muhammad Alif Sya&apos;bani</h1>

      <div className="space-y-6 text-blue-100/70 leading-relaxed">
        <p>
          Hello, I&apos;m Alif. With a background in Computer and Network Engineering
          from vocational high school, I am now heading towards a major in
          Computer Engineering. I am eager to further deepen my expertise.
        </p>

        <p>
          My passion lies at the intersection of hard engineering and
          user-centric design. I am deeply enthusiastic about the potential of
          Artificial Intelligence (AI) and Machine Learning (ML) to reshape
          industries. However, I believe that great code needs a great
          interface that is why I dedicate my time to experimenting with modern
          web interfaces and UI/UX design to ensure that complex technologies
          remain accessible and intuitive.
        </p>

        <p>
          My ultimate goal is to bridge the gap between technical innovation and
          real-world application. I don&apos;t just want to write code I want to
          engineer impactful technology products that solve tangible problems
          for society.
        </p>

        <p>
          When I am away from the keyboard, you can find me immersing myself in
          music, exploring new destinations on my bike, or documenting my travel
          and tech journey on social media.
        </p>

        <p className="text-white">
          Let&apos;s Connect{" "}
          <a
            href="mailto:muhammad.alif396177@smk.belajar.id"
            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            muhammad.alif396177@smk.belajar.id
          </a>
        </p>
      </div>
    </div>
  );
}
