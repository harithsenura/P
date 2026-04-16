'use client';
import { useState } from 'react';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Products from '@/components/Products';
import WorkWithMe from '@/components/WorkWithMe';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ProjectDetail from '@/components/ProjectDetail';
import { ProjectType } from '@/data/projects';

export default function Home() {
  const [activeProject, setActiveProject] = useState<ProjectType | null>(null);

  return (
    <>

      <Navbar />
      <Hero />
      <Ticker />
      <About />
      <Skills />
      <Projects onOpenDetail={setActiveProject} />
      <Products />
      <WorkWithMe />
      <Contact />
      <Footer />
      {activeProject && <ProjectDetail project={activeProject} onClose={() => setActiveProject(null)} />}
    </>
  );
}