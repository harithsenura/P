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

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchGithubContributions('harithsenura', 2026).then(res => {
      setData(res);
      setLoading(false);
      // Auto-scroll to the rightmost (latest data) on mobile
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
      }, 300);
    });
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.from('.gh-title', {
      scrollTrigger: { trigger: containerRef.current, start: 'top 85%' },
      y: 20, opacity: 0, duration: 0.7, ease: 'power3.out'
    });

    gsap.from('.gh-card', {
      scrollTrigger: { trigger: '.gh-card', start: 'top 85%' },
      y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.1
    });

    const observer = new MutationObserver((mutations) => {
      const rects = containerRef.current?.querySelectorAll('rect');
      if (rects && rects.length > 0) {
        gsap.fromTo(rects, 
          { opacity: 0, scale: 0.2 },
          { 
            opacity: 1, 
            scale: 1, 
            stagger: 0.0015, 
            duration: 0.4, 
            ease: 'back.out(2)',
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
    <section id="github-contributions" style={{ padding: '20px 0 100px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }} ref={containerRef}>
      <style>{`
        .gh-scroll-container::-webkit-scrollbar { display: none; }
        .gh-scroll-container { 
          -ms-overflow-style: none; 
          scrollbar-width: none; 
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
      
      {/* Sleek eyebrow title */}
      <div className="gh-title" style={{
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        fontSize: '12px', 
        fontWeight: 600,
        textTransform: 'uppercase', 
        letterSpacing: '2px', 
        color: '#8b949e', 
        marginBottom: '32px',
        fontFamily: 'var(--font-inter), sans-serif'
      }}>
        <div style={{
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          backgroundColor: '#39d353', 
          boxShadow: '0 0 12px #39d353'
        }}></div>
        GitHub Activity
      </div>
      
      {/* Clean wrapper with responsive horizontal scroll */}
      <div className="gh-card" style={{
        width: '100%',
        maxWidth: '1000px',
        position: 'relative'
      }}>
        <div 
          className="gh-scroll-container"
          ref={scrollRef}
          style={{
            overflowX: 'auto',
            width: '100%',
            display: 'flex',
            padding: '0 20px',
          }}
        >
          <div style={{ minWidth: '750px', margin: '0 auto' }}>
            {loading ? (
              <div style={{ color: '#8b949e', fontFamily: 'var(--font-inter)', padding: '20px', fontSize: '13px', textAlign: 'center' }}>Loading real-time data...</div>
            ) : data.length === 0 ? (
              <div style={{ color: '#8b949e', fontFamily: 'var(--font-inter)', padding: '20px', fontSize: '13px', textAlign: 'center' }}>Unable to load contributions data.</div>
            ) : (
              <ActivityCalendar 
                data={data}
                colorScheme="dark"
                blockSize={13}
                blockMargin={4}
                fontSize={12}
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
      </div>
    </section>
  );
}
