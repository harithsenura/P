'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Moon, Sun, Play, RotateCcw } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

/* ── Code lines for the typing animation ── */
const CODE_LINES = [
  { indent: 0, text: 'const developer = {', color: 'keyword' },
  { indent: 1, text: 'name: "Harith Divarathna",', color: 'string' },
  { indent: 1, text: 'role: "Full Stack Developer",', color: 'string' },
  { indent: 1, text: 'stack: ["Next.js", "React Native",', color: 'string' },
  { indent: 2, text: '"Node.js", "MongoDB"],', color: 'string' },
  { indent: 1, text: 'passion: "Building scalable apps",', color: 'string' },
  { indent: 0, text: '};', color: 'keyword' },
  { indent: 0, text: '', color: 'default' },
  { indent: 0, text: 'async function buildProject() {', color: 'func' },
  { indent: 1, text: 'const idea = await brainstorm();', color: 'default' },
  { indent: 1, text: 'const design = createUI(idea);', color: 'default' },
  { indent: 1, text: 'const backend = setupAPI(design);', color: 'default' },
  { indent: 1, text: 'return deploy(design, backend);', color: 'keyword' },
  { indent: 0, text: '}', color: 'keyword' },
  { indent: 0, text: '', color: 'default' },
  { indent: 0, text: 'buildProject().then(result => {', color: 'func' },
  { indent: 1, text: 'console.log("🚀 Shipped!");', color: 'string' },
  { indent: 0, text: '});', color: 'keyword' },
];

