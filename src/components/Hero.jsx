import { motion } from "framer-motion";

import { styles } from "../styles";
import backgroundImage from '../assets/DanAndCar.png'

const Hero = () => {
  return (
    <section className={`relative w-full h-screen mx-auto overflow-hidden`}>
      {/* Shared max-width container: text left, image right on md+ */}
      <div
        className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-end justify-between`}
      >
        <div className="flex-1 z-10 min-w-0 self-start pt-4 md:pr-6">
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm <span className="text-[#D4ED31]">Dan</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            A Full Stack Developer <br className="sm:block hidden" />
            who loves seeing the things software can do <br className="sm:block hidden" />
            in making life more fun and productive.
          </p>
        </div>

        {/* Inline image, only on md and above where there's room */}
        <div className="hidden md:flex items-end justify-end flex-shrink-0 pointer-events-none">
          <img
            src={backgroundImage}
            alt="Dan Baker with RC car"
            className="w-auto"
            style={{ height: 'clamp(280px, 78vh, 780px)' }}
          />
        </div>
      </div>

      {/* Mobile/tablet image as an absolute overlay below md so text is never squished */}
      <div className="md:hidden absolute bottom-0 right-0 flex items-end justify-end pointer-events-none">
        <img
          src={backgroundImage}
          alt=""
          className="w-auto opacity-40"
          style={{ height: 'clamp(300px, 68vh, 560px)' }}
        />
      </div>

      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about" aria-label="Scroll to About">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
