'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-badge', { y: -20, opacity: 0, duration: 0.6 }, '+=0.4')
      .from('.hero-eyebrow', { y: 24, opacity: 0, duration: 0.6 }, '-=0.35')
      .from('.hero-name-small', { y: 16, opacity: 0, duration: 0.5 }, '-=0.3')
      .from('.hero-line .inner', { y: '115%', stagger: 0.13, duration: 1.1, ease: 'power4.out' }, '-=0.25')
      .from('.hero-sub', { y: 16, opacity: 0, duration: 0.6 }, '-=0.5')
      .from('.hero-desc', { y: 16, opacity: 0, duration: 0.6 }, '-=0.5')
      .from('.hero-scroll', { y: 16, opacity: 0, duration: 0.5 }, '-=0.5');

    gsap.to('.hero-grid', {
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      y: 110, opacity: 0
    });
  }, { scope: heroRef });

  return (
    <section id="hero" ref={heroRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
      <div className="hero-grid"></div>
      <div className="hero-glow"></div>
      <div className="hero-badge">Available for work</div>
      <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <div className="hero-eyebrow">Fullstack Developer · Colombo, Sri Lanka</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="hero-name-small">Harith Divarathna</span>
          <h1 className="hero-name" style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}>
            <span className="hero-line"><span className="inner">FULL</span></span>
            <span className="hero-line ol"><span className="inner">STACK</span></span>
            <span className="hero-line"><span className="inner">DEV.</span></span>
          </h1>
        </div>
        <div className="hero-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.5rem' }}>
          <div className="hero-desc"><p>Building scalable products across web and mobile — from pixel-perfect frontends to native apps.</p></div>
          <div className="hero-scroll">Scroll</div>
        </div>
      </div>
    </section>
  );
}