import React, { useState, useEffect, useMemo } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ArrowUpRight, 
  Check, 
  Copy, 
  Printer, 
  X, 
  Layers, 
  Server, 
  Database, 
  Wrench, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  ArrowUp,
  Menu,
  FileText,
  Sparkles,
  Send,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  useMotionTemplate 
} from 'framer-motion';
import { TechIcon } from './components/TechIcon';

// Authentic developer portrait
import profilePhoto from '../123.png';

type Language = 'ro' | 'en';
type Theme = 'dark' | 'light';

type ProjectCategory = 'Toate' | 'Full-Stack' | 'Frontend' | 'AI / Automatizări';

const CATEGORIES: ProjectCategory[] = ['Toate', 'Full-Stack', 'Frontend', 'AI / Automatizări'];

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

type SubmitStatus = 'idle' | 'success' | 'error';

interface Project {
  id: string;
  title: string;
  type: 'Web' | 'API' | 'Tool';
  category: string;
  categoryTag: Exclude<ProjectCategory, 'Toate'>;
  role: string;
  desc: { ro: string; en: string };
  highlights: { ro: string[]; en: string[] };
  tech: string[];
  github: string;
}

const PROJECTS: Project[] = [
  {
    id: 'devtask',
    title: 'DevTask',
    type: 'Web',
    category: 'Full-Stack Web App',
    categoryTag: 'Full-Stack',
    role: 'Full-Stack Developer',
    desc: {
      ro: 'Aplicație web pentru organizarea sarcinilor în echipe agile. Dispune de un board Kanban interactiv, sincronizare în timp real a stării și alerte automate în Google Chat prin 1P API.',
      en: 'Collaborative agile task management application featuring an interactive Kanban board, real-time status updates, and automated Google Chat notification webhooks.'
    },
    highlights: {
      ro: ['Interfață React 19 fluidă și responsivă'],
      en: ['Responsive React 19 interface']
    },
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    github: 'https://github.com/StanSabin10'
  },
  {
    id: 'cloudstore',
    title: 'CloudStore API',
    type: 'API',
    category: 'Backend & REST API',
    categoryTag: 'Full-Stack',
    role: 'Backend Developer',
    desc: {
      ro: 'Backend REST pentru platforme e-commerce, construit cu tranzacții PostgreSQL sigure (ACID), autentificare JWT, procesare de comenzi și cache Redis pentru latență redusă.',
      en: 'Production-oriented REST API backend built with Node.js and PostgreSQL. Features ACID order transactions, JWT authentication, and Redis caching for low-latency responses.'
    },
    highlights: {
      ro: ['Tranzacții PostgreSQL ACID și cache Redis'],
      en: ['PostgreSQL ACID transactions and Redis cache']
    },
    tech: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
    github: 'https://github.com/StanSabin10'
  },
  {
    id: 'synthiq-ui',
    title: 'SynthIQ UI Kit',
    type: 'Web',
    category: 'Interfețe Moderne & Design System',
    categoryTag: 'Frontend',
    role: 'Frontend Developer',
    desc: {
      ro: 'Sistem de componente UI rapide, accesibile și responsive, construit cu React 19, Tailwind CSS și micro-interacțiuni fluide Framer Motion.',
      en: 'Fast, accessible, and responsive modern UI design system built with React 19, Tailwind CSS, and fluid Framer Motion micro-interactions.'
    },
    highlights: {
      ro: ['Design System modular și componente accesibile'],
      en: ['Modular Design System & accessible components']
    },
    tech: ['React 19', 'Next.js', 'Tailwind CSS', 'TypeScript'],
    github: 'https://github.com/StanSabin10'
  }
];

