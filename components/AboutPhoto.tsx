export default function AboutPhoto() {
  return (
    <div className="flex justify-center md:justify-end">
      <div className="relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-none">
        {/* Glow behind photo */}
        <div
          className="
            absolute -inset-4 rounded-3xl
            bg-gradient-to-br from-amber-500/30 via-amber-400/10 to-transparent
            blur-2xl
          "
          aria-hidden
        />

        <img
          src="/about/fotodiri.jpg"
          alt="Muhammad Alif Sya'bani — Informatics Engineering student and software developer"
          className="
            relative z-10 w-full
            sm:w-[300px] md:w-[340px] lg:w-[360px] h-auto
            rounded-2xl object-cover
            border border-white/15
            shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(245,158,11,0.2)]
          "
        />
      </div>
    </div>
  );
}
