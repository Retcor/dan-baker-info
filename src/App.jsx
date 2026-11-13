import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";

import {
  About,
  Website,
  Experience,
  Hero,
  Navbar,
  Tech,
  ChatBot,
} from "./components";

export const SERVER_PREFIX = 'https://api.bakerrang.com'

const App = () => {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <div className="relative z-0 bg-primary">
          <div className="bg-cover bg-no-repeat bg-center">
            <Navbar />
            <Hero />
          </div>
          <About />
          <Experience />
          <Tech />
          <div className="relative z-0">
            <Website />
          </div>
        </div>
        <ChatBot />
      </MotionConfig>
    </BrowserRouter>
  );
};

export default App;
