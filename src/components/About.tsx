'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const secRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(secRef.current?.querySelector('.sec-hd')?.children || [], {
      scrollTrigger: { trigger: secRef.current?.querySelector('.sec-hd'), start: 'top 88%' },
      y: 26, opacity: 0, stagger: 0.09, duration: 0.7, ease: 'power3.out'
    });

    gsap.from('.about-bio', {
      scrollTrigger: { trigger: '.about-bio', start: 'top 89%' },
      y: 40, opacity: 0, duration: 0.9, ease: 'power3.out'
    });

    gsap.utils.toArray<HTMLElement>('.edu-card').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 89%' },
        y: 38, opacity: 0, duration: 0.7, delay: (i % 2) * 0.14, ease: 'power3.out'
      });
    });
  }, { scope: secRef });

  return (
    <section id="about" ref={secRef}>
      <div className="sec-hd"><span className="sec-num">01</span><h2 className="sec-title">About</h2><div className="sec-rule"></div></div>
      <div className="about-layout">
        <div className="about-side">Who I Am</div>
        <div>
          <p className="about-bio">I am <strong>Harith Divarathna</strong>, a <em>Fullstack Software Engineer</em> passionate about crafting end-to-end digital products — scalable web apps, native Android &amp; iOS apps, and seamless cross-platform experiences. <em>Currently pursuing two degrees in parallel: Software Engineering at SLIIT and Cybersecurity at ESOFT Metro Campus.</em></p>
          <div className="edu-row">
            <div className="edu-card">
              <span className="edu-sch">Core Service</span>
              <span className="edu-deg">Software Engineering</span>
              <span className="edu-st">Design, develop, maintain, test, and evaluate</span>
            </div>
            <div className="edu-card">
              <span className="edu-sch">Specialization</span>
              <span className="edu-deg">Full-Stack Developing</span>
              <span className="edu-st">Java Spring, .NET, PHP, MERN, Python, Django, Ruby</span>
            </div>
            <div className="edu-card">
              <span className="edu-sch">Creative</span>
              <span className="edu-deg">Web Designing</span>
              <span className="edu-st">General, Interactive, e-commerce, event & mission critical</span>
            </div>
            <div className="edu-card">
              <span className="edu-sch">Security</span>
              <span className="edu-deg">Cyber Security</span>
              <span className="edu-st">Security analysis, White-hat hacking, Incident investigation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}