import React from 'react';

interface TechIconProps {
  name: string;
  className?: string;
  showContainer?: boolean;
}

interface TechBadgeProps {
  name: string;
  className?: string;
  showLabel?: boolean;
}

export function TechIcon({ name, className = "w-3.5 h-3.5", showContainer = false }: TechIconProps) {
  const normalized = name.toLowerCase().trim();

  const getSvg = () => {
    // React (Atom)
    if (normalized.includes('react')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#00d8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="12" rx="10" ry="4.5" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.8" fill="#00d8ff" />
        </svg>
      );
    }

    // TypeScript
    if (normalized.includes('typescript') || normalized === 'ts') {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#3178C6" />
          <path d="M12.5 10H7v2.2h2v7h2.7v-7h2V10h-1.2zm6.2 3.6c-.6-.4-1.2-.6-2-.6-.7 0-1.2.2-1.2.6 0 .5.5.7 1.4 1 1.7.5 2.5 1.3 2.5 2.7 0 1.6-1.3 2.6-3.2 2.6-1.2 0-2.2-.4-2.8-.9l.7-1.9c.6.5 1.4.8 2.2.8.7 0 1.2-.3 1.2-.7 0-.4-.4-.7-1.3-1-1.6-.5-2.6-1.2-2.6-2.6 0-1.6 1.3-2.6 3.1-2.6 1 0 1.9.3 2.5.7l-.5 1.9z" fill="#FFFFFF" />
        </svg>
      );
    }

    // Next.js
    if (normalized.includes('next.js') || normalized === 'next') {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="11" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8.5 7v10m0-10l7.2 9.5M15.5 7v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    // Tailwind CSS
    if (normalized.includes('tailwind')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#06B6D4">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z" />
        </svg>
      );
    }

    // HTML5
    if (normalized.includes('html')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#E34F26">
          <path d="M3 2l1.6 18.4 7.4 2.1 7.4-2.1L21 2H3zm14.3 6H8.2l.2 2.5h8.5l-.7 7.4-4.2 1.2-4.2-1.2-.3-3.4h2.4l.2 1.6 1.9.5 1.9-.5.2-2.5H7.7L7 5.5h10.6l-.3 2.5z" />
        </svg>
      );
    }

    // CSS3
    if (normalized.includes('css')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#1572B6">
          <path d="M3 2l1.6 18.4 7.4 2.1 7.4-2.1L21 2H3zm14.3 6H8.2l.2 2.5h8.5l-.7 7.4-4.2 1.2-4.2-1.2-.3-3.4h2.4l.2 1.6 1.9.5 1.9-.5.2-2.5H7.7L7 5.5h10.6l-.3 2.5z" />
        </svg>
      );
    }

    // Zustand
    if (normalized.includes('zustand')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#795548" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="13" r="8" fill="#8D6E63" fillOpacity="0.3" />
          <circle cx="7" cy="6" r="3" fill="#8D6E63" />
          <circle cx="17" cy="6" r="3" fill="#8D6E63" />
          <circle cx="9.5" cy="12" r="1" fill="#4E342E" />
          <circle cx="14.5" cy="12" r="1" fill="#4E342E" />
          <path d="M10 15q2 1.5 4 0" stroke="#4E342E" strokeWidth="1.5" />
        </svg>
      );
    }

    // Node.js
    if (normalized.includes('node')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#5FA04E">
          <path d="M12 2l9 5.2v10.4l-9 5.2-9-5.2V7.2L12 2zm0 2.3L4.8 8.5v7l7.2 4.2 7.2-4.2v-7L12 4.3z" />
          <path d="M12 7.5l4.5 2.6v5.2L12 18l-4.5-2.7v-5.2L12 7.5z" fill="#5FA04E" fillOpacity="0.6" />
        </svg>
      );
    }

    // Express
    if (normalized.includes('express')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h16M14 6l6 6-6 6" />
        </svg>
      );
    }

    // PostgreSQL
    if (normalized.includes('postgres')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#336791">
          <path d="M12 2a9 9 0 00-9 9c0 4.1 2.8 7.6 6.7 8.6.4.1.6-.2.6-.4v-1.6c-2.7.6-3.3-1.2-3.3-1.2-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.8.8.1-.6.3-1.1.6-1.3-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 015 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.8-2.3 4.7-4.5 4.9.4.3.7.9.7 1.8V20c0 .2.2.5.6.4A9 9 0 0021 11a9 9 0 00-9-9z" />
        </svg>
      );
    }

    // Stripe
    if (normalized.includes('stripe')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#635BFF">
          <rect width="24" height="24" rx="5" fill="#635BFF" fillOpacity="0.15" />
          <path d="M13.9 10.3c0-.8-.7-1.3-1.8-1.3-1.4 0-2.8.4-3.8 1l-.6-2.4c1.2-.6 2.8-.9 4.4-.9 3.2 0 5 1.6 5 4.3 0 3.8-5.3 3.3-5.3 5 0 .9.8 1.3 2 1.3 1.6 0 3.2-.6 4.3-1.3l.6 2.4c-1.3.8-3.1 1.2-5 1.2-3.3 0-5.3-1.7-5.3-4.3-.1-4 5.5-3.3 5.5-5z" fill="#635BFF" />
        </svg>
      );
    }

    // Redis
    if (normalized.includes('redis')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#DC382D">
          <path d="M2.5 14.8l9.5 4.7 9.5-4.7-2.3-1.2-7.2 3.6-7.2-3.6-2.3 1.2zm0-4l9.5 4.7 9.5-4.7-2.3-1.2-7.2 3.6-7.2-3.6-2.3 1.2zm9.5-6.3L2.5 9.2l9.5 4.7 9.5-4.7-9.5-4.7z" />
        </svg>
      );
    }

    // Firebase
    if (normalized.includes('firebase')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M4.5 17.5L8 3.5l3.5 6.5-7 7.5z" fill="#FFA000" />
          <path d="M19.5 17.5L16 8l-8 9.5h11.5z" fill="#F57C00" />
          <path d="M12 10.5l-4 7h8l-4-7z" fill="#FFCA28" />
          <path d="M4.5 17.5L12 21.5l7.5-4L12 5.5l-7.5 12z" fill="#FFC107" fillOpacity="0.4" />
        </svg>
      );
    }

    // Docker
    if (normalized.includes('docker')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#2496ED">
          <path d="M23.5 11.2c-.4-.3-1.3-.4-2-.2-.2-.5-.5-1-.9-1.4l-.5.4c.3.5.5 1.1.5 1.7-.6.1-1.3.4-1.7.8-.8-.5-1.9-.8-3.1-.7-6.2 0-9.8 4.2-9.8 8.1 0 .4 0 .8.1 1.2 1.4.7 3.3 1.1 5.4 1.1 6.5 0 11.5-3.6 12.3-8.8.1-.5.1-1.1.1-1.6 0-.3-.2-.5-.4-.6zm-17.8.2h2.2v2.2H5.7v-2.2zm0-3h2.2v2.2H5.7V8.4zm3.2 3h2.2v2.2H8.9v-2.2zm0-3h2.2v2.2H8.9V8.4zm3.2 3h2.2v2.2h-2.2v-2.2zm0-3h2.2v2.2h-2.2V8.4zm3.2 3h2.2v2.2h-2.2v-2.2zm0-3h2.2v2.2h-2.2V8.4zm0-3h2.2v2.2h-2.2V5.4z" />
        </svg>
      );
    }

    // WebSockets
    if (normalized.includes('websocket')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#EC4899" fillOpacity="0.25" />
        </svg>
      );
    }

    // Google Chat / Google 1P API / Workspace
    if (normalized.includes('google') || normalized.includes('chat')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#00AC47" fillOpacity="0.15" />
          <path d="M12 4a8 8 0 00-8 8c0 2.2.9 4.2 2.3 5.7L5 20l3.5-1.2A7.9 7.9 0 0012 20a8 8 0 100-16z" fill="#00AC47" />
          <circle cx="9" cy="12" r="1.2" fill="#FFFFFF" />
          <circle cx="12" cy="12" r="1.2" fill="#FFFFFF" />
          <circle cx="15" cy="12" r="1.2" fill="#FFFFFF" />
        </svg>
      );
    }

    // Git
    if (normalized === 'git') {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#F05032">
          <path d="M21.6 10.9L13.1 2.4a1.8 1.8 0 00-2.6 0L8.1 4.8l3.3 3.3a2.1 2.1 0 012.7 2.7l3.2 3.2a2.1 2.1 0 11-1.3 1.3l-3-3v4.6a2.1 2.1 0 11-1.8 0V12a2.1 2.1 0 01-1.2-1.2L6.8 7.6 2.4 12a1.8 1.8 0 000 2.6l8.5 8.5c.7.7 1.9.7 2.6 0l8.1-8.1a1.8 1.8 0 000-2.6z" />
        </svg>
      );
    }

    // GitHub
    if (normalized.includes('github')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );
    }

    // Vite
    if (normalized.includes('vite')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M21.5 4.5l-9.2 16.4a.8.8 0 01-1.4 0L1.7 4.5a.8.8 0 01.8-1.2l9.1 1.7a.8.8 0 00.4 0l8.7-1.7a.8.8 0 01.8 1.2z" fill="#BD34FE" />
          <path d="M14.5 2.5l-6 11 3.5-.5-2.5 6.5 7.5-12.5-3.5.5 1-5z" fill="#FFD62E" />
        </svg>
      );
    }

    // Linux CLI / Linux
    if (normalized.includes('linux')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
    }

    // Postman
    if (normalized.includes('postman')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#FF6C37">
          <circle cx="12" cy="12" r="10" fill="#FF6C37" />
          <path d="M6 12l4-4v3h5v2h-5v3z" fill="#FFFFFF" />
        </svg>
      );
    }

    // MongoDB
    if (normalized.includes('mongo')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="#47A248">
          <path d="M12 2C12 2 7 8 7 13.5c0 3.3 2.1 6.1 5 6.5v-18zm0 0c0 0 5 6 5 11.5 0 3.3-2.1 6.1-5 6.5v-18z" />
        </svg>
      );
    }

    // JWT
    if (normalized.includes('jwt')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#D63AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#D63AFF" fillOpacity="0.2" />
          <circle cx="12" cy="11" r="2.5" fill="#D63AFF" />
        </svg>
      );
    }

    // REST APIs
    if (normalized.includes('rest') || normalized.includes('api')) {
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="5" rx="2" />
          <rect x="2" y="14" width="20" height="5" rx="2" />
          <path d="M6 10v4M18 10v4" />
        </svg>
      );
    }

    // Fallback generic code icon
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  };

  const svgIcon = getSvg();

  if (!showContainer) {
    return svgIcon;
  }

  // Enhanced Icon Container with Gradient Rings and Smooth Scale Transitions
  return (
    <div className="relative group inline-flex items-center justify-center p-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 hover:border-indigo-500/50 hover:bg-zinc-800/90 hover:scale-110 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-indigo-500/30 group-hover:via-purple-500/20 group-hover:to-cyan-500/30 rounded-xl blur-xs transition-all duration-300 -z-10" />
      {svgIcon}
    </div>
  );
}

// Dedicated TechBadge wrapper for interactive skill pills with gradient rings & scale effects
export function TechBadge({ name, className = "", showLabel = true }: TechBadgeProps) {
  return (
    <div className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 hover:border-indigo-500/40 hover:bg-zinc-800/80 hover:scale-105 transition-all duration-200 hover:shadow-md hover:shadow-indigo-500/10 cursor-pointer ${className}`}>
      {/* Dynamic Ambient Gradient Ring Overlay on Hover */}
      <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-indigo-500/40 group-hover:via-purple-500/30 group-hover:to-cyan-500/40 rounded-xl blur-[2px] transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none -z-10" />
      
      <TechIcon name={name} className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform duration-200" />
      {showLabel && (
        <span className="text-xs font-mono font-medium text-zinc-300 group-hover:text-white transition-colors">
          {name}
        </span>
      )}
    </div>
  );
}
