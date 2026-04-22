'use client';
import { useState } from 'react';
import CustomCursor from '@/components/CustomCursor';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import About from '@/components/About';
import Projects from '@/components/Projects';

import WorkWithMe from '@/components/WorkWithMe';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ProjectDetail from '@/components/ProjectDetail';
import { ProjectType } from '@/data/projects';

export default function Home() {
  const [activeProject, setActiveProject] = useState<ProjectType | null>(null);

  return (
    <>
      <CustomCursor />
      <Hero />
      <Ticker />
      <About />
      <Projects onOpenDetail={setActiveProject} />

      <WorkWithMe />
      <Contact />
      <Footer />
      {activeProject && <ProjectDetail project={activeProject} onClose={() => setActiveProject(null)} />}
    </>
  );
}