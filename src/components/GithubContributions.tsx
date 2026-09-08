'use client';
import React, { useRef, useEffect, useState } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { fetchGithubContributions, Activity } from '@/lib/github';

gsap.registerPlugin(ScrollTrigger);

export default function GithubContributions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGithubContributions('harithsenura', 2026).then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.from(containerRef.current.querySelector('.sec-hd')?.children || [], {
      scrollTrigger: { trigger: containerRef.current, start: 'top 85%' },
      y: 20, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out'
    });

    gsap.from('.gh-card', {
      scrollTrigger: { trigger: '.gh-card', start: 'top 85%' },
      y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'
    });

    const observer = new MutationObserver((mutations) => {
      const rects = containerRef.current?.querySelectorAll('rect');
      if (rects && rects.length > 0) {
        gsap.fromTo(rects, 
          { opacity: 0, scale: 0.5 },
          { 
            opacity: 1, 
            scale: 1, 
            stagger: 0.002, 
            duration: 0.3, 
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: '.gh-card',
              start: 'top 85%'
            }
          }
        );
        observer.disconnect();
      }
    });

    observer.observe(containerRef.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, { scope: containerRef });

  return (
    <section id="github-contributions" style={{ padding: '40px 0 80px 0' }} ref={containerRef}>
      <div className="sec-hd">
        <span className="sec-num">05</span>
        <h2 className="sec-title" style={{ fontSize: 'clamp(20px, 2.5vw, 36px)' }}>GitHub Contributions</h2>
        <div className="sec-rule"></div>
      </div>
      
      <div className="gh-card" style={{
        marginTop: '32px',
        backgroundColor: '#0f0f11',
        padding: '40px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'center',
        overflowX: 'auto',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(38,166,65,0.08) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}></div>

        <div style={{ minWidth: '800px', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
          {loading ? (
            <div style={{ color: '#8b949e', fontFamily: 'var(--font-inter)', padding: '40px' }}>Loading real-time data...</div>
          ) : data.length === 0 ? (
            <div style={{ color: '#8b949e', fontFamily: 'var(--font-inter)', padding: '40px' }}>Unable to load contributions data.</div>
          ) : (
            <ActivityCalendar 
              data={data}
              colorScheme="dark"
              blockSize={15}
              blockMargin={5}
              fontSize={14}
              theme={{
                dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
              }}
              style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 500,
                color: '#8b949e'
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
