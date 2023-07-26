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
        I'm a full stack software developer with experience in a range of different web development technologies, like Java, Kotlin, TypeScript,
        JavaScript, Node.js, and other libraries and frameworks like React, Redux, Spring, KTOR, Hibernate, Express and Tailwind CSS.
        I'm a quick learner and although I may lack knowledge a company is looking forward, I will pick up new technologies
        quickly by building out personal projects, which is precisely what this website was to help me pick up Kubernetes, Docker, React and Tailwind CSS,
        as this is deployed in Google Cloud Platform using their Kubernetes engine, with a React frontend and Node backend.<br/><br/>
        I love meeting new people and do very well working with people from all walks of life and look forward to hearing from you!
      </motion.p>
    </>
  );
};

export default SectionWrapper(About, "about");
