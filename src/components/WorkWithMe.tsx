'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Briefcase, Users, ShieldCheck, GraduationCap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function WorkWithMe() {
  const secRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(secRef.current?.querySelector('.sec-hd')?.children || [], {
      scrollTrigger: { trigger: secRef.current?.querySelector('.sec-hd'), start: 'top 88%' },
      y: 26, opacity: 0, stagger: 0.09, duration: 0.7, ease: 'power3.out'
    });

    gsap.utils.toArray<HTMLElement>('.collab-card').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 89%' },
        y: 38, opacity: 0, duration: 0.7, delay: (i % 2) * 0.1, ease: 'power3.out'
      });
    });
  }, { scope: secRef });

  return (
    <section id="work-with-me" ref={secRef}>
      <div className="sec-hd"><span className="sec-num">05</span><h2 className="sec-title">Work With Me</h2><div className="sec-rule"></div></div>
      <div className="collab-grid">
        <div className="collab-card"><span className="cc-icon"><Briefcase size={26} /></span><div className="cc-title">Freelance Projects</div><p className="cc-desc">Need a web app, mobile app, or full product built? I take on freelance projects with a focus on clean architecture, great UX, and on-time delivery.</p><a href="#contact" className="cc-cta">Let&apos;s talk →</a></div>
        <div className="collab-card"><span className="cc-icon"><Users size={26} /></span><div className="cc-title">Team Collaboration</div><p className="cc-desc">Open to joining startups or open-source projects. Always excited to work with talented teams building meaningful products.</p><a href="#contact" className="cc-cta">Join forces →</a></div>
        <div className="collab-card"><span className="cc-icon"><ShieldCheck size={26} /></span><div className="cc-title">Security Consulting</div><p className="cc-desc">Leveraging Cybersecurity studies at ESOFT, I can help audit your web or mobile app for vulnerabilities and provide actionable fixes.</p><a href="#contact" className="cc-cta">Get an audit →</a></div>
        <div className="collab-card"><span className="cc-icon"><GraduationCap size={26} /></span><div className="cc-title">Mentorship</div><p className="cc-desc">Fellow SLIIT or ESOFT student? Happy to pair-program, review code, or share resources. Let&apos;s grow in the Sri Lanka dev community.</p><a href="#contact" className="cc-cta">Connect →</a></div>
      </div>
    </section>
  );
}