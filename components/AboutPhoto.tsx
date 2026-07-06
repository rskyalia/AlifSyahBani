export default function AboutPhoto() {
  return (
    <div className="flex justify-center md:justify-end">
      <div className="relative">
        {/* Glow behind photo */}
        <div
          className="
            absolute -inset-4 rounded-3xl
            bg-linear-to-br from-blue-600/30 via-blue-500/10 to-transparent
            blur-2xl
          "
          aria-hidden
        />

        <img
          src="/about/fotodiri.jpg"
          alt="Alif portrait"
          className="
            relative z-10
            w-[300px] sm:w-[340px] md:w-[360px] h-auto
            rounded-2xl object-cover
            border border-white/15
            shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(59,130,246,0.15)]
            transition-transform duration-500 hover:scale-[1.02]
          "
        />
      </div>
    </div>
  );
}
