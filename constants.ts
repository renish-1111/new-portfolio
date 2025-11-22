
import { Project, Skill, ExperienceItem } from './types';

export const LEETCODE_USERNAME = "renish-1111";

export const SOCIAL_LINKS = {
  github: "https://github.com/renish-1111",
  linkedin: "https://linkedin.com/in/gecr-comp220200107098",
  instagram: "https://instagram.com/renish_1111",
  x: "https://x.com/renish_1111",
  leetcode: "https://leetcode.com/renish-1111",
  email:"ponkiyarenish@gmail.com"
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
    link: "https://tripzy.azurewebsites.net/"
  },
  {
    id: 3,
    title: "Water Plant Delivery Management and Billing System",
    description: "A comprehensive system to manage orders, deliveries, and billing for a water plant business, streamlining operations and improving customer service.",
    tech: ["Django", "PostgreSQL", "Bootstrap", "Docker"],
    image: "https://i.ibb.co/2wDT55H/FD65-D0-B5-6753-4-DB1-8210-727-E88-E632-C0.png",
    link: "#"
  },
  {
    id: 4,
    title: "Automatic Passport Image Cropping Application",
    description: "Bulk image cropping tool that automatically detects and crops passport photos to meet official size and format requirements.",
    tech: ["Python", "OpenCV", "PyQt5"],
    image: "https://i.ibb.co/0jYjvyPV/4-B176-EA6-97-C9-4-BF4-80-B6-68-B535-BB7-B2-F.png",
    link: "#"
  }
];

export const SKILLS: Skill[] = [
  { name: "Python", level: 95, category: "Backend" },
  { name: "React / Next.js", level: 90, category: "Frontend" },
  { name: "TypeScript", level: 85, category: "Frontend" },
  { name: "Node.js / Express", level: 80, category: "Backend" },
  { name: "Git / GitHub", level: 80, category: "Tools" },
  { name: "PostgreSQL", level: 70, category: "Databases" },
  { name: "MongoDB", level: 75, category: "Databases" },
  { name: "Docker", level: 70, category: "Tools" },
  { name: "Jenkins", level: 85, category: "Tools" },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: "eSparkbiz",
    role: "Full Stack Developer Intern",
    start: "July 2025",
    end: "July 2025",
    logo: "data:image/jpeg;base64,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",
    link: "https://www.esparkinfo.com/"
  },
];

export const SYSTEM_INSTRUCTION = `
You are the AI persona of Renish, a passionate Computer Science student and fresher developer. 
Your goal is to impress recruiters and visitors.
Traits: Enthusiastic, technically articulate, humble but confident, witty.
Background:
- Senior year student focusing on Full Stack Web Development and AI/ML.
- Loves React, TypeScript, and training models.
- Currently looking for internship or junior dev roles.
- Built 'Nebula Dashboard' (Analytics) and 'Echo Chat' (AI Wrapper).

Rules:
1. Keep answers concise (under 3 sentences unless asked for detail).
2. Use emojis occasionally 🚀.
3. If asked about contact, suggest the contact form below or email 'ponkiyarenish@gmail.com'.
4. Explain technical concepts simply.
5. Do not hallucinate projects not listed here.
`;