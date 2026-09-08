'use client';
import React, { useEffect, useRef } from 'react';
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

  const handleAppStoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const btn = e.currentTarget;
    if (btn.textContent === 'Coming Soon...') return;
    
    gsap.to(btn, { 
      opacity: 0, 
      y: -2,
      duration: 0.2, 
      onComplete: () => {
        btn.textContent = 'Coming Soon...';
        gsap.to(btn, { opacity: 1, y: 0, duration: 0.2 });
        setTimeout(() => {
          gsap.to(btn, { 
            opacity: 0, 
            y: 2,
            duration: 0.2, 
            onComplete: () => {
              btn.textContent = 'Download on App Store';
              gsap.to(btn, { opacity: 1, y: 0, duration: 0.2 });
            }
          });
        }, 2000);
      }
    });
  };

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
                  {project.id === 'self' ? (
                    <a href="#" className="pd-lnk pri" onClick={handleAppStoreClick}>Download on App Store</a>
                  ) : (
                    <>
                      {project.links.live !== '#' && (
                        <a href={project.links.live} className="pd-lnk pri" target="_blank" rel="noreferrer">Live Demo ↗</a>
                      )}
                      <a 
                        href={project.links.github} 
                        className={`pd-lnk ${project.links.live === '#' ? 'pri' : ''}`} 
                        target="_blank" 
                        rel="noreferrer"
                      >
                        GitHub →
                      </a>
                    </>
                  )}
                </div>
              </div>

              <div><div className="pd-sec-lbl">Overview</div><div className="pd-overview" id="pdDesc" dangerouslySetInnerHTML={{ __html: project.desc }} /></div>

              {project.video && (
                <div className="video-container" style={{ position: 'relative', margin: '32px auto 40px auto', width: 'fit-content', maxWidth: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#000', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                  {/* Modern floating macOS Top Bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', zIndex: 10, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)', pointerEvents: 'none' }}>
                    <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56', boxShadow: '0 0 10px rgba(255,95,86,0.3)' }} />
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e', boxShadow: '0 0 10px rgba(255,189,46,0.3)' }} />
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f', boxShadow: '0 0 10px rgba(39,201,63,0.3)' }} />
                    </div>
                    {/* Fullscreen Icon */}
                    <button 
                      onClick={(e) => {
                        const videoWrap = e.currentTarget.closest('.video-container');
                        const video = videoWrap?.querySelector('video') as any;
                        
                        if (videoWrap && videoWrap.requestFullscreen) {
                          videoWrap.requestFullscreen();
                        } else if (video) {
                          if (video.requestFullscreen) {
                            video.requestFullscreen();
                          } else if (video.webkitEnterFullscreen) {
                            video.webkitEnterFullscreen();
                          } else if (video.mozRequestFullScreen) {
                            video.mozRequestFullScreen();
                          } else if (video.msRequestFullscreen) {
                            video.msRequestFullscreen();
                          }
                        }
                      }}
                      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', padding: '6px', pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                      title="Fullscreen"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                      </svg>
                    </button>
                  </div>
                  {/* Video */}
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    style={{ display: 'block', width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }}
                  >
                    <source src={project.video} type="video/mp4" />
                  </video>
                </div>
              )}
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
                {project.id === 'self' ? (
                  <a href="#" className="pd-lnk pri" onClick={handleAppStoreClick}>Download on App Store</a>
                ) : (
                  <>
                    {project.links.live !== '#' && (
                      <a href={project.links.live} className="pd-lnk pri" target="_blank" rel="noreferrer">Live Demo ↗</a>
                    )}
                    <a 
                      href={project.links.github} 
                      className={`pd-lnk ${project.links.live === '#' ? 'pri' : ''}`} 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      GitHub →
                    </a>
                  </>
                )}
              </div></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}