
import { Project, Skill, ExperienceItem } from './types';

export const LEETCODE_USERNAME = "renish-1111";

export const SOCIAL_LINKS = {
  github: "https://github.com/renish-1111",
  linkedin: "https://linkedin.com/in/gecr-comp220200107098",
  instagram: "https://instagram.com/renish_1111",
  x: "https://x.com/renish_1111",
  leetcode: "https://leetcode.com/renish-1111",
  email: "ponkiyarenish@gmail.com"
};

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Ai Powered Resume Analyzer and Enhancer",
    description: "A web application that analyzes and enhances resumes using AI to improve formatting, keyword optimization, and overall presentation.",
    tech: ["React", "Sqlite", "Flask", "Gemini API"],
    image: "https://i.ibb.co/PZybHZ1T/image.png",
    link: "https://github.com/renish-1111/Summer-Internship-Project"
  },
  {
    id: 2,
    title: "Expense Tracker",
    description: "Expense tracker that categorizes and visualizes spending patterns to help users manage their finances effectively.",
    tech: ["Flask", "MySQL", "Chart.js"],
    image: "https://i.ibb.co/hmhjbvT/Screenshot-2025-01-26-171506.png",
    link: "https://github.com/renish-1111"
  },
  {
    id: 3,
    title: "Water Plant Delivery Management and Billing System",
    description: "A comprehensive system to manage orders, deliveries, and billing for a water plant business, streamlining operations and improving customer service.",
    tech: ["Django", "PostgreSQL", "Bootstrap", "Docker"],
    image: "https://i.ibb.co/2wDT55H/FD65-D0-B5-6753-4-DB1-8210-727-E88-E632-C0.png",
    link: "https://github.com/renish-1111"
  },
  {
    id: 4,
    title: "Automatic Passport Image Cropping Application",
    description: "Bulk image cropping tool that automatically detects and crops passport photos to meet official size and format requirements.",
    tech: ["Python", "OpenCV", "PyQt5"],
    image: "https://i.ibb.co/0jYjvyPV/4-B176-EA6-97-C9-4-BF4-80-B6-68-B535-BB7-B2-F.png",
    link: "https://github.com/renish-1111"
  },
  {
    id: 5,
    title: "ReviewGenAi",
    description: "AI-powered tool that generates reviews and feedback for various restaurants and businesses, helping customers make informed decisions.",
    tech: ["Next.js", "Grok", "FastAPI", "PostgreSQL"],
    image: "https://i.ibb.co/q3BR1x1V/image.pngsta",
    link: "https://github.com/renish-1111"
  }
];

export const SKILLS: Skill[] = [
  { name: "Python", level: 95, category: "Backend" },
  { name: "React / Next.js", level: 90, category: "Frontend" },
  { name: "TypeScript", level: 85, category: "Frontend" },
  { name: "Node.js / Express", level: 80, category: "Backend" },
  { name: "Frappe", level: 85, category: "Backend" },
  { name: "ERPNext", level: 80, category: "Backend" },
  { name: "Git / GitHub", level: 80, category: "Tools" },
  { name: "PostgreSQL", level: 70, category: "Databases" },
  { name: "MongoDB", level: 75, category: "Databases" },
  { name: "Docker", level: 70, category: "Tools" },
  { name: "Jenkins", level: 85, category: "Tools" },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: "Sanskar Technolab",
    role: "Frappe / ERPNext Developer",
    start: "July 2026",
    end: "Present",
    logo: "https://media.licdn.com/dms/image/v2/C4E0BAQE0Yh-XQ59ubw/company-logo_200_200/company-logo_200_200/0/1632897115207/sanskar_technolab_pvt_ltd_logo?e=2147483647&v=beta&t=5TH1ogSJGp0qlEyAwhFJjOPNM73MwTGOLemTmM0CT2o",
    link: "https://www.sanskartechnolab.com/"
  },
  {
    company: "eSparkbiz",
    role: "Full Stack Developer Intern",
    start: "Jan 2026",
    end: "March 2026",
    logo: "https://www.esparkinfo.com/wp-content/uploads/2021/09/logo.svg",
    link: "https://www.esparkinfo.com/"
  },
  {
    company: "eSparkbiz",
    role: "Summer Internship",
    start: "July 2025",
    end: "July 2025",
    logo: "https://www.esparkinfo.com/wp-content/uploads/2021/09/logo.svg",
    link: "https://www.esparkinfo.com/"
  },
];
