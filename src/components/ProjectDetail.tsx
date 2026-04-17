'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ProjectType } from '@/data/projects';

interface ProjectDetailProps {
  project: ProjectType | null;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (project && overlayRef.current) {
      overlayRef.current.style.display = 'block';
      overlayRef.current.style.pointerEvents = 'auto';
      document.body.style.overflow = 'hidden';
      if(overlayRef.current) overlayRef.current.scrollTop = 0;
      
      const tl = gsap.timeline();
      tl.fromTo(overlayRef.current, { x: '100%' }, { x: '0%', duration: 0.55, ease: 'power3.out' });
      tl.fromTo('.pd-main > div', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.09, duration: 0.6, ease: 'power3.out' }, 0.22);
      tl.fromTo('.pd-info',       { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.5, ease: 'power3.out' }, 0.28);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const handleClose = () => {
    if (!overlayRef.current) return;
    gsap.to(overlayRef.current, {
      x: '100%', duration: 0.42, ease: 'power3.in',
      onComplete: () => {
        if(overlayRef.current) {
          overlayRef.current.style.display = 'none';
          overlayRef.current.style.pointerEvents = 'none';
        }
        document.body.style.overflow = '';
        onClose();
      }
    });
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && project) handleClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [project]);

  return (
    <div id="projectDetail" ref={overlayRef} style={{ display: 'none' }}>
      <div className="pd-topbar">
        <button className="pd-back" onClick={handleClose}>← Back to Projects</button>
        <span className="pd-bar-title">{project?.name}</span>
        <span className="pd-esc-hint">ESC to close</span>
      </div>
      
      {project && (
        <>
          <div className="pd-body" style={{ paddingTop: '40px' }}>
            <div className="pd-main">
              <div style={{ marginBottom: '12px' }}>
                <h1 className="pd-title">{project.name}</h1>
                <p style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: '13px', color: 'var(--text-2)' }}>{project.tagline}</p>
              </div>

              {/* Mobile Links - Shown only on mobile */}
              <div className="pd-info pd-mobile-links">
                <div className="pd-links">
                  <a href={project.links.live} className="pd-lnk pri" target="_blank" rel="noreferrer">Live Demo ↗</a>
                  <a href={project.links.github} className="pd-lnk" target="_blank" rel="noreferrer">GitHub →</a>
                </div>
              </div>

              <div><div className="pd-sec-lbl">Overview</div><p className="pd-overview" id="pdDesc">{project.desc}</p></div>
              <div><div className="pd-sec-lbl">Screenshots</div><div className="pd-gal-grid" id="pdGallery">
                {project.gallery.map(img => <div key={img} className="pd-gal-box"><img className="pd-gal-img" src={img} alt="" loading="lazy" /></div>)}
              </div></div>
              <div><div className="pd-sec-lbl">Key Features</div><ul className="pd-feats" id="pdFeats">
                {project.features.map(f => <li key={f}>{f}</li>)}
              </ul></div>
            </div>
            
            <div className="pd-sidebar">
              <div className="pd-info"><span className="pd-info-lbl">Tech Stack</span><div className="pd-tech-row" id="pdTech">
                {project.tech.map(t => <span key={t} className="pd-tpill">{t}</span>)}
              </div></div>
              <div className="pd-info"><span className="pd-info-lbl">Category</span><span className="pd-cat-val" id="pdCat">{project.plat}</span></div>
              <div className="pd-info pd-desktop-links"><span className="pd-info-lbl">Links</span><div className="pd-links" id="pdLinks">
                <a href={project.links.live} className="pd-lnk pri" target="_blank" rel="noreferrer">Live Demo ↗</a>
                <a href={project.links.github} className="pd-lnk" target="_blank" rel="noreferrer">GitHub →</a>
              </div></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}