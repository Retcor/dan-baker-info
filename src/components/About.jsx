import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        I'm a full stack software developer with experience across a wide range of web technologies like Java, Kotlin, TypeScript,
        JavaScript, and Node.js, along with frameworks and libraries like React, Redux, Spring, Ktor, Hibernate, Express, and Tailwind CSS.
        More recently I've moved into AI engineering, building RAG-powered features and internal AI tooling. I'm a quick learner who
        picks up new tech by building real projects. This very site started as a way to learn React, Tailwind CSS, Docker, and Google Cloud,
        and it's deployed on Google Cloud Run using Docker containers.<br/><br/>
        I love meeting new people and do very well working with people from all walks of life, and I look forward to hearing from you!
      </motion.p>
    </>
  );
};

export default SectionWrapper(About, "about");
