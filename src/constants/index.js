import {
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  nodejs,
  git,
  docker,
  usana,
  stg,
  kubernetes,
  spring,
  kotlin,
  java,
  gcp,
  ilio,
  equivant,
  tzero,
  cratermus,
  keyhole,
  nextjs,
  tailwind,
  ktor,
  express,
  vite,
  postgresql,
  firebase,
  openai,
  claude,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "website",
    title: "Playground",
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
    title: "HTML"
  },
  {
    name: "CSS 3",
    icon: css,
    title: "CSS"
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
    title: "Tailwind CSS"
  },
  {
    name: "JavaScript",
    icon: javascript,
    title: "Javascript"
  },
  {
    name: "TypeScript",
    icon: typescript,
    title: "Typescript"
  },
  {
    name: "React JS",
    icon: reactjs,
    title: "React JS"
  },
  {
    name: "Next JS",
    icon: nextjs,
    title: "Next.js"
  },
  {
    name: "Redux Toolkit",
    icon: redux,
    title: "Redux"
  },
  {
    name: "Node JS",
    icon: nodejs,
    title: "Node"
  },
  {
    name: "Express",
    icon: express,
    title: "Express"
  },
  {
    name: "Vite",
    icon: vite,
    title: "Vite"
  },
  {
    name: "git",
    icon: git,
    title: "Git"
  },
  {
    name: "docker",
    icon: docker,
    title: "Docker"
  },
  {
    name: "kubernetes",
    icon: kubernetes,
    title: "Kubernetes"
  },
  {
    name: "spring",
    icon: spring,
    title: "Spring Framework"
  },
  {
    name: "kotlin",
    icon: kotlin,
    title: "Kotlin"
  },
  {
    name: "Ktor",
    icon: ktor,
    title: "Ktor"
  },
  {
    name: "java",
    icon: java,
    title: "Java"
  },
  {
    name: "PostgreSQL",
    icon: postgresql,
    title: "PostgreSQL"
  },
  {
    name: "Firestore",
    icon: firebase,
    title: "Firestore (Firebase)"
  },
  {
    name: "gcp",
    icon: gcp,
    title: "Google Cloud Platform"
  },
  {
    name: "OpenAI",
    icon: openai,
    title: "OpenAI"
  },
  {
    name: "Anthropic Claude",
    icon: claude,
    title: "Anthropic Claude"
  },
];

