'use client';
import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Monitor, Smartphone, Layout, Database, Terminal, Settings } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const [activeTab, setActiveTab] = useState<'web' | 'mob'>('web');
  const secRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(secRef.current?.querySelector('.sec-hd')?.children || [], {
      scrollTrigger: { trigger: secRef.current?.querySelector('.sec-hd'), start: 'top 88%' },
      y: 26, opacity: 0, stagger: 0.09, duration: 0.7, ease: 'power3.out'
    });

    gsap.utils.toArray<HTMLElement>('.skill-card').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 89%' },
        y: 38, opacity: 0, duration: 0.7, delay: (i % 4) * 0.07, ease: 'power3.out'
      });
    });
  }, { scope: secRef });

  const handleTabClick = (tab: 'web' | 'mob') => {
    setActiveTab(tab);
    if (panelRef.current) {
      gsap.fromTo(panelRef.current.querySelectorAll('.skill-card'), 
        { y: 24, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.5, ease: 'power3.out' }
      );
    }
  };

  return (
    <section id="skills" ref={secRef}>
      <div className="sec-hd"><span className="sec-num">02</span><h2 className="sec-title">Skills</h2><div className="sec-rule"></div></div>
      <div className="tab-row">
        <button className={`tab-btn ${activeTab === 'web' ? 'active' : ''}`} onClick={() => handleTabClick('web')}>
          <Monitor size={13} />Web Development
        </button>
        <button className={`tab-btn ${activeTab === 'mob' ? 'active' : ''}`} onClick={() => handleTabClick('mob')}>
          <Smartphone size={13} />Mobile Development
        </button>
      </div>
      
      <div ref={panelRef}>
        {activeTab === 'web' && (
          <div className="tab-panel active" id="tab-web">
            <div className="skills-grid">
              <div className="skill-card">
                <div className="skill-top"><div className="skill-icon"><Layout size={14} /></div><span className="skill-nm">Frontend</span></div>
                <ul className="skill-list"><li>React</li><li>Next.js</li><li>TypeScript</li><li>Tailwind CSS</li><li>JavaScript</li><li>HTML / CSS</li></ul>
              </div>
              <div className="skill-card">
                <div className="skill-top"><div className="skill-icon"><Terminal size={14} /></div><span className="skill-nm">Backend</span></div>
                <ul className="skill-list"><li>Node.js</li><li>Python</li><li>PHP</li><li>Express</li><li>Django</li><li>REST APIs</li></ul>
              </div>
              <div className="skill-card">
                <div className="skill-top"><div className="skill-icon"><Database size={14} /></div><span className="skill-nm">Database</span></div>
                <ul className="skill-list"><li>MongoDB</li><li>PostgreSQL</li><li>MySQL / SQL</li><li>Firebase</li><li>Supabase</li><li>Redis</li></ul>
              </div>
              <div className="skill-card">
                <div className="skill-top"><div className="skill-icon"><Settings size={14} /></div><span className="skill-nm">DevOps</span></div>
                <ul className="skill-list"><li>Docker</li><li>Git / GitHub</li><li>CI/CD</li><li>AWS</li><li>Vercel</li><li>Linux</li></ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mob' && (
          <div className="tab-panel active" id="tab-mob">
            <div className="skills-grid">
              <div className="skill-card">
                <div className="skill-top"><div className="skill-icon">◻</div><span className="skill-nm">Android</span></div>
                <ul className="skill-list"><li>Kotlin</li><li>Java</li><li>Jetpack Compose</li><li>Android SDK</li><li>Firebase</li><li>Room Database</li></ul>
              </div>
              <div className="skill-card">
                <div className="skill-top"><div className="skill-icon">◎</div><span className="skill-nm">iOS</span></div>
                <ul className="skill-list"><li>Swift</li><li>SwiftUI</li><li>UIKit</li><li>Core Data</li><li>XCode</li><li>TestFlight</li></ul>
              </div>
              <div className="skill-card">
                <div className="skill-top"><div className="skill-icon">⊕</div><span className="skill-nm">Cross-Platform</span></div>
                <ul className="skill-list"><li>React Native</li><li>Expo</li><li>TypeScript</li><li>Firebase</li><li>Redux</li><li>React Navigation</li></ul>
              </div>
              <div className="skill-card">
                <div className="skill-top"><div className="skill-icon">◈</div><span className="skill-nm">Mobile UI/UX</span></div>
                <ul className="skill-list"><li>Figma</li><li>Material Design</li><li>iOS Design</li><li>Prototyping</li><li>Animation</li><li>Accessibility</li></ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}