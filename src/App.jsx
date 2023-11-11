import { BrowserRouter } from "react-router-dom";

import {
  About,
  Website,
  Experience,
  Hero,
  Navbar,
  Tech,
} from "./components";

export const SERVER_PREFIX = import.meta.env.REACT_APP_API_URL || `http://${window.location.hostname}:3001`

const App = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default App;
