import React from 'react';
import '../components/NewLandingPage.css';

const NewLandingPage = () => {
  return (
    <div className="landing-page">
      <header className="hero-section">
        <h1>Understand Your Lease in Minutes</h1>
        <p>Our AI-powered platform analyzes your lease, identifies risks, and empowers you to negotiate with confidence.</p>
        <div className="cta-buttons">
          <button className="primary-button">Get Started</button>
          <button className="secondary-button">Watch Demo</button>
        </div>
      </header>
      {/* Other sections will be added here */}
    </div>
  );
};

export default NewLandingPage;


