
export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  image: string;
  link: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'Frontend' | 'Backend' | 'Tools' | 'Databases';
}

export interface ExperienceItem {
  company: string;
  role: string;
  start: string;
  end: string;
  logo: string;
  link: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface CursorContextType {
  cursorVariant: 'default' | 'text' | 'button';
  setCursorVariant: (variant: 'default' | 'text' | 'button') => void;
}