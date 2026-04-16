'use client';
import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { PROJECTS, ProjectType } from '@/data/projects';

gsap.registerPlugin(ScrollTrigger);

export default function Projects({ onOpenDetail }: { onOpenDetail: (p: ProjectType) => void }) {
  const [filter, setFilter] = useState('all');
  const secRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>('.sec-hd').forEach((hd) => {
      gsap.from(hd.children, {
        scrollTrigger: { trigger: hd, start: 'top 88%' },
        y: 26, opacity: 0, stagger: 0.09, duration: 0.7, ease: 'power3.out'
      });
    });

    gsap.utils.toArray<HTMLElement>('.project-card').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 89%' },
        y: 38, opacity: 0, duration: 0.7, delay: (i % 3) * 0.09, ease: 'power3.out'
      });
    });
  }, { scope: secRef });

  const handleFilter = (f: string) => {
    setFilter(f);
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.project-card') as NodeListOf<HTMLButtonElement>;
    cards.forEach((card) => {
      const match = f === 'all' || card.dataset.cat === f;
      gsap.to(card, { opacity: match ? 1 : 0.13, scale: match ? 1 : 0.975, duration: 0.3, ease: 'power2.out' });
      card.style.pointerEvents = match ? 'auto' : 'none';
    });
  };

  const mobileProjects = PROJECTS.filter(p => p.cat === 'mobile');
  const webProjects = PROJECTS.filter(p => p.cat !== 'mobile' && p.cat !== 'python');
  const pythonProjects = PROJECTS.filter(p => p.cat === 'python');

  return (
    <div ref={secRef}>
      <section id="mobile-projects" style={{ paddingBottom: '20px' }}>
        <div className="sec-hd"><span className="sec-num">03</span><h2 className="sec-title" style={{ fontSize: 'clamp(20px, 2.5vw, 36px)' }}>Projects (Mobile)</h2><div className="sec-rule"></div></div>
        <div className="projects-grid">
          {mobileProjects.map((p) => (
            <button 
              key={p.id} 
              className="project-card" 
              style={{ borderColor: '#c084fc' }} 
              onClick={() => onOpenDetail(p)}
              onTouchStart={() => {}}
            >
              <div className="pc-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div className="pc-tags" style={{ marginBottom: 0 }}>{p.tags.map((t, i) => <span key={i} className="pc-tag">{t}</span>)}</div>
                  <span className="pc-plat" style={{ position: 'static', margin: 0 }}>{p.plat}</span>
                </div>
                <div className="pc-name">{p.name}</div>
                <p className="pc-desc">{p.short}</p>
                <div className="pc-tech">{p.tech.slice(0, 4).map((t, i) => <span key={i} className="pc-pill">{t}</span>)}</div>
              </div>
              <div className="pc-arrow">↗</div>
            </button>
          ))}
        </div>
      </section>

      <section id="projects" style={{ paddingTop: '120px' }}>
        <div className="sec-hd"><span className="sec-num">04</span><h2 className="sec-title" style={{ fontSize: 'clamp(20px, 2.5vw, 36px)' }}>Projects (Web)</h2></div>

        <div className="projects-grid" ref={gridRef}>
          {webProjects.map((p) => (
            <button 
              key={p.id} 
              className="project-card" 
              data-cat={p.cat} 
              onClick={() => onOpenDetail(p)}
              onTouchStart={() => {}}
            >
              <div className="pc-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div className="pc-tags" style={{ marginBottom: 0 }}>{p.tags.map((t, i) => <span key={i} className="pc-tag">{t}</span>)}</div>
                  <span className="pc-plat" style={{ position: 'static', margin: 0 }}>{p.plat}</span>
                </div>
                <div className="pc-name">{p.name}</div>
                <p className="pc-desc">{p.short}</p>
                <div className="pc-tech">{p.tech.slice(0, 4).map((t, i) => <span key={i} className="pc-pill">{t}</span>)}</div>
              </div>
              <div className="pc-arrow">↗</div>
            </button>
          ))}
        </div>
      </section>

      <section id="python-projects" style={{ paddingTop: '40px' }}>
        <div className="sec-hd"><span className="sec-num">05</span><h2 className="sec-title" style={{ fontSize: 'clamp(20px, 2.5vw, 36px)' }}>Projects (Python)</h2><div className="sec-rule"></div></div>
        <div className="projects-grid">
          {pythonProjects.map((p) => (
            <button 
              key={p.id} 
              className="project-card" 
              style={{ borderColor: '#EAB308' }} 
              onClick={() => onOpenDetail(p)}
              onTouchStart={() => {}}
            >
              <div className="pc-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div className="pc-tags" style={{ marginBottom: 0 }}>{p.tags.map((t, i) => <span key={i} className="pc-tag">{t}</span>)}</div>
                  <span className="pc-plat" style={{ position: 'static', margin: 0 }}>{p.plat}</span>
                </div>
                <div className="pc-name">{p.name}</div>
                <p className="pc-desc">{p.short}</p>
                <div className="pc-tech">{p.tech.slice(0, 4).map((t, i) => <span key={i} className="pc-pill">{t}</span>)}</div>
              </div>
              <div className="pc-arrow">↗</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}