import { Icon } from '@iconify/react';

const PrivacySection = () => {
  const features = [
    {
      icon: "lucide:lock",
      title: "End-to-End Encryption",
      description: "All your conversations and data are encrypted, ensuring only you and your therapist can access them."
    },
    {
      icon: "lucide:user-circle",
      title: "Anonymous Identity",
      description: "Connect with a wallet and maintain complete anonymity throughout your wellness journey."
    },
    {
      icon: "lucide:database",
      title: "Decentralized Storage",
      description: "Your data is stored on a decentralized network, eliminating central points of failure or access."
    }
  ];

  return (
    <section id="privacy" className="privacy-section">
      <div className="container">
        <h2 className="section-title">Why Privacy Matters</h2>
        <p className="section-subtitle">
          Alike is built on Oasis Sapphire, a privacy-focused blockchain that ensures your data
          remains confidential and secure.
        </p>

        <div className="privacy-features">
          {features.map((feature, index) => (
            <div key={index} className="privacy-card">
              <div className="privacy-icon-wrapper">
                <Icon icon={feature.icon} className="privacy-icon" />
              </div>
              <h3 className="privacy-feature-title">{feature.title}</h3>
              <p className="privacy-feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;
