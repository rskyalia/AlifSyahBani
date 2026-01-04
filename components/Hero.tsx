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
    <section id="home" className="min-h-screen flex items-center px-6 md:px-20">
      <div className="max-w-3xl">
          {/* Social Icons */}
          <div className="flex gap-5 mb-6 text-white/70">
            <SocialIcon
              href="https://github.com/rskyalia"
              icon={<FaGithub />}
              glow="hover:drop-shadow-[0_0_10px_rgba(180,180,180,0.8)]"
            />

            <SocialIcon
              href="https://www.linkedin.com/in/alif-syahbani-01056b304/"
              icon={<FaLinkedin />}
              glow="hover:drop-shadow-[0_0_10px_rgba(10,102,194,0.9)]"
            />

            <SocialIcon
              href="https://www.instagram.com/syah.baani/"
              icon={<FaInstagram />}
              glow="hover:drop-shadow-[0_0_10px_rgba(225,48,108,0.9)]"
            />

            <SocialIcon
              href="https://www.tiktok.com/@syah.baani"
              icon={<FaTiktok />}
              glow="hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]"
            />

            <SocialIcon
              href="https://x.com"
              icon={<FaXTwitter />}
              glow="hover:drop-shadow-[0_0_10px_rgba(255,165,0,0.9)]"
            />

            <SocialIcon
              href="mailto:muhammad.alif396177@smk.belajar.id"
              icon={<MdEmail />}
              glow="hover:drop-shadow-[0_0_10px_rgba(234,67,53,0.9)]"
            />
          </div>

          {/* Heading */}
          <h1
            className="
            font-cabinet
            text-[60px]
            leading-[60px]
            font-bold
            text-white
            mb-4
          "
          >
            Hi, I'm Alif Sya'bani
          </h1>

          {/* Subheading */}
          <p
            className="
            font-cabinet
            text-[24px]
            leading-[24px]
            text-white/80
            mb-6
          "
          >
            Student Candidate | Computer Engineering @ Brawijaya University
          </p>

          {/* Typewriter */}
          <Typewriter />
        </div>
        <div className="w-full h-[520px] text-white">
          <Earth />
        </div>
    </section>
  );
}

function SocialIcon({
  href,
  icon,
  glow,
}: {
  href: string;
  icon: React.ReactNode;
  glow: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      className={`
        text-xl text-white/70
        transition-all duration-300
        hover:text-white
        hover:scale-110
        ${glow}
      `}
    >
      {icon}
    </a>
  );
}
