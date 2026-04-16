export default function Schema() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Harith Divarathna',
    alternateName: ['Harith Divarathna'],
    url: 'https://harithdivarathna.com',
    jobTitle: 'Fullstack Software Engineer',
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'Sri Lanka Institute of Information Technology (SLIIT)',
      },
      {
        '@type': 'CollegeOrUniversity',
        name: 'ESOFT Metro Campus',
      }
    ],
    knowsAbout: ['Software Engineering', 'Fullstack Development', 'React Native', 'Next.js', 'Cybersecurity', 'GSAP Animations'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Colombo',
      addressCountry: 'Sri Lanka',
    },
    sameAs: [
      'https://github.com/harithsenura', // Assuming from previous logs
      // Add other social links here if available
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
