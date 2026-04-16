'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Ticker() {
  const tickerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(tickerRef.current, {
      scrollTrigger: { trigger: tickerRef.current, start: 'top 92%' },
      opacity: 0,
      duration: 0.7
    });
  }, []);

  const items = [
    'React', 'Next.js', 'TypeScript', 'Swift', 'Kotlin', 'Java', 'React Native', 'Python',
    'Node.js', 'PHP', 'MongoDB', 'Firebase', 'PostgreSQL', 'Supabase', 'Docker', 'AWS'
  ];

  return (
    <div className="ticker-wrap" ref={tickerRef}>
      <div className="ticker">
        {items.map((item, i) => (
          <span key={i} className="ticker-item">{item}<span className="s"> · </span></span>
        ))}
        {items.map((item, i) => (
          <span key={'dup'+i} className="ticker-item">{item}<span className="s"> · </span></span>
        ))}
      </div>
    </div>
  );
}