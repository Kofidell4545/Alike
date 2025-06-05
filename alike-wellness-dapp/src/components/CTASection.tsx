import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <h2 className="cta-title">Ready to Start Your Wellness Journey?</h2>
        <p className="cta-subtitle">
          Take the first step toward better mental health with complete privacy and security.
        </p>
        <Button color="default" size="lg" className="cta-button">
          <Icon icon="lucide:shield" className="btn-icon" />
          Start Anonymously
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
