"use client";

import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import Typewriter from "./Typewriter";
import Earth from "./Earth";

export default function Hero() {
  return (
    <section
      id="home"
      className="
        min-h-screen
        flex flex-col-reverse md:flex-row
        items-center
        justify-center
        gap-12
        px-6
        md:px-20
        pt-24 md:pt-0
      "
    >
      {/* LEFT CONTENT */}
      <div className="w-full max-w-xl text-center md:text-left">
        <div className="flex justify-center md:justify-start gap-5 mb-6 text-blue-200/60">
          <SocialIcon
            href="https://github.com/rskyalia"
            icon={<FaGithub />}
            variant="github"
          />

          <SocialIcon
            href="https://www.linkedin.com/in/alif-syahbani-01056b304/"
            icon={<FaLinkedin />}
            variant="linkedin"
          />

          <SocialIcon
            href="https://www.instagram.com/syah.baani/"
            icon={<FaInstagram />}
            variant="instagram"
          />

          <SocialIcon
            href="https://www.tiktok.com/@syah.baani"
            icon={<FaTiktok />}
            variant="tiktok"
          />

          <SocialIcon href="https://x.com" icon={<FaXTwitter />} variant="x" />

          <SocialIcon
            href="mailto:muhammad.alif396177@smk.belajar.id"
            icon={<MdEmail />}
            variant="gmail"
          />
        </div>

        {/* Heading */}
        <h1
          className="
            font-cabinet font-bold mb-4
            text-4xl leading-tight
            sm:text-5xl
            md:text-6xl md:leading-[60px]
            bg-linear-to-br from-white via-blue-100 to-blue-400
            bg-clip-text text-transparent
            drop-shadow-[0_0_30px_rgba(59,130,246,0.35)]
          "
        >
          Hi, I'm Alif Sya'bani
        </h1>

        {/* Subheading */}
        <p
          className="
            font-cabinet text-blue-100/70 mb-6
            text-base
            sm:text-lg
            md:text-2xl
          "
        >
          Vocational HighSchool Student | Network Computer Engineer @ SMK
          Nuris Jember
        </p>

        {/* Typewriter */}
        <Typewriter />
      </div>

      {/* RIGHT CONTENT – EARTH */}
      <div
        className="
          w-full
          max-w-md
          h-[300px]
          sm:h-[360px]
          md:h-[520px]
          hidden sm:block
        "
      >
        <Earth />
      </div>
    </section>
  );
}

function SocialIcon({
  href,
  icon,
  variant,
}: {
  href: string;
  icon: React.ReactNode;
  variant: "github" | "linkedin" | "instagram" | "tiktok" | "x" | "gmail";
}) {
  // shadow shown on hover per variant
  const shadows: Record<string, string> = {
    github:    "hover:shadow-[0_0_22px_rgba(255,255,255,0.55)] hover:text-black",
    linkedin:  "hover:shadow-[0_0_22px_rgba(56,189,248,0.6)]  hover:text-sky-700",
    instagram: "hover:shadow-[0_0_26px_rgba(236,72,153,0.65)] hover:text-white",
    tiktok:    "hover:shadow-[0_0_26px_rgba(236,72,153,0.55)] hover:text-white",
    x:         "hover:shadow-[0_0_22px_rgba(255,255,255,0.75)] hover:text-black",
    gmail:     "hover:shadow-[0_0_26px_rgba(239,68,68,0.55)]  hover:text-white",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        social-icon social-icon-${variant}
        p-3
        rounded-full
        text-lg sm:text-xl
        text-white/70
        transition-all duration-500 ease-in-out
        hover:scale-110
        ${shadows[variant]}
      `}
    >
      {icon}
    </a>
  );
}

