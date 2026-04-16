'use client';
import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const btnRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(navRef.current, { y: -48, opacity: 0, duration: 0.8, ease: 'power3.out' });
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.setAttribute('data-theme', nextDark ? 'dark' : 'light');
    if (btnRef.current) {
      gsap.fromTo(btnRef.current, { scale: 0.6 }, { scale: 1, duration: 0.35, ease: 'back.out(2.5)' });
    }
  };

  return (
    <nav id="nav" ref={navRef}>
      <a href="#" className="nav-logo">HD<span>.</span></a>
      <div className="nav-links">
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#products">Products</a>
        <a href="#work-with-me">Collaborate</a>
      </div>
      <div className="nav-right">
        <button 
          ref={btnRef} 
          className="theme-btn" 
          onClick={toggleTheme} 
          onTouchStart={() => {}} 
          title="Toggle theme"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <a href="#contact" className="nav-cta">Hire Me</a>
      </div>
    </nav>
  );
}
