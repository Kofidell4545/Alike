import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useWalletConnection } from '../hooks/useWalletConnection';

const HeroSection = () => {
  const { isConnected, handleConnection } = useWalletConnection();
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Mental Health Journey, <span>Private & Secure</span>
          </h1>
          <p className="hero-subtitle">
            Get professional help for addiction, mental health, and nutrition challenges while maintaining complete anonymity and data privacy.
          </p>
          <div className="hero-actions">
            <Button 
              color="primary"
              size="lg" 
              className="hero-btn primary"
              onClick={handleConnection}
            >
              <Icon icon="lucide:shield" className="btn-icon" />
              {isConnected ? 'Connected' : 'Start Anonymously'}
            </Button>
            <Button variant="flat" size="lg" className="hero-btn secondary">
              <Icon icon="lucide:info" className="btn-icon" />
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
