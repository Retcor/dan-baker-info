import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { playgroundTools } from "../constants";
import { bakerrangLogo, linkedin, github } from "../assets";

const LAUNCHER_URL = "https://launch.bakerrang.com";

const Arrow = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#D4ED31] focus-visible:ring-offset-2 focus-visible:ring-offset-card";

const Website = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Check it out</p>
        <h2 className={styles.sectionHeadText}>My Playground.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        BakerRang is where I build things for fun and to learn. It's a small family of web apps that
        share one Google sign-in, each on its own subdomain and installable as its own app. React and
        Vite up front, a Node/Express API on Google Cloud Run behind it.
      </motion.p>

      <motion.div
        variants={fadeIn("up", "tween", 0.2, 1)}
        className="mt-10 bg-card rounded-2xl shadow-card p-6 sm:p-10 grid gap-8 md:grid-cols-[minmax(0,260px)_1fr] md:gap-12"
      >
        {/* Brand: the logo sits straight on the card, centred against the tool list */}
        <div className="flex flex-col items-center justify-center text-center">
          <img
            src={bakerrangLogo}
            alt=""
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
          />
          <h3 className="mt-5 text-white font-black text-[28px] sm:text-[32px] leading-tight">
            BakerRang
          </h3>
          <p className="mt-1 text-secondary text-[15px]">launch.bakerrang.com</p>
          <a
            href={LAUNCHER_URL}
            target="_blank"
            rel="noreferrer"
            className={`group mt-6 inline-flex items-center gap-2 rounded-lg bg-white-100 px-5 py-2.5 text-[15px] font-semibold text-primary transition-colors hover:bg-white ${focusRing}`}
          >
            Open BakerRang
            <Arrow className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-[3px]" />
          </a>
        </div>

        {/* The tools, each straight to its own subdomain */}
        <ul className="flex flex-col">
          {playgroundTools.map((tool, index) => (
            <li
              key={tool.name}
              className={index > 0 ? "border-t border-[rgba(170,166,195,0.1)]" : ""}
            >
              <a
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                className={`group -mx-3 flex items-center gap-4 rounded-xl px-3 py-4 transition-colors hover:bg-white/[0.04] ${focusRing}`}
              >
                <span className="flex-1 min-w-0">
                  <span className="block text-white text-[18px] font-semibold">{tool.name}</span>
                  <span className="mt-0.5 block text-secondary text-[14px] sm:text-[15px] leading-[24px]">
                    {tool.description}
                  </span>
                </span>
                <Arrow className="w-5 h-5 shrink-0 text-secondary transition duration-200 group-hover:translate-x-[3px] group-hover:text-[#D4ED31] group-focus-visible:text-[#D4ED31]" />
              </a>
            </li>
          ))}
        </ul>
      </motion.div>

      <footer className="mt-16 pt-6 border-t border-[rgba(170,166,195,0.1)] flex flex-wrap items-center justify-between gap-4 text-secondary text-[14px]">
        <p>
          © {new Date().getFullYear()} Dan Baker &#183;{" "}
          <a
            href="mailto:bakerz2009@gmail.com"
            className="underline-offset-4 hover:text-white hover:underline rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#D4ED31]"
          >
            bakerz2009@gmail.com
          </a>
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/daniel-baker-0646535a/"
            target="_blank"
            rel="noreferrer"
            aria-label="Dan Baker on LinkedIn"
            className="opacity-70 transition-opacity hover:opacity-100 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#D4ED31]"
          >
            <img src={linkedin} alt="" className="w-5 h-5 object-contain" />
          </a>
          <a
            href="https://github.com/Retcor"
            target="_blank"
            rel="noreferrer"
            aria-label="Dan Baker on GitHub"
            className="opacity-70 transition-opacity hover:opacity-100 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#D4ED31]"
          >
            <img src={github} alt="" className="w-5 h-5 object-contain" />
          </a>
        </div>
      </footer>
    </>
  );
};

export default SectionWrapper(Website, "website");
