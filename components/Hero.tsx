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
        {/* Social Icons */}
        <div className="flex justify-center md:justify-start gap-5 mb-6 text-white/70">
          <SocialIcon href="https://github.com/rskyalia" icon={<FaGithub />} />
          <SocialIcon
            href="https://www.linkedin.com/in/alif-syahbani-01056b304/"
            icon={<FaLinkedin />}
          />
          <SocialIcon
            href="https://www.instagram.com/syah.baani/"
            icon={<FaInstagram />}
          />
          <SocialIcon
            href="https://www.tiktok.com/@syah.baani"
            icon={<FaTiktok />}
          />
          <SocialIcon href="https://x.com" icon={<FaXTwitter />} />
          <SocialIcon
            href="mailto:muhammad.alif396177@smk.belajar.id"
            icon={<MdEmail />}
          />
        </div>
        

        {/* Heading */}
        <h1
          className="
            font-cabinet font-bold text-white mb-4
            text-4xl leading-tight
            sm:text-5xl
            md:text-6xl md:leading-[60px]
          "
        >
          Hi, I'm Alif Sya'bani
        </h1>

        {/* Subheading */}
        <p
          className="
            font-cabinet text-white/80 mb-6
            text-base
            sm:text-lg
            md:text-2xl
          "
        >
          Student Candidate | Computer Engineering @ Brawijaya University
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
}: {
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      className="
        text-lg sm:text-xl
        text-white/70
        transition
        hover:text-white
      "
    >
      {icon}
    </a>
  );
}