// Tech stack grouped by natural domains
const STACK_DATA = [
  {
    id: 'frontend',
    title: { ro: 'Frontend Engineering', en: 'Frontend Engineering' },
    desc: { ro: 'Interfețe rapide, fluide și accesibile.', en: 'Fast, fluid, and accessible interfaces.' },
    icon: Layers,
    items: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3', 'Zustand']
  },
  {
    id: 'backend',
    title: { ro: 'Backend & APIs', en: 'Backend & APIs' },
    desc: { ro: 'Arhitectură scalabilă, sigură și modulară.', en: 'Scalable, secure, and modular architecture.' },
    icon: Server,
    items: ['Node.js', 'Express', 'REST APIs', 'WebSockets', 'JWT', 'Google 1P API']
  },
  {
    id: 'databases',
    title: { ro: 'Baze de Date & Cache', en: 'Databases & Storage' },
    desc: { ro: 'Garanții ACID, tranzacții și viteză.', en: 'ACID guarantees, transactions, and cache.' },
    icon: Database,
    items: ['PostgreSQL', 'Redis', 'MongoDB', 'SQL / ACID']
  },
  {
    id: 'tools',
    title: { ro: 'Unelte & DevOps', en: 'Tools & DevOps' },
    desc: { ro: 'Containerizare, CI/CD și automatizare.', en: 'Containers, CI/CD, and automation.' },
    icon: Wrench,
    items: ['Git', 'GitHub', 'Docker', 'Vite', 'Linux CLI', 'Postman']
  }
];

// Reusable scroll-triggered fade component
function FadeInView({ 
  children, 
  delay = 0, 
  className = "", 
  yOffset = 18 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string; 
  yOffset?: number; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1], 
        delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 3D Tilt Project Card with Framer Motion spring physics & specular glare
function ProjectCard3D({ project, lang }: { project: Project; lang: Language }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for fluid movement and gentle return on mouse leave
  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 20 });

  // Subtle 3D tilt: max ~7 degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-4, 4]);

  // Ambient specular light reflection tracking mouse position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareBg = useMotionTemplate`radial-gradient(380px circle at ${glareX} ${glareY}, rgba(99, 102, 241, 0.16), transparent 75%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1100 }} className="h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bento-card-3d p-5 sm:p-6 rounded-2xl flex flex-col justify-between h-full group relative overflow-hidden transition-all duration-300 hover:border-indigo-400/40 hover:shadow-[0_14px_40px_-24px_rgba(99,102,241,0.65)]"
      >
        {/* Subtle specular spotlight highlight */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: glareBg }}
        />

        {/* Foreground Content with Parallax Elevation */}
        <div 
          className="space-y-4 relative z-10" 
          style={{ transform: 'translateZ(26px)', transformStyle: 'preserve-3d' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-500 dark:text-indigo-400 font-semibold mb-1 block">
                {project.category}
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                {project.title}
              </h3>
            </div>
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
              title={lang === 'ro' ? 'Vezi codul pe GitHub' : 'View on GitHub'}
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {project.desc[lang]}
          </p>
        </div>

        {/* Tech Stack with 3D Depth */}
        <div 
          className="pt-5 mt-auto border-t border-zinc-100 dark:border-zinc-800/50 flex flex-wrap items-center gap-2 relative z-10"
          style={{ transform: 'translateZ(18px)' }}
        >
          {project.tech.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200/60 bg-zinc-100/70 px-2 py-1 text-[11px] font-medium text-zinc-600 dark:border-zinc-700/50 dark:bg-zinc-800/60 dark:text-zinc-300">
              <TechIcon name={t} className="w-3.5 h-3.5 shrink-0" />
              <span>{t}</span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<Language>('ro');
  const [theme, setTheme] = useState<Theme>('dark');
  const [copied, setCopied] = useState(false);
  const [showCv, setShowCv] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize language and theme from localStorage
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('sabin_lang') as Language;
      if (savedLang === 'ro' || savedLang === 'en') {
        setLang(savedLang);
        document.documentElement.lang = savedLang;
      }
    } catch {}

    try {
      const savedTheme = localStorage.getItem('sabin_theme') as Theme;
      const initialTheme = savedTheme === 'light' ? 'light' : 'dark';
      setTheme(initialTheme);
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Section observer to update active nav state
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);

      const sections = ['hero', 'proiecte', 'tehnologii', 'experienta', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom >= 180) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLang = (l: Language) => {
    setLang(l);
    document.documentElement.lang = l;
    try {
      localStorage.setItem('sabin_lang', l);
    } catch {}
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('sabin_theme', nextTheme);
    } catch {}
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('stansabin575@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('Toate');

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'Toate') {
      return PROJECTS;
    }
    return PROJECTS.filter((p) => p.categoryTag === selectedCategory);
  }, [selectedCategory]);

  // Contact form state
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || 'YOUR_ACCESS_KEY_HERE';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          from_name: 'Portofoliu Sabin Stan Contact',
          subject: `Mesaj nou de la ${formData.name} prin portofoliu`,
        }),
      });

      const data: { success: boolean; message?: string } = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(
          data.message ||
            (lang === 'ro'
              ? 'A apărut o eroare la trimiterea mesajului. Te rog încearcă din nou sau trimite un email direct.'
              : 'An error occurred while sending your message. Please try again or email directly.')
        );
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage(
        lang === 'ro'
          ? 'Eroare de rețea. Te rog verifică conexiunea la internet sau scrie-mi direct la stansabin575@gmail.com.'
          : 'Network error. Please check your internet connection or email directly at stansabin575@gmail.com.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const navItems = [
    { id: 'proiecte', label: lang === 'ro' ? 'Proiecte' : 'Projects' },
    { id: 'tehnologii', label: lang === 'ro' ? 'Stack Tehnologic' : 'Skills' },
    { id: 'experienta', label: lang === 'ro' ? 'Experiență' : 'Experience' },
    { id: 'contact', label: 'Contact' }
  ];


  return (
    <div className="min-h-screen text-zinc-800 dark:text-zinc-200 font-sans selection:bg-indigo-500/20 selection:text-indigo-900 dark:selection:text-indigo-200 antialiased relative transition-colors duration-200 bg-grid-pattern">
      
      {/* Dynamic Ambient Background with drifting luminous aura */}
      <div className="fixed inset-0 ambient-glow pointer-events-none -z-10" />

      {/* FLOATING GLASSMORPHISM NAVBAR */}
    <header className="fixed top-4 inset-x-0 z-50 max-w-5xl mx-auto px-4 sm:px-6">
  <div className="glass-nav rounded-2xl px-5 sm:px-6 h-16 flex items-center justify-between transition-all duration-300">
    <a href="#hero" className="flex items-center gap-3 group">
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-900/90 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex items-center justify-center overflow-hidden group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/10 transition-all duration-300 shrink-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <svg
          className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 relative z-10"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M16.5 7.5C16.5 5.57 14.8 4 12.5 4H9C6.79 4 5 5.79 5 8C5 10.21 6.79 12 9 12H15C17.21 12 19 13.79 19 16C19 18.21 17.21 20 15 20H11.5C9.2 20 7.5 18.43 7.5 16.5"
            stroke="url(#brand-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16.5" cy="7.5" r="1.2" fill="#06B6D4" />
          <circle cx="7.5" cy="16.5" r="1.2" fill="#6366F1" />
          <defs>
            <linearGradient id="brand-grad" x1="5" y1="4" x2="19" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366F1" />
              <stop offset="0.5" stopColor="#A855F7" />
              <stop offset="1" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col">
        <span className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base group-hover:text-purple-400 transition-colors leading-snug">
          Sabin Stan
        </span>
        <span className="text-[10px] sm:text-[11px] text-zinc-400 font-mono leading-none mt-0.5 hidden sm:inline-block">
          Full-Stack Developer
        </span>
      </div>
    </a>

    <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
      {navItems.map((item) => {
        const isActive = activeSection === item.id;

        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`bg-transparent px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-white/5 ${
              isActive
                ? 'text-zinc-900 dark:text-white font-semibold'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {item.label}
          </a>
        );
      })}
    </nav>

    <div className="flex items-center gap-3">
      <motion.a
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        href="/cv.html"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 text-xs font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-200 transition-colors hidden sm:inline-flex items-center gap-1.5"
      >
        <FileText className="w-3.5 h-3.5" />
        <span>CV (PDF)</span>
      </motion.a>

      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="p-2 rounded-xl md:hidden text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        aria-label="Open menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
    </div>
  </div>

  <AnimatePresence>
    {mobileMenuOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="glass-nav mt-2 rounded-2xl p-4 md:hidden space-y-2"
      >
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setMobileMenuOpen(false)}
            className={`block bg-transparent text-sm font-medium py-2 px-3 rounded-lg hover:bg-white/5 transition-colors ${
              activeSection === item.id
                ? 'text-zinc-900 dark:text-white'
                : 'text-zinc-500 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {item.label}
          </a>
        ))}

        <div className="pt-2 border-t border-zinc-200/70 dark:border-white/10">
          <a
            href="/cv.html"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-2.5 text-xs font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-200 transition-colors text-center flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Curriculum Vitae (PDF)</span>
          </a>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-28 sm:pt-36 pb-12 sm:pb-20 space-y-28 sm:space-y-36">

        {/* 1. HERO SECTION — Modern Developer Intro */}
        <section id="hero" className="scroll-mt-28">
          <FadeInView delay={0.05} yOffset={14}>
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 lg:gap-14">
              
              <div className="space-y-6 max-w-xl text-center md:text-left">

                {/* Available for work badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-600 dark:text-emerald-400 shadow-xs backdrop-blur-xs w-fit mx-auto md:mx-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>
                    {lang === 'ro'
                      ? 'Disponibil pentru roluri Junior / Full-Stack & Freelance'
                      : 'Available for Junior / Full-Stack & Freelance'}
                  </span>
                </div>

                {/* Name & Title */}
                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.08]">
                    Sabin Stan
                  </h1>
                  <p className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 dark:from-indigo-400 dark:via-purple-300 dark:to-cyan-400 bg-clip-text text-transparent">
                    Full-Stack Software Developer
                  </p>
                </div>

                {/* Bio Prose — Professional & Modern */}
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
                  {lang === 'ro'
                    ? 'Dezvoltator Web axat pe aplicații rapide, responsive, integrări API și interfețe moderne în React / Next.js.'
                    : 'Web Developer focused on fast, responsive applications, API integrations, and modern interfaces in React / Next.js.'}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-sm">
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href="#contact"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{lang === 'ro' ? 'Contactează-mă' : 'Get in touch'}</span>
                  </motion.a>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowCv(true)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 bg-white/80 dark:bg-zinc-900/80 hover:border-indigo-500/50 text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-2 text-xs font-semibold shadow-xs"
                  >
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span>{lang === 'ro' ? 'Descarcă CV' : 'Download CV'}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={copyEmail}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 bg-white/80 dark:bg-zinc-900/80 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-2 text-xs font-mono shadow-xs"
                    title="Copiază email"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-500 animate-bounce" />
                    ) : (
                      <Copy className="w-4 h-4 text-zinc-400" />
                    )}
                    <span>{copied ? (lang === 'ro' ? 'Copiat!' : 'Copied!') : 'stansabin575@gmail.com'}</span>
                  </motion.button>

                  <div className="flex items-center gap-1 text-zinc-400 border-l border-zinc-200 dark:border-zinc-800 pl-3">
                    <a
                      href="https://github.com/StanSabin10"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/sabin-stan-7521aa336/"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Developer Portrait */}
              <motion.div
                className="relative shrink-0 w-full max-w-[270px] sm:max-w-[310px] md:max-w-[330px] lg:max-w-[350px]"
              >
                {/* Luminous aura backlight halo */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/40 via-purple-500/30 to-cyan-400/40 rounded-3xl blur-2xl opacity-75 -z-10 animate-pulse" />

                <div className="aspect-square rounded-3xl overflow-hidden border-2 border-indigo-500/30 dark:border-indigo-400/40 bg-zinc-950 shadow-2xl relative group glow-card">
                  <img
                    src={profilePhoto}
                    alt="Sabin Stan"
                    className="w-full h-full object-cover grayscale transition-all duration-500 ease-out group-hover:grayscale-0"
                  />
                </div>
              </motion.div>

            </div>
          </FadeInView>
        </section>

        {/* 2. PROIECTE (Projects) */}
        <section id="proiecte" className="scroll-mt-28 space-y-8 sm:space-y-10">
          <FadeInView delay={0.06}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wider uppercase font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'ro' ? 'Portofoliu Selectat' : 'Selected Work'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                {lang === 'ro' ? 'Proiecte Relevante' : 'Featured Projects'}
              </h2>
            </div>
          </FadeInView>

          {/* Clean Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {filteredProjects.map((project, idx) => (
              <FadeInView key={project.id} delay={0.05 + idx * 0.05} className="h-full">
                <ProjectCard3D project={project} lang={lang} />
              </FadeInView>
            ))}
          </div>
        </section>

        {/* 3. STACK TEHNOLOGIC (Skills) */}
        <section id="tehnologii" className="scroll-mt-28 space-y-10 sm:space-y-12">
          <FadeInView delay={0.06}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wider uppercase font-mono">
                <Layers className="w-3.5 h-3.5" />
                <span>{lang === 'ro' ? 'Competențe Cheie' : 'Technical Proficiency'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {lang === 'ro' ? 'Stack tehnologic' : 'Skills & Technologies'}
              </h2>
              <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl">
                {lang === 'ro' ? 'Limbajele, framework-urile și instrumentele pe care le stăpânesc.' : 'Languages, frameworks, and tools I leverage to build software.'}
              </p>
            </div>
          </FadeInView>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {STACK_DATA.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <FadeInView key={cat.id} delay={0.06 + idx * 0.05} className="h-full">
                  <div className="bento-card glow-card p-6 sm:p-7 rounded-2xl hover-lift flex flex-col justify-between h-full space-y-5 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.12)]">
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 font-bold text-zinc-900 dark:text-white text-base">
                        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span>{cat.title[lang]}</span>
                      </div>

                      {/* Flex-Wrap Badges */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {cat.items.map((tech) => (
                          <div 
                            key={tech} 
                            className="inline-flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 px-2.5 py-1.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-indigo-500/30 transition-colors font-medium"
                          >
                            <TechIcon name={tech} className="w-3.5 h-3.5 shrink-0" />
                            <span>{tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 leading-relaxed">
                      {cat.desc[lang]}
                    </p>

                  </div>
                </FadeInView>
              );
            })}
          </div>
        </section>

        {/* 4. EXPERIENȚĂ & EDUCAȚIE — Timeline Layout */}
        <section id="experienta" className="scroll-mt-28 space-y-10 sm:space-y-12">
          <FadeInView delay={0.06}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wider uppercase font-mono">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{lang === 'ro' ? 'Traseu Profesional' : 'Career Pathway'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {lang === 'ro' ? 'Experiență & Studii' : 'Experience & Education'}
              </h2>
              <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl">
                {lang === 'ro' 
                  ? 'Parcursul meu în dezvoltarea web și pregătirea academică la facultate.' 
                  : 'My web development journey and academic computer science background.'}
              </p>
            </div>
          </FadeInView>

          {/* Timeline Container */}
          <div className="relative pl-6 sm:pl-8 space-y-8 sm:space-y-10">
            {/* Vertical timeline line */}
            <div className="timeline-line" />

            {/* Item 1: Full-Stack Web Developer */}
            <FadeInView delay={0.08} className="relative">
              <div className="absolute -left-[calc(1.5rem+7px)] sm:-left-[calc(2rem+7px)] top-1.5 w-4 h-4 rounded-full bg-indigo-600 dark:bg-indigo-400 border-4 border-white dark:border-zinc-950 timeline-node shadow-md shadow-indigo-500/30" />
              
              <div className="bento-card glow-card p-6 sm:p-8 rounded-2xl hover-lift space-y-5 border border-zinc-200/70 dark:border-zinc-800/70">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-2xs">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-base sm:text-lg tracking-tight">
                        Full-Stack Web Development
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                        {lang === 'ro' ? 'Freelance & Proiecte Personale' : 'Personal Projects & Freelance'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/70 dark:border-indigo-800/60">
                    2023 — Prezent
                  </span>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal pt-1">
                  {lang === 'ro'
                    ? 'Dezvolt aplicații web moderne având la bază HTML, CSS și JavaScript. În prezent aprofundez React pentru crearea de interfețe dinamice, iar pe partea de backend învăț Next.js, gestiunea bazelor de date și integrarea modelelor de Inteligență Artificială (AI).'
                    : 'Building modern web applications grounded in HTML, CSS, and JavaScript. Currently expanding my expertise in React for dynamic frontend UIs, while focusing on Next.js, database systems, and AI integrations on the backend.'}
                </p>

                {/* Clean, well-spaced badges */}
                <div className="pt-2">
                  <div className="flex flex-wrap gap-2">
                    {[
                      'HTML5',
                      'CSS3',
                      'JavaScript',
                      'React',
                      'Next.js',
                      'Baze de Date',
                      'Integrare AI'
                    ].map((item) => (
                      <span 
                        key={item} 
                        className="text-xs font-medium px-3 py-1.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/50"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeInView>

            {/* Item 2: Education - UPG Ploiești */}
            <FadeInView delay={0.12} className="relative">
              <div className="absolute -left-[calc(1.5rem+7px)] sm:-left-[calc(2rem+7px)] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-zinc-950 timeline-node shadow-md shadow-emerald-500/30" />

              <div className="bento-card glow-card p-6 sm:p-8 rounded-2xl hover-lift space-y-5 border border-zinc-200/70 dark:border-zinc-800/70">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-2xs">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-base sm:text-lg tracking-tight">
                        {lang === 'ro' ? 'Specializarea Calculatoare (Anul 2)' : 'Computer Engineering (2nd Year)'}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                        Universitatea Petrol-Gaze din Ploiești (UPG)
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200/70 dark:border-emerald-800/60">
                    Anul 2 · Student
                  </span>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal pt-1">
                  {lang === 'ro'
                    ? 'Student în anul 2 la UPG Ploiești, domeniul Calculatoare. Parcurg un program academic axat pe principiile fundamentale ale informaticii, structuri de date, algoritmi, arhitectura sistemelor de calcul și rețele.'
                    : '2nd-year Computer Engineering student at Petroleum-Gas University of Ploiești (UPG). Developing a strong theoretical and practical foundation in computer science, data structures, algorithms, system architecture, and networking.'}
                </p>

                <div className="pt-2">
                  <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 block mb-2 font-medium">
                    {lang === 'ro' ? 'Domenii Academice:' : 'Academic Subjects:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'UPG Ploiești',
                      'Calculatoare - Anul 2',
                      'Structuri de Date',
                      'Algoritmi',
                      'Arhitectura Calculatoarelor',
                      'Programare & Rețele'
                    ].map((tag) => (
                      <span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeInView>

          </div>
        </section>

        {/* 5. CONTACT DIRECT & FORMULAR */}
        <section id="contact" className="scroll-mt-28 space-y-10 sm:space-y-12">
          <FadeInView delay={0.06}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wider uppercase font-mono">
                <Mail className="w-3.5 h-3.5" />
                <span>{lang === 'ro' ? 'Canal Direct & Formular' : 'Direct Channel & Form'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                {lang === 'ro' ? 'Hai să colaborăm' : "Let's collaborate"}
              </h2>
              <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl">
                {lang === 'ro'
                  ? 'Trimite-mi un mesaj rapid prin formularul de mai jos sau folosește canalele directe de contact.'
                  : 'Send me a direct message through the form below or connect via direct channels.'}
              </p>
            </div>
          </FadeInView>

          <FadeInView delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* FORMULAR DE CONTACT INTERACTIV (WEB3FORMS) */}
              <div className="lg:col-span-7 bento-card glow-card p-6 sm:p-8 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white">
                      {lang === 'ro' ? 'Trimite un mesaj' : 'Send a message'}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {lang === 'ro' ? 'Răspund de obicei în mai puțin de 24 de ore.' : 'Usually responding in less than 24 hours.'}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <Send className="w-4 h-4" />
                  </div>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {lang === 'ro' ? 'Nume complet' : 'Full Name'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={lang === 'ro' ? 'ex. Andrei Ionescu' : 'e.g. John Doe'}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {lang === 'ro' ? 'Adresă de Email' : 'Email Address'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={lang === 'ro' ? 'ex. andrei@exemplu.ro' : 'e.g. john@example.com'}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {lang === 'ro' ? 'Mesaj' : 'Message'} <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={lang === 'ro' ? 'Descrie proiectul, rolul deschis sau propunerea ta...' : 'Tell me about your project, open role, or collaboration...'}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Feedback Messages */}
                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-start gap-3 text-xs leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">
                            {lang === 'ro'
                              ? 'Mesaj trimis cu succes! Te voi contacta în cel mai scurt timp.'
                              : 'Message sent successfully! I will get back to you as soon as possible.'}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-start gap-3 text-xs leading-relaxed"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="font-medium">
                          {errorMessage || (lang === 'ro' ? 'A apărut o eroare la trimitere.' : 'An error occurred.')}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs tracking-wide uppercase transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{lang === 'ro' ? 'Se trimite...' : 'Sending...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{lang === 'ro' ? 'Trimite Mesajul' : 'Send Message'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* CANALE DIRECTE (Email, Minimap, Social) */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* Email Direct */}
                <div className="bento-card glow-card p-6 rounded-2xl flex flex-col justify-between space-y-4 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.12)]">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-mono">
                        <Mail className="w-4 h-4 text-indigo-500" />
                        <span>Email Direct</span>
                      </div>
                      {copied && (
                        <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Copiat!</span>
                        </span>
                      )}
                    </div>
                    <a
                      href="mailto:stansabin575@gmail.com"
                      className="font-semibold text-zinc-900 dark:text-white text-base hover:text-purple-400 transition-colors block text-left break-all cursor-pointer group"
                      title="Trimite un email direct la stansabin575@gmail.com"
                    >
                      stansabin575@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href="mailto:stansabin575@gmail.com"
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{lang === 'ro' ? 'Trimite email' : 'Send email'}</span>
                    </a>
                    <button
                      onClick={copyEmail}
                      className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono cursor-pointer transition-colors"
                      title="Copiază adresa"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? (lang === 'ro' ? 'Copiat!' : 'Copied!') : (lang === 'ro' ? 'Copiază' : 'Copy')}</span>
                    </button>
                  </div>
                </div>

                {/* Locație cu Google Maps */}
                <div className="bento-card glow-card p-6 rounded-2xl flex flex-col justify-between space-y-4 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.12)]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-mono">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{lang === 'ro' ? 'Locație' : 'Location'}</span>
                      </div>
                      <a
                        href="https://maps.google.com/?q=Ploiesti,+Romania"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Google Maps"
                      >
                        <span>Google Maps</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>

                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-white text-base">
                        Ploiești, România
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {lang === 'ro' ? 'Disponibil Remote & On-site' : 'Available Remote & On-site'}
                      </p>
                    </div>

                    {/* Google Maps Minimap */}
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 shadow-inner">
                      <iframe
                        title="Google Maps Ploiești"
                        src="https://maps.google.com/maps?q=Ploiesti,+Romania&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        className="w-full h-full border-0 filter dark:invert-[90%] dark:hue-rotate-180 dark:contrast-[95%]"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </FadeInView>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 py-10 text-xs text-zinc-500 transition-colors">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Sabin Stan · Full-Stack Software Developer</p>
          <div className="flex items-center gap-6">
            <a href="https://github.com/StanSabin10" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/sabin-stan-7521aa336/" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">LinkedIn</a>
            <a href="mailto:stansabin575@gmail.com" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">stansabin575@gmail.com</a>
          </div>
        </div>
      </footer>

      {/* CLEAN ATS RESUME MODAL */}
      <AnimatePresence>
        {showCv && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 text-zinc-700 dark:text-zinc-300 space-y-6 shadow-2xl transition-colors"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Curriculum Vitae — Sabin Stan</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-900 text-xs font-semibold dark:hover:bg-white flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / PDF</span>
                  </button>
                  <button
                    onClick={() => setShowCv(false)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed">
                <div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white">Sabin Stan</h4>
                  <p className="text-zinc-500 dark:text-zinc-400 font-mono">Full-Stack Web Developer · stansabin575@gmail.com · Ploiești, România</p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-semibold text-zinc-900 dark:text-white uppercase text-[11px] border-b border-zinc-200 dark:border-zinc-800 pb-1">Profil</h5>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Student în anul 2 la Calculatoare (UPG Ploiești) și dezvoltator Web Full-Stack. Cunoștințe solide de HTML, CSS, JavaScript, aprofundând în prezent React, Next.js, baze de date și integrări cu AI.
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-semibold text-zinc-900 dark:text-white uppercase text-[11px] border-b border-zinc-200 dark:border-zinc-800 pb-1">Competențe</h5>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    HTML5, CSS3, JavaScript, React (în progres), Next.js, Baze de Date (PostgreSQL, MySQL), Integrări AI API, Git & GitHub.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-semibold text-zinc-900 dark:text-white uppercase text-[11px] border-b border-zinc-200 dark:border-zinc-800 pb-1">Proiecte Reprezentative</h5>
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-white">DevTask</span> — Aplicație web Kanban cu integrare Google Chat API (React, TS, Tailwind).
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-white">CloudStore API</span> — REST API e-commerce cu autentificare și baze de date.
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-white">SystemPulse</span> — Dashboard de monitorizare în timp real.
                  </div>
                </div>

                <div className="space-y-1">
                  <h5 className="font-semibold text-zinc-900 dark:text-white uppercase text-[11px] border-b border-zinc-200 dark:border-zinc-800 pb-1">Educație</h5>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    <strong className="text-zinc-900 dark:text-white">Specializarea Calculatoare (Anul 2)</strong> — Universitatea Petrol-Gaze din Ploiești (UPG)
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING SCROLL TO TOP BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 14 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 shadow-xl hover:scale-105 active:scale-95 transition-all group cursor-pointer"
            aria-label={lang === 'ro' ? 'Înapoi sus' : 'Scroll to top'}
            title={lang === 'ro' ? 'Înapoi sus' : 'Scroll to top'}
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
