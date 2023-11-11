import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Website = () => {
  return (
    <div
      className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="bg-black-100 p-8 rounded-2xl"
      >
        <h3 className={styles.sectionHeadText}>
          <a className="flex" target="#" href="https://bakerrang.com">
            BakerRang.com
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mt-6">
              <path fillRule="evenodd" d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z" clipRule="evenodd" />
            </svg>
          </a>
        </h3>
        <p className={styles.sectionTinyText}>
          Come on over to see my project website! BakerRang.com is CURRENTLY built using a React / Vite frontend with a Node backend and
          deployed using Google Cloud Run with Docker containers.  This serves as my playground for learning
          new tech and having fun with technology.  With that in mind, at times the site won't be up and running, as I am
          experimenting with new ideas and technology, but should be short windows of downtime.
        </p>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Website, "website");