const experiences = [
  {
    title: "Jr Software Developer",
    type: "career",
    company_name: "Usana Health Sciences",
    icon: usana,
    iconBg: "#383E56",
    date: "Nov 2012 - Jan 2015",
    points: [
      "My foot in the door job with first 3 months spent writing tests for backend Java services and doing manual database reporting and updates.",
      "Created a project that used Javascript to automate the manual database processes I was assigned to do and was offered a full time position.",
      "Maintained and improved an in house payments system that interfaced with a 3rd party vendor to process credit card payments.",
      "Within 6 months, I was considered a go to person and someone who could interface with the multiple development teams due to my experience and willingness to dig into multiple systems.",
    ],
  },
  {
    title: "Jr Software Developer",
    type: "side",
    company_name: "Ilio",
    icon: ilio,
    iconBg: "#fffdfd",
    date: "May 2013 - Feb 2014",
    points: [
      "A night position to get some extra experience outside my normal work hours.",
      "Maintained and implemented new features that helped vendors manage their Music Software selling portfolio through Ilio.",
    ],
  },
  {
    title: "Software Developer",
    type: "career",
    company_name: "Software Technology Group",
    icon: stg,
    iconBg: "#fffdfd",
    date: "Jan 2015 - Jul 2015",
    points: [
      "Worked as a consultant for a company named Equivant, helping to build out their new Jworks 2 product.",
      "Implemented features both on the frontend and backend to handle a CMS for Courts around the United States and Australia.",
      "Maintained and improved their software performance by heavily reducing the size of assets downloaded by a client computer and by implementing caching and server side paging across the application.",
    ],
  },
  {
    title: "Sr Software Developer / Team Lead",
    type: "career",
    company_name: "Equivant",
    icon: equivant,
    iconBg: "#fffdfd",
    date: "Jul 2015 - Dec 2021",
    points: [
      "After consulting for 6 months, was offered a position to work full time on their team.",
      "From Nov 2019 to Dec 2021, I led a team of 4 developers and spent 40% of my time on Lead responsibilities like code reviews, architecture meetings and other general management.",
      "I helped grow out their platform and sign up their first customers.",
      "Implemented hundreds of new features, all within their deadlines and all full stack, ranging from a simple new button to a multi-file uploading tool that had to process an unlimited amount of documents at a time and file sizes 2gb or more.",
      "Helped write coding standard documentation and did trainings with the different teams to knowledge share and team build."
    ],
  },
  {
    title: "Sr Software Developer",
    type: "career",
    company_name: "tZERO",
    icon: tzero,
    iconBg: "#000000",
    date: "Dec 2021 - Dec 2023",
    points: [
      "Was hired as a Sr Frontend Developer but spent most of my time on backend issues where we needed the most love.",
      "Maintained numerous microservices ranging from React/Redux, Kotlin/Spring, Kotlin/Ktor, Node and Next.js.",
      "Implemented functionality to migrate customer data from older services to newer services, cutting out 10 year old functionality no longer used and allowing to remove multiple microservices no longer needed.",
      "Migrated KYC processes from multiple vendors down to one, saving the company money and ensuring a much easier KYC process.",
      "Worked with Devops to help better CI/CD pipelines and ensure best code practices."
    ],
  },
  {
    title: "Sr Software Developer",
    type: "side",
    company_name: "Keyhole / 1898 and Co",
    icon: keyhole,
    iconBg: "#fffdfd",
    date: "Nov 2023 - Feb 2024",
    points: [
      "Nightly position working on improving APIs that already existed.",
      "Enjoyed getting my hands on Python / Django and picking up a different tech stack.",
    ],
  },
  {
    title: "Sr Software Developer",
    type: "side",
    company_name: "Cratermus.com",
    icon: cratermus,
    iconBg: "#fffdfd",
    date: "Jul 2026 - Present",
    points: [
      "Designed and implemented Cratermus.com, which serves as a marketing page for a local music producer.",
      "Ongoing work as needed to update features on Cratermus.com to support marketing efforts.",
    ],
  },
  {
    title: "Sr Software Developer / AI Engineer",
    type: "career",
    company_name: "Equivant",
    icon: equivant,
    iconBg: "#fffdfd",
    date: "Dec 2023 - Present",
    points: [
      "Offered position to return to equivant working on their Integration software.",
      "I helped lead an AI initiative to incorporate it's usage throughout the company, providing initial validation and POC documentation outlining it's benefits but also it's pitfalls.",
      "I implemented dozens of interfaces that integrated customer systems to our companies CMS products. This often required customer facing coordination and testing.",
      "Redesigned many Integration related applications to make them more modern feeling, improving on customer willingness to engage with them.",
      "Moved to the newly created AI team to help implement greenfield projects and work on creating organization AI skills, tools and in-app AI RAG solutions."
    ],
  },
];

// The BakerRang tools listed in the Playground section. Descriptions follow the
// Launcher's own copy (bakerrang/web/apps/launcher).
const playgroundTools = [
  {
    name: "Story Book",
    url: "https://storybook.bakerrang.com",
    description: "Write and illustrate a story with a few words, then have it read aloud.",
  },
  {
    name: "Polyglot",
    url: "https://polyglot.bakerrang.com",
    description: "Speak and translate between languages, out loud, in real time.",
  },
  {
    name: "Sign Language",
    url: "https://sign.bakerrang.com",
    description: "Practise ASL handshapes with your camera. Sign reads your hand on this device.",
  },
  {
    name: "Budget",
    url: "https://budget.bakerrang.com",
    description: "See which paycheck covers which bills, month by month.",
  },
  {
    name: "Passwords",
    url: "https://passwords.bakerrang.com",
    description: "Logins in folders, encrypted in your browser with a master password only you know.",
  },
];

export { technologies, experiences, playgroundTools };
