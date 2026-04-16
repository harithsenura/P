'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Products() {
  const secRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(secRef.current?.querySelector('.sec-hd')?.children || [], {
      scrollTrigger: { trigger: secRef.current?.querySelector('.sec-hd'), start: 'top 88%' },
      y: 26, opacity: 0, stagger: 0.09, duration: 0.7, ease: 'power3.out'
    });

    gsap.utils.toArray<HTMLElement>('.prod-row').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 89%' },
        x: -28, opacity: 0, duration: 0.7, delay: i * 0.11, ease: 'power3.out'
      });
    });
  }, { scope: secRef });

  return (
    <section id="products" ref={secRef}>
      <div className="sec-hd"><span className="sec-num">04</span><h2 className="sec-title">Ongoing Products</h2><div className="sec-rule"></div></div>
      <div className="prod-list">
        <div className="prod-row"><span className="prod-n">001</span><div><div className="prod-name">BuildersHub</div><div className="prod-desc">A platform connecting freelance developers with clients — project bidding, real-time collaboration, and secure escrow payments.</div></div><div className="prod-status"><div className="s-dot"></div>In Development</div></div>
        <div className="prod-row"><span className="prod-n">002</span><div><div className="prod-name">EduTrack LMS</div><div className="prod-desc">Full-stack learning management system with video courses, progress tracking, quizzes, and certificate generation for Sri Lankan students.</div></div><div className="prod-status"><div className="s-dot"></div>In Development</div></div>
        <div className="prod-row"><span className="prod-n">003</span><div><div className="prod-name">SecureVault</div><div className="prod-desc">Cybersecurity-focused password manager and secure note app with end-to-end encryption and biometric authentication — born from Cybersecurity studies at ESOFT.</div></div><div className="prod-status"><div className="s-dot"></div>Beta Testing</div></div>
      </div>
    </section>
  );
}