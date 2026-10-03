import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2,
  Sun,
  Moon
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
    items: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3']
  },
  {
    id: 'backend',
    title: { ro: 'Backend & APIs', en: 'Backend & APIs' },
    desc: { ro: 'Arhitectură scalabilă, sigură și modulară.', en: 'Scalable, secure, and modular architecture.' },
    icon: Server,
    items: ['Node.js', 'Express', 'REST APIs', 'WebSockets', 'JWT']
  },
  {
    id: 'databases',
    title: { ro: 'Baze de Date & Cache', en: 'Databases & Storage' },
    desc: { ro: 'Garanții ACID, tranzacții și viteză.', en: 'ACID guarantees, transactions, and cache.' },
    icon: Database,
    items: ['PostgreSQL', 'MongoDB', 'SQL / ACID']
  },
  {
    id: 'tools',
    title: { ro: 'Unelte & DevOps', en: 'Tools & DevOps' },
    desc: { ro: 'Containerizare, CI/CD și automatizare.', en: 'Containers, CI/CD, and automation.' },
    icon: Wrench,
    items: ['Git', 'GitHub', 'Docker', 'Vite']
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
  const glareBg = useMotionTemplate`radial-gradient(380px circle at ${glareX} ${glareY}, rgba(6, 182, 212, 0.1), transparent 72%)`;

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
        className="bento-card-3d p-5 sm:p-6 flex flex-col justify-between h-full group relative overflow-hidden"
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
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                {project.title}
              </h3>
            </div>
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/8 transition-colors shrink-0"
              aria-label={lang === 'ro' ? 'Vezi codul pe GitHub' : 'View on GitHub'}
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
          className="pt-5 mt-auto border-t border-zinc-100 dark:border-white/10 flex flex-wrap items-center gap-2 relative z-10"
          style={{ transform: 'translateZ(18px)' }}
        >
          {project.tech.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200/70 bg-zinc-50/90 px-2.5 py-1 text-[11px] font-medium text-zinc-600 dark:border-white/10 dark:bg-white/[0.045] dark:text-zinc-300">
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
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const cvTriggerRef = useRef<HTMLButtonElement>(null);
  const cvCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showCv) cvCloseRef.current?.focus();
  }, [showCv]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    const desktopMedia = window.matchMedia('(min-width: 1024px)');
    const handleBreakpointChange = () => {
      if (desktopMedia.matches) setMobileMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    desktopMedia.addEventListener('change', handleBreakpointChange);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
      desktopMedia.removeEventListener('change', handleBreakpointChange);
    };
  }, [mobileMenuOpen]);

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
    { id: 'tehnologii', label: lang === 'ro' ? 'Tehnologii' : 'Skills' },
    { id: 'experienta', label: lang === 'ro' ? 'Experiență' : 'Experience' },
    { id: 'contact', label: 'Contact' }
  ];


  return (
    <div className="portfolio-shell min-h-screen text-zinc-800 dark:text-zinc-200 font-sans selection:bg-indigo-500/20 selection:text-indigo-900 dark:selection:text-indigo-200 antialiased relative transition-colors duration-200 bg-grid-pattern">
      
      {/* Ambient lighting stays behind the interactive content. */}
      <div className="ambient-glow fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <span className="ambient-blob ambient-blob-violet" />
        <span className="ambient-blob ambient-blob-blue" />
        <span className="ambient-blob ambient-blob-cyan" />
      </div>

      <header ref={headerRef} className="site-header">
        <div className="header-inner max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="header-brand" aria-hidden="true" />

          <nav className="header-nav" aria-label={lang === 'ro' ? 'Navigație principală' : 'Main navigation'}>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="header-nav-link"
                aria-current={activeSection === item.id ? 'location' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <div className="header-language hidden sm:flex" role="group" aria-label={lang === 'ro' ? 'Alege limba' : 'Choose language'}>
              {(['ro', 'en'] as const).map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => changeLang(language)}
                  aria-pressed={lang === language}
                  className="header-language-button"
                  title={language === 'ro' ? 'Română' : 'English'}
                >
                  {language.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="header-icon-button"
              aria-label={theme === 'dark' ? (lang === 'ro' ? 'Activează tema luminoasă' : 'Switch to light theme') : (lang === 'ro' ? 'Activează tema întunecată' : 'Switch to dark theme')}
              title={theme === 'dark' ? (lang === 'ro' ? 'Tema luminoasă' : 'Light theme') : (lang === 'ro' ? 'Tema întunecată' : 'Dark theme')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="header-icon-button header-menu-toggle"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? (lang === 'ro' ? 'Închide meniul' : 'Close menu') : (lang === 'ro' ? 'Deschide meniul' : 'Open menu')}
              title={lang === 'ro' ? 'Meniu' : 'Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="header-mobile-menu lg:hidden"
            >
              <div className="header-mobile-inner max-w-6xl mx-auto px-5 sm:px-8">
                <nav aria-label={lang === 'ro' ? 'Navigație mobilă' : 'Mobile navigation'}>
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="header-mobile-link"
                      aria-current={activeSection === item.id ? 'location' : undefined}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                <div className="header-mobile-options flex sm:hidden">
                  <div className="header-language flex" role="group" aria-label={lang === 'ro' ? 'Alege limba' : 'Choose language'}>
                    {(['ro', 'en'] as const).map((language) => (
                      <button
                        key={language}
                        type="button"
                        onClick={() => changeLang(language)}
                        aria-pressed={lang === language}
                        className="header-language-button"
                        title={language === 'ro' ? 'Română' : 'English'}
                      >
                        {language.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <a
                    href="/cv.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="header-mobile-cv"
                  >
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    <span>Curriculum Vitae</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 pt-32 sm:pt-40 pb-12 sm:pb-20 space-y-24 sm:space-y-32 lg:space-y-36">

        {/* 1. HERO SECTION — Modern Developer Intro */}
        <section id="hero" className="scroll-mt-28">
          <FadeInView delay={0.05} yOffset={14}>
            <div className="hero-panel flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-16 p-6 sm:p-10 lg:p-14">
              
              <div className="hero-copy w-full max-w-xl space-y-7 text-center md:text-left">

                {/* Name & Title */}
                <div className="space-y-3">
                  <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-900 dark:text-white leading-[0.98]">
                    Sabin Stan
                  </h1>
                  <p className="hero-role text-lg sm:text-xl font-semibold text-zinc-700 dark:text-zinc-200">
                    <span className="text-zinc-700 dark:text-zinc-200">Full-Stack</span> Software Developer
                  </p>
                </div>

                {/* Bio Prose — Professional & Modern */}
                <p className="hero-bio mx-auto max-w-xl text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal md:mx-0">
                  {lang === 'ro'
                    ? 'Dezvoltator Web axat pe aplicații rapide, responsive, integrări API și interfețe moderne în React / Next.js.'
                    : 'Web Developer focused on fast, responsive applications, API integrations, and modern interfaces in React / Next.js.'}
                </p>

                {/* Action Buttons */}
                <div className="hero-actions space-y-3 pt-2 text-sm">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-3">
                    <motion.a
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      href="#contact"
                      className="inline-flex min-h-12 w-full sm:w-auto justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-bold transition-all shadow-[0_18px_40px_-18px_rgba(34,211,238,0.9)] items-center gap-2"
                    >
                      <Mail className="w-4 h-4" aria-hidden="true" />
                      <span>{lang === 'ro' ? 'Contactează-mă' : 'Get in touch'}</span>
                    </motion.a>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      ref={cvTriggerRef}
                      onClick={() => setShowCv(true)}
                      className="inline-flex min-h-12 w-full sm:w-auto justify-center px-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:border-cyan-400/60 hover:bg-white/[0.06] text-zinc-100 transition-colors items-center gap-2 text-xs font-semibold shadow-[0_12px_30px_-22px_rgba(103,232,249,0.8)]"
                    >
                      <FileText className="w-4 h-4 text-cyan-300" aria-hidden="true" />
                      <span>{lang === 'ro' ? 'Descarcă CV' : 'Download CV'}</span>
                    </motion.button>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=stansabin575@gmail.com&su=Hello%20Sabin&body=Hi%20Sabin%2C%0A%0AI%20wanted%20to%20reach%20out%20about%20..."
                      target="_blank"
                      rel="noreferrer"
                      className="hero-email group inline-flex min-h-11 max-w-full items-center justify-center rounded-lg border border-white/10 bg-slate-900/40 px-3 py-2 text-xs font-mono text-slate-200 transition-colors hover:border-cyan-400/60 hover:text-cyan-200"
                      aria-label={lang === 'ro' ? 'Trimite email la stansabin575@gmail.com' : 'Email stansabin575@gmail.com'}
                      title="Trimite email direct pe Gmail"
                    >
                      <span className="break-all">stansabin575@gmail.com</span>
                    </motion.a>

                    <div className="flex items-center gap-1 text-zinc-400">
                    <a
                      href="https://github.com/StanSabin10"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 min-w-11 items-center justify-center hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/8 rounded-xl transition-colors"
                      aria-label="GitHub"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/sabin-stan-7521aa336/?isSelfProfile=true"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 min-w-11 items-center justify-center hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/8 rounded-xl transition-colors"
                      aria-label="LinkedIn"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
                </div>

              </div>

              {/* Developer Portrait */}
              <motion.div
                className="hero-portrait relative shrink-0 w-full max-w-[210px] sm:max-w-[250px] md:max-w-[275px] lg:max-w-[300px]"
              >
                {/* Luminous aura backlight halo */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/16 via-indigo-500/12 to-emerald-500/10 rounded-3xl blur-2xl opacity-70 -z-10" />

                <div className="portrait-frame aspect-[4/5] rounded-3xl overflow-hidden border border-zinc-200/70 dark:border-white/12 bg-zinc-950 shadow-2xl relative group">
                  <motion.img
                    src={profilePhoto}
                    alt="Sabin Stan"
                    initial={{ filter: 'grayscale(35%) saturate(0.9)' }}
                    animate={{ filter: 'grayscale(0%) saturate(1.08) contrast(1.04)' }}
                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full object-cover transition-all duration-2000 ease-out"
                  />
                </div>
              </motion.div>

            </div>
          </FadeInView>
        </section>

        {/* 2. PROIECTE (Projects) */}
        <section id="proiecte" className="scroll-mt-28 space-y-8 sm:space-y-10">
          <FadeInView delay={0.06}>
            <div className="section-heading">
              <div className="section-eyebrow text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'ro' ? 'Portofoliu Selectat' : 'Selected Work'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 dark:text-white">
                {lang === 'ro' ? 'Proiecte Relevante' : 'Featured Projects'}
              </h2>
            </div>
          </FadeInView>

          {/* Clean Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {PROJECTS.map((project, idx) => (
              <FadeInView key={project.id} delay={0.05 + idx * 0.05} className="h-full">
                <ProjectCard3D project={project} lang={lang} />
              </FadeInView>
            ))}
          </div>
        </section>

        {/* 3. STACK TEHNOLOGIC (Skills) */}
        <section id="tehnologii" className="scroll-mt-28 space-y-10 sm:space-y-12">
          <FadeInView delay={0.06}>
            <div className="section-heading">
              <div className="section-eyebrow text-indigo-600 dark:text-indigo-400">
                <Layers className="w-3.5 h-3.5" />
                <span>{lang === 'ro' ? 'Competențe Cheie' : 'Technical Proficiency'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white">
                {lang === 'ro' ? 'Stack tehnologic' : 'Skills & Technologies'}
              </h2>
            </div>
          </FadeInView>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {STACK_DATA.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <FadeInView key={cat.id} delay={0.06 + idx * 0.05} className="h-full">
                  <div className="bento-card glow-card p-5 sm:p-6 rounded-2xl hover-lift flex flex-col justify-between h-full space-y-5 transition-all duration-300">
                    
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

                  </div>
                </FadeInView>
              );
            })}
          </div>
        </section>

        {/* 4. EXPERIENȚĂ & EDUCAȚIE */}
        <section id="experienta" className="scroll-mt-28 space-y-8 sm:space-y-10">
          <FadeInView delay={0.06}>
            <div className="section-heading">
              <div className="section-eyebrow text-indigo-600 dark:text-indigo-400">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{lang === 'ro' ? 'Parcursul meu' : 'My Journey'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white">
                {lang === 'ro' ? 'Experiență & Studii' : 'Experience & Education'}
              </h2>
            </div>
          </FadeInView>

          <div className="experience-list">
            <FadeInView delay={0.08}>
              <article className="experience-entry">
                <div className="experience-content">
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">Full-Stack Web Development</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {lang === 'ro' ? 'Freelance & Proiecte Personale' : 'Personal Projects & Freelance'}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mt-4 max-w-2xl">
                    {lang === 'ro'
                      ? 'Dezvolt aplicații web moderne având la bază HTML, CSS și JavaScript. În prezent aprofundez React pentru crearea de interfețe dinamice, iar pe partea de backend învăț Next.js, gestiunea bazelor de date și integrarea modelelor de Inteligență Artificială (AI).'
                      : 'Building modern web applications grounded in HTML, CSS, and JavaScript. Currently expanding my expertise in React for dynamic frontend UIs, while focusing on Next.js, database systems, and AI integrations on the backend.'}
                  </p>
                  <p className="experience-topics">
                    {lang === 'ro'
                      ? 'HTML5  ·  CSS3  ·  JavaScript  ·  React  ·  Next.js  ·  Baze de date  ·  Integrare AI'
                      : 'HTML5  ·  CSS3  ·  JavaScript  ·  React  ·  Next.js  ·  Databases  ·  AI integration'}
                  </p>
                </div>
              </article>
            </FadeInView>

            <FadeInView delay={0.12}>
              <article className="experience-entry">
                <div className="experience-content">
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                    {lang === 'ro' ? 'Specializarea Calculatoare (Anul 2)' : 'Computer Engineering (2nd Year)'}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Universitatea Petrol-Gaze din Ploiești (UPG)</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mt-4 max-w-2xl">
                    {lang === 'ro'
                      ? 'Student în anul 2 la UPG Ploiești, domeniul Calculatoare. Parcurg un program academic axat pe principiile fundamentale ale informaticii, structuri de date, algoritmi, arhitectura sistemelor de calcul și rețele.'
                      : '2nd-year Computer Engineering student at Petroleum-Gas University of Ploiești (UPG). Developing a strong theoretical and practical foundation in computer science, data structures, algorithms, system architecture, and networking.'}
                  </p>
                  <p className="experience-topics">
                    {lang === 'ro'
                      ? 'Structuri de date  ·  Algoritmi  ·  Arhitectura calculatoarelor  ·  Programare & rețele'
                      : 'Data structures  ·  Algorithms  ·  Computer architecture  ·  Programming & networks'}
                  </p>
                </div>
              </article>
            </FadeInView>
          </div>
        </section>

        {/* 5. CONTACT DIRECT & FORMULAR */}
        <section id="contact" className="scroll-mt-28 space-y-10 sm:space-y-12">
          <FadeInView delay={0.06}>
            <div className="section-heading">
              <div className="section-eyebrow text-indigo-600 dark:text-indigo-400">
                <Mail className="w-3.5 h-3.5" />
                <span>{lang === 'ro' ? 'Canal Direct & Formular' : 'Direct Channel & Form'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 dark:text-white">
                {lang === 'ro' ? 'Hai să colaborăm' : "Let's collaborate"}
              </h2>
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
                        role="status"
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
                        role="alert"
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
                    className="min-h-11 w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-sm transition-colors shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="bento-card glow-card p-6 rounded-2xl flex flex-col justify-between space-y-4 transition-all duration-300">
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
                      className="inline-flex min-h-11 items-center font-semibold text-zinc-900 dark:text-white text-base hover:text-purple-400 transition-colors text-left break-all cursor-pointer group"
                      title="Trimite un email direct la stansabin575@gmail.com"
                    >
                      stansabin575@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href="mailto:stansabin575@gmail.com"
                      className="inline-flex min-h-11 items-center px-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline gap-1 font-medium transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{lang === 'ro' ? 'Trimite email' : 'Send email'}</span>
                    </a>
                    <button
                      onClick={copyEmail}
                      className="inline-flex min-h-11 items-center px-2 text-xs text-zinc-400 hover:text-zinc-200 gap-1 font-mono cursor-pointer transition-colors"
                      title="Copiază adresa"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? (lang === 'ro' ? 'Copiat!' : 'Copied!') : (lang === 'ro' ? 'Copiază' : 'Copy')}</span>
                    </button>
                  </div>
                </div>

                {/* Locație cu Google Maps */}
                <div className="bento-card glow-card p-6 rounded-2xl flex flex-col justify-between space-y-4 transition-all duration-300">
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
                        className="inline-flex min-h-11 items-center gap-1 px-2 text-[11px] font-mono text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
      <footer className="relative z-10 border-t border-zinc-200/80 dark:border-zinc-800/80 py-10 text-xs text-zinc-500 transition-colors">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Sabin Stan · Full-Stack Software Developer</p>
          <div className="flex items-center gap-6">
            <a href="https://github.com/StanSabin10" target="_blank" rel="noreferrer" className="inline-flex min-h-11 min-w-11 items-center justify-center hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/sabin-stan-7521aa336/" target="_blank" rel="noreferrer" className="inline-flex min-h-11 min-w-11 items-center justify-center hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">LinkedIn</a>
            <a href="mailto:stansabin575@gmail.com" className="inline-flex min-h-11 items-center hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">stansabin575@gmail.com</a>
          </div>
        </div>
      </footer>

      {/* CLEAN ATS RESUME MODAL */}
      <AnimatePresence onExitComplete={() => cvTriggerRef.current?.focus()}>
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
              role="dialog"
              aria-modal="true"
              aria-labelledby="cv-modal-title"
              className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 text-zinc-700 dark:text-zinc-300 space-y-6 shadow-2xl transition-colors"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <h3 id="cv-modal-title" className="text-sm font-bold text-zinc-900 dark:text-white">Curriculum Vitae — Sabin Stan</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="min-h-11 px-3 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-900 text-xs font-semibold dark:hover:bg-white flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / PDF</span>
                  </button>
                  <button
                    ref={cvCloseRef}
                    onClick={() => setShowCv(false)}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    aria-label={lang === 'ro' ? 'Închide CV-ul' : 'Close CV'}
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
            className="fixed bottom-8 right-8 z-40 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 shadow-xl hover:scale-105 active:scale-95 transition-all group cursor-pointer"
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
