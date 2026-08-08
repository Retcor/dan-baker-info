import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { bakerrangLogo } from "../assets";

const ExternalLinkIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z" clipRule="evenodd" />
  </svg>
);

const Website = () => {
  return (
    <div className="xl:mt-12">
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Check it out</p>
        <h2 className={styles.sectionHeadText}>My Playground.</h2>
      </motion.div>

      <motion.div
        variants={fadeIn("up", "tween", 0.2, 1)}
        className="mt-8 bg-black-100 rounded-2xl shadow-card p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12"
      >
        {/* Logo badge on a light tile so its dark blocks stay legible */}
        <a
          href="https://bakerrang.com"
          target="_blank"
          rel="noreferrer"
          className="group shrink-0"
          aria-label="Visit BakerRang.com"
        >
          <div className="rounded-3xl bg-gradient-to-br from-white to-[#e8e8f0] p-5 shadow-card transition-transform duration-300 group-hover:scale-105">
            <img
              src={bakerrangLogo}
              alt="BakerRang logo"
              className="w-32 h-32 md:w-40 md:h-40 object-contain"
            />
          </div>
        </a>

        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          <a
            className="group inline-flex items-center gap-2"
            target="_blank"
            rel="noreferrer"
            href="https://bakerrang.com"
          >
            <h3 className="text-white font-black text-[32px] sm:text-[40px] transition-colors group-hover:text-[#FFD500]">
              BakerRang.com
            </h3>
            <ExternalLinkIcon className="w-6 h-6 text-secondary transition-colors group-hover:text-[#FFD500]" />
          </a>

          <p className="mt-4 text-secondary text-[16px] leading-[28px]">
            Come on over and check out my project website! BakerRang.com is currently built with a
            React / Vite frontend and a Node backend, deployed on Google Cloud Run using Docker
            containers. It's my playground for learning new tech and having fun with it, so at times
            the site won't be up while I'm experimenting with new ideas, but those should just be short
            windows of downtime.
          </p>

          <a
            href="https://bakerrang.com"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-[#FFD500] text-primary font-bold py-2.5 px-6 rounded-xl transition-colors hover:bg-[#e6c000]"
          >
            Visit the site
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Website, "website");