export default function Hero() {
  const [isDark, setIsDark] = useState(true);
  const [codeState, setCodeState] = useState<'typing' | 'done' | 'showing'>('typing');
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const typingInterval = useRef<ReturnType<typeof setTimeout> | null>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-nav', { y: -20, duration: 0.8 }, '+=0.2')
      .from('.hero-badge', { y: -20, opacity: 0, duration: 0.6 }, '-=0.4')
      .from('.hero-eyebrow', { y: 24, opacity: 0, duration: 0.6 }, '-=0.35')
      .from('.hero-name-small', { y: 16, opacity: 0, duration: 0.5 }, '-=0.3')
      .from('.hero-line .inner', { y: '115%', stagger: 0.13, duration: 1.1, ease: 'power4.out' }, '-=0.25')
      .from('.hero-sub', { y: 16, opacity: 0, duration: 0.6 }, '-=0.5')
      .from('.hero-desc', { y: 16, opacity: 0, duration: 0.6 }, '-=0.5')
      .from('.hero-editor-wrap', { y: 30, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.3')
      .from('.hero-scroll', { y: 16, opacity: 0, duration: 0.5 }, '-=0.5');

    gsap.to('.hero-grid', {
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      y: 110, opacity: 0
    });
  }, { scope: heroRef });

  /* ── Typing animation ── */
  useEffect(() => {
    if (codeState !== 'typing') return;

    const fullText = CODE_LINES[visibleLines]
      ? '  '.repeat(CODE_LINES[visibleLines].indent) + CODE_LINES[visibleLines].text
      : '';

    if (visibleLines >= CODE_LINES.length) {
      setCodeState('done');
      return;
    }

    if (currentChar < fullText.length) {
      typingInterval.current = setTimeout(() => {
        setCurrentChar(prev => prev + 1);
      }, 18 + Math.random() * 28);
    } else {
      typingInterval.current = setTimeout(() => {
        setVisibleLines(prev => prev + 1);
        setCurrentChar(0);
      }, 80);
    }

    return () => {
      if (typingInterval.current) clearTimeout(typingInterval.current);
    };
  }, [codeState, visibleLines, currentChar]);

  /* ── Run button handler ── */
  const handleRun = useCallback(() => {
    if (codeState === 'showing') {
      // Reset back to code
      setCodeState('typing');
      setVisibleLines(0);
      setCurrentChar(0);

      const tl = gsap.timeline();
      tl.to(imagesRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          if (imagesRef.current) imagesRef.current.style.display = 'none';
          if (editorRef.current) {
            editorRef.current.style.display = 'block';
            gsap.fromTo(editorRef.current,
              { opacity: 0, scale: 0.95 },
              { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
            );
          }
        }
      });
      return;
    }

    // Stop typing
    if (typingInterval.current) clearTimeout(typingInterval.current);
    setCodeState('showing');

    const tl = gsap.timeline();
    tl.to(editorRef.current, {
      opacity: 0,
      scale: 0.97,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        if (editorRef.current) editorRef.current.style.display = 'none';
        if (imagesRef.current) {
          imagesRef.current.style.display = 'grid';
          gsap.fromTo(imagesRef.current,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.2)' }
          );
          // Animate individual images
          gsap.fromTo('.showcase-img',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.15, duration: 0.5, ease: 'power2.out', delay: 0.2 }
          );
        }
      }
    });
  }, [codeState]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.setAttribute('data-theme', nextDark ? 'dark' : 'light');
    if (btnRef.current) {
      gsap.fromTo(btnRef.current, { scale: 0.6 }, { scale: 1, duration: 0.35, ease: 'back.out(2.5)' });
    }
  };

  /* ── Render code lines ── */
  const renderCodeLines = () => {
    return CODE_LINES.map((line, i) => {
      if (i > visibleLines) return null;

      const fullText = '  '.repeat(line.indent) + line.text;
      const displayText = i === visibleLines
        ? fullText.substring(0, currentChar)
        : fullText;
      const showCursor = i === visibleLines && codeState === 'typing';

      return (
        <div key={i} className="code-line">
          <span className="code-ln">{String(i + 1).padStart(2, ' ')}</span>
          <span className={`code-text code-${line.color}`}>
            {displayText}
            {showCursor && <span className="code-cursor">|</span>}
          </span>
        </div>
      );
    });
  };

  return (
    <section id="hero" ref={heroRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
      {/* Background elements first */}
      <div className="hero-grid"></div>
      <div className="hero-glow"></div>

      {/* Interactable/Top-level elements next */}
      <div className="hero-nav">
        <a href="#" className="nav-logo">HD<span>.</span></a>
        <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            ref={btnRef}
            className="theme-btn"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <a href="#contact" className="nav-cta">Hire Me</a>
        </div>
      </div>

      <div className="hero-badge">Available for work</div>

      <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <div className="hero-eyebrow">Fullstack Developer · Sri Lanka</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 className="hero-name-small">Harith Divarathna</h1>
          <div className="hero-name hero-name--inline">
            <span className="hero-line"><span className="inner">FULL STACK DEV.</span></span>
          </div>
        </div>

        {/* ── MacBook Editor Window ── */}
        <div className="hero-editor-wrap">
          <div className="mac-window">
            <div className="mac-titlebar">
              <div className="mac-dots">
                <span className="mac-dot mac-dot--red"></span>
                <span className="mac-dot mac-dot--yellow"></span>
                <span className="mac-dot mac-dot--green"></span>
              </div>
              <span className="mac-title">portfolio.ts — VS Code</span>
              <div className="mac-titlebar-spacer"></div>
            </div>
            <div className="mac-body">
              {/* Code Editor */}
              <div ref={editorRef} className="code-editor">
                <div className="code-sidebar">
                  <div className="code-sidebar-icon">📁</div>
                  <div className="code-sidebar-icon">🔍</div>
                  <div className="code-sidebar-icon">⚙️</div>
                </div>
                <div className="code-main">
                  <div className="code-tab-bar">
                    <span className="code-tab code-tab--active">portfolio.ts</span>
                    <span className="code-tab">styles.css</span>
                    <span className="code-tab">config.ts</span>
                  </div>
                  <div className="code-content">
                    {renderCodeLines()}
                  </div>
                </div>
              </div>

              {/* Showcase Images (hidden initially) */}
              <div ref={imagesRef} className="showcase-container" style={{ display: 'none' }}>
                <div className="showcase-img">
                  <Image src="/s1.png" alt="Craftora - Social Platform" width={600} height={400} />
                </div>
                <div className="showcase-img">
                  <Image src="/s2.png" alt="Craftora - Feed View" width={600} height={400} />
                </div>
              </div>
            </div>

            {/* Status bar with Run button */}
            <div className="mac-statusbar">
              <div className="mac-status-left">
                <span className="mac-status-item">TypeScript</span>
                <span className="mac-status-item">UTF-8</span>
              </div>
              <button className="run-btn" onClick={handleRun}>
                {codeState === 'showing' ? (
                  <>
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </>
                ) : (
                  <>
                    <Play size={12} />
                    <span>Run</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="hero-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.5rem' }}>
          <div className="hero-desc"><p>Building scalable products across web and mobile — from pixel-perfect frontends to native apps.</p></div>
          <div className="hero-scroll">Scroll</div>
        </div>
      </div>
    </section>
  );
}