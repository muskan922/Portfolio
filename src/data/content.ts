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
  image?: string;
  credentialId?: string;
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
    "Motivated and aspiring Software Engineer with a strong foundation in C++, JavaScript, full-stack web development, databases, and problem-solving. Seeking opportunities to apply my technical skills, build scalable and user-friendly applications, continuously learn new technologies, and contribute to the growth of a dynamic organization.",

  stats: [
    "Deployed 3+ production web applications",
    "LLM API Integration & Prompt Engineering",
    "Full-Stack Development with React, Node.js & MongoDB",
  ],
};

export const experience: ExperienceItem[] = [
  {
    company: "Eimple Lab",
    role: "Web Development Internship",
    period: "November, 2025 – July, 2026",
    bullets: [
      "Developed a full-stack web application using React.js and Tailwind CSS, creating a responsive and user-friendly interface for seamless navigation across devices.",
      "Built backend services using Node.js and REST APIs, integrating PostgreSQL for structured and reliable data management.",
      "Implemented reusable UI components, responsive layouts, and database-driven functionality to deliver an efficient and scalable web application.",
    ],
  },
];

export const projects: Project[] = [
  {
    title: "Gym Management System",
    tag: "Fitness Management Platform",
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
    title: "Report Analyzer",
    tag: "Report Analysis Platform",
    description:
      "A document analysis application built with Streamlit and Gemini API that parses uploaded reports, summarizes key findings, and extracts structured insights automatically.",
    tech: ["Python", "Streamlit", "Gemini API", "AI/LLM", "Document Parsing"],
    featured: true,
    link: "https://ai-disease-detector.streamlit.app/",
    media: [
      {
        type: "image",
        src: "/projects/report_analyzer.webp",
        alt: "Report Analysis Dashboard",
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
  {
    name: "Generative AI Studio",
    org: "Google Cloud (2025)",
    image: "/certificates/cert_01_generative_ai_studio.jpg",
    credentialId: "9289893",
  },
  {
    name: "Craft Precise Prompts for AI Model",
    org: "IBM (2026)",
    image: "/certificates/cert_02_ibm_prompts.pdf",
    credentialId: "WzX5OhHz",
  },
  {
    name: "Advanced Software Engineering Job Simulation",
    org: "Walmart (2026)",
    image: "/certificates/cert_03_walmart_swe.pdf",
    credentialId: "zMJFHrTkzKtm2ojnM",
  },
  {
    name: "Cyber Job Simulation",
    org: "Deloitte (2026)",
    image: "/certificates/cert_04_deloitte_cyber.pdf",
    credentialId: "6a81df96aa694bdf89bf188f",
  },
  {
    name: "AI Skills Passport",
    org: "EY + Microsoft (2026)",
    image: "/certificates/cert_05_ey_microsoft_ai.pdf",
    credentialId: "EY-MSFT-2026-AI",
  },
  {
    name: "Git Training",
    org: "SkillUp (2026)",
    image: "/certificates/cert_06_simplilearn_git.pdf",
    credentialId: "10447406",
  },
  {
    name: "Cloud Infrastructure Analyst",
    org: "Skill India Digital Hub (2026)",
    image: "/certificates/cert_07_skill_india_cloud.pdf",
    credentialId: "SIDH-NASSCOM-2026",
  },
  {
    name: "Customer Service Job Simulation",
    org: "Forage (2026)",
    image: "/certificates/cert_08_forage_customer_service.pdf",
    credentialId: "6a571f4ebd526a9c3421c1b0",
  },
  {
    name: "AI Quiz Ignite",
    org: "Nexus (2026)",
    image: "/certificates/cert_09_nexus_ai_quiz.pdf",
    credentialId: "NEXUS-AI-IGNITE-2026",
  },
  {
    name: "QuizOff 2026",
    org: "CampusCrew (2026)",
    image: "/certificates/cert_10_campuscrew_quizoff.jpg",
    credentialId: "QUIZOFF-2026-CC",
  },
  {
    name: "QuestUp 2026: India’s Biggest AI",
    org: "Falcon Sphere (2026)",
    image: "/certificates/cert_11_falcon_sphere_questup.pdf",
    credentialId: "QUESTUP-2026-FS",
  },
];
