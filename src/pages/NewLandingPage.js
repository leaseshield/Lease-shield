import React from 'react';
import '../components/NewLandingPage.css';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';

const NewLandingPage = () => {
  const optimizedTitle = 'Lease Shield AI: Fast Lease Review & Legal Analysis';
  const optimizedDescription = 'Instantly analyze your lease, detect legal risks, and negotiate better terms using AI tools from Lease Shield.';

  return (
    <>
      <Helmet>
        <title>{optimizedTitle}</title>
        <meta name="description" content={optimizedDescription} />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://leaseshield.eu/" />
        <meta property="og:title" content={optimizedTitle} />
        <meta property="og:description" content={optimizedDescription} />
        <meta property="og:image" content="%PUBLIC_URL%/LeaseShield_OG_Image.png" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://leaseshield.eu/" />
        <meta name="twitter:title" content={optimizedTitle} />
        <meta name="twitter:description" content={optimizedDescription} />
        <meta name="twitter:image" content="%PUBLIC_URL%/LeaseShield_Twitter_Card.png" />
        {/* JSON-LD Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Lease Analysis Service",
            "provider": {
              "@type": "Organization",
              "name": "Lease Shield AI"
            },
            "serviceType": "Lease Review and Analysis",
            "url": "https://leaseshield.eu/"
          })}
        </script>
      </Helmet>
      <div className="landing-page">
        <header className="hero-section">
          <h1>Understand Your Lease in Minutes</h1>
          <p>
            Our AI-powered platform analyzes your lease, identifies risks, and empowers you to negotiate with confidence. Learn more about our{' '}
            <RouterLink to="/pricing">pricing plans</RouterLink>, read our{' '}
            <RouterLink to="/blog">insights blog</RouterLink>, or start a{' '}
            <RouterLink to="/trial">free trial</RouterLink> today. For comprehensive tenant rights information, visit the{' '}
            <a href="https://www.hud.gov/program_offices/fair_housing_equal_opp" target="_blank" rel="noopener noreferrer">U.S. HUD Fair Housing</a>.
          </p>
          <div className="cta-buttons">
            <RouterLink className="primary-button" to="/register">
              Get Started
            </RouterLink>
            <RouterLink className="secondary-button" to="/demo">
              Watch Demo
            </RouterLink>
          </div>
        </header>
        {/* Other sections will be added here */}
      </div>
    </>
  );
};

export default NewLandingPage;


