'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const contactRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from('.contact-h span', {
      scrollTrigger: { trigger: '.contact-h', start: 'top 82%' },
      y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: 'power4.out'
    });
    
    gsap.from('.contact-btns .c-btn', {
      scrollTrigger: { trigger: '.contact-btns', start: 'top 88%' },
      y: 20, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out'
    });
  }, { scope: contactRef });

  return (
    <section id="contact" ref={contactRef}>
      <div className="contact-eye">Open to projects · collaborations · full-time roles</div>
      <h2 className="contact-h"><span className="ln1">LET&apos;S BUILD</span><br /><span className="ln2">TOGETHER.</span></h2>
      <div className="contact-btns">
        <a href="mailto:yourname@email.com" className="c-btn p">Email Me</a>
        <a href="https://github.com/" className="c-btn" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://linkedin.com/" className="c-btn" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="#" className="c-btn">Download CV</a>
      </div>
    </section>
  );
}