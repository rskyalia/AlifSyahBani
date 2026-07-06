import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa6";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/6 px-6 md:px-20 py-10 mt-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold text-white/80">
            Alif Sya&apos;bani
          </p>
          <p className="text-xs text-white/35 mt-1">
            © {year} · Built with Next.js & Tailwind CSS
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/rskyalia"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/35 hover:text-white/70 transition-colors"
            aria-label="GitHub"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/alif-syahbani-01056b304/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/35 hover:text-white/70 transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={18} />
          </a>
          <a
            href="https://www.instagram.com/syah.baani/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/35 hover:text-white/70 transition-colors"
            aria-label="Instagram"
          >
            <FaInstagram size={18} />
          </a>
        </div>

        <Link
          href="/resume"
          className="text-xs text-blue-300/60 hover:text-blue-300 transition-colors"
        >
          Download Resume →
        </Link>
      </div>
    </footer>
  );
}
