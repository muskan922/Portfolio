export interface NavLink {
  label: string;
  id: string;
}

export interface SiteInfo {
  name: string;
  monogram: string;
  photo: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  phoneHref: string;
  github: string;
  linkedin: string;
  x: string;
  footerLine: string;
}

export interface AboutContent {
  paragraph: string;
  stats: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface ProjectMedia {
  type: "image" | "video";
  src: string;
  alt: string;
  /** Poster frame shown before a video loads. */
  poster?: string;
}

export interface Project {
  title: string;
  tag: string;
  period?: string;
  description: string;
  tech: string[];
  featured: boolean;
  link?: string;
  media?: ProjectMedia[];
}

export interface SkillGroup {
  label: string;
  skills: string[];
}

export interface EducationItem {
  title: string;
  org: string;
  period?: string;
}

export interface Certificate {
  name: string;
  org: string;
}

export const site: SiteInfo = {
  name: "Muskan Kumari",
  monogram: "MK.",
  photo: "/muskan.jpeg",
  role: "Software Engineer / Full-Stack Developer",
  tagline:
    "AI-focused Software Engineer with hands-on experience building LLM-powered applications, AI agents, and backend systems using Python, JavaScript, and Gemini APIs.",
  location: "Ranchi, India",
  email: "muskan26.kri@gmail.com",
  phone: "+91 9241378284",
  phoneHref: "tel:+919241378284",
  github: "https://github.com/muskan922",
  linkedin: "https://www.linkedin.com/in/muskan26-kri",
  x: "https://www.linkedin.com/in/muskan26-kri", // fallback to linkedin if not available
  footerLine: "© 2026 Muskan Kumari · Built with React & Tailwind CSS",
};

export const navLinks: NavLink[] = [
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Skills", id: "skills" },
  { label: "Contact", id: "contact" },
];

export const about: AboutContent = {
  paragraph:
    "AI-focused Software Engineer with hands-on experience building LLM-powered applications, AI agents, and backend systems using Python, JavaScript, REST APIs, and Gemini APIs. Strong foundation in Data Structures & Algorithms, software engineering, and problem-solving. Passionate about AI automation, workflow orchestration, prompt engineering, backend integrations, and deploying scalable, production-ready AI solutions.",
  stats: [
    "Deployed 3+ production web apps",
    "LLM API Integration & Prompt Engineering",
    "Full-Stack Development (React, Node.js, MongoDB)",
  ],
};

export const experience: ExperienceItem[] = [
  {
    company: "Eimple Lab",
    role: "Web Development Intern",
    period: "11/2025 – 07/2026",
    bullets: [
      "Developed a full-stack web application using React.js and Tailwind CSS, creating a responsive and user-friendly interface for seamless navigation across devices",
      "Built backend services using Node.js and REST APIs, integrating PostgreSQL for structured and reliable data management",
      "Implemented reusable UI components, responsive layouts, and database-driven functionality to deliver an efficient and scalable web application",
    ],
  },
];

export const projects: Project[] = [
  {
    title: "Gym Management System",
    tag: "Fitness Management Platform",
    period: "2026",
    description:
      "A comprehensive full-stack gym management platform facilitating membership subscriptions, workout tracking, trainer schedules, and member analytics with an interactive dashboard.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    featured: true,
    link: "https://gym-management-system-teal-eta.vercel.app/",
    media: [
      {
        type: "image",
        src: "/projects/gym_management.jpg",
        alt: "Gym Management System Dashboard",
      },
    ],
  },
  {
    title: "CivicFix",
    tag: "Civic Issue Reporting Platform",
    period: "2026",
    description:
      "A full-stack civic issue reporting platform that enables users to report local problems, track complaint resolution in real-time, and streamline transparent communication with authorities.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "REST API", "JWT"],
    featured: true,
    link: "https://civic-fix-rose.vercel.app/",
    media: [
      {
        type: "image",
        src: "/projects/civicfix.webp",
        alt: "CivicFix Issue Reporting Dashboard",
      },
    ],
  },
  {
    title: "AI Report Analyzer",
    tag: "AI-Powered Report Analysis App",
    period: "2026",
    description:
      "An AI-powered document analysis application built with Streamlit and Gemini API that parses uploaded reports, summarizes key findings, and extracts structured insights automatically.",
    tech: ["Python", "Streamlit", "Gemini API", "AI/LLM", "Document Parsing"],
    featured: true,
    link: "https://ai-disease-detector.streamlit.app/",
    media: [
      {
        type: "image",
        src: "/projects/report_analyzer.webp",
        alt: "AI-Powered Report Analysis Dashboard",
      },
    ],
  },
  {
    title: "WebTech-Lab",
    tag: "Web Technology Laboratory Exercises",
    period: "2025",
    description:
      "A collection of web technology laboratory exercises and experiments demonstrating front-end design principles, DOM manipulation, responsive layouts, and interactive features.",
    tech: ["HTML", "CSS", "JavaScript", "Responsive Design", "DOM Manipulation"],
    featured: false,
    link: "https://github.com/muskan922",
    media: [
      {
        type: "image",
        src: "/projects/webtech_lab.webp",
        alt: "Web Technology Lab Editor Workstation",
      },
    ],
  },
];

export const projectsNote = "+3 production web apps deployed.";

export const skillGroups: SkillGroup[] = [
  {
    label: "CS Fundamentals",
    skills: ["Data Structures & Algorithms", "OOP", "DBMS", "Operating Systems"],
  },
  {
    label: "AI/ML & Scripting",
    skills: ["LLM API Integration (Gemini, OpenAI, ChatGPT)", "Prompt Engineering", "Python (DSA & scripting)"],
  },
  {
    label: "Languages",
    skills: ["TypeScript", "JavaScript", "Python", "Java", "C/C++"],
  },
  {
    label: "Backend",
    skills: ["Node.js", "Express.js", "REST API Design", "JWT", "Middleware"],
  },
  {
    label: "Frontend",
    skills: ["React.js", "Next.js", "Tailwind CSS", "Responsive Design"],
  },
  {
    label: "Databases",
    skills: ["MongoDB", "PostgreSQL", "SQL"],
  },
  {
    label: "Tools",
    skills: ["Git", "GitHub", "Postman", "Netlify", "Render", "VS Code", "Vercel"],
  },
];

export const education: EducationItem[] = [
  {
    title: "B.Tech, Computer Science Engineering",
    org: "YBN University, Ranchi",
    period: "2024 – 2028 (CGPA: 8.10, 4 semesters)",
  },
];

export const certificates: Certificate[] = [
  { name: "Generative AI Studio", org: "Google Cloud (2025)" },
  { name: "Craft Precise Prompts for AI Model", org: "IBM (2026)" },
  { name: "Advanced Software Engineering Job Simulation", org: "Walmart (2026)" },
  { name: "Git Training", org: "SkillUp (2026)" },
  { name: "Cloud Infrastructure Analyst", org: "Skill India Digital Hub (2026)" },
  { name: "Customer Service Job Simulation", org: "Forage (2026)" },
  { name: "AI Quiz Ignite", org: "Nexus (2026)" },
  { name: "QuizOff 2026", org: "CampusCrew (2026)" },
  { name: "QuestUp 2026: India’s Biggest AI", org: "Falcon Sphere (2026)" },
];
