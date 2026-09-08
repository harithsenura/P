'use client';
import React from 'react';
import GitHubCalendar from 'react-github-calendar';

export default function GithubContributions() {
  return (
    <section id="github-contributions" style={{ padding: '40px 0 80px 0' }}>
      <div className="sec-hd">
        <span className="sec-num">05</span>
        <h2 className="sec-title" style={{ fontSize: 'clamp(20px, 2.5vw, 36px)' }}>GitHub Contributions</h2>
        <div className="sec-rule"></div>
      </div>
      
      <div style={{
        marginTop: '32px',
        backgroundColor: '#0f0f11',
        padding: '30px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        overflowX: 'auto',
      }}>
        <div style={{ minWidth: '800px', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <GitHubCalendar 
            username="harithsenura" 
            colorScheme="dark"
            blockSize={14}
            blockMargin={5}
            fontSize={14}
            theme={{
              dark: ['#1a1a1c', '#0e4429', '#006d32', '#26a641', '#39d353'],
            }}
          />
        </div>
      </div>
    </section>
  );
}
