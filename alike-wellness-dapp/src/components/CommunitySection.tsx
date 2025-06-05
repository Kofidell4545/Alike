import { Icon } from '@iconify/react';

const CommunitySection = () => {
  const features = [
    {
      text: "Moderated discussions for safety",
      icon: "lucide:shield-check"
    },
    {
      text: "Topic-specific channels",
      icon: "lucide:layout-grid"
    },
    {
      text: "Professional guidance",
      icon: "lucide:award"
    },
    {
      text: "Complete anonymity",
      icon: "lucide:user-x"
    }
  ];

  return (
    <section id="community" className="community-section">
      <div className="container">
        <h2 className="section-title">Join Our Community</h2>
        <p className="section-subtitle">
          Connect with others on similar journeys while maintaining your privacy.
        </p>

        <div className="community-content">
          <div className="community-image">
            <img src="/src/assets/images/support.webp" alt="Support Without Judgment" />
          </div>
          
          <div className="community-features">
            <h3>Support Without Judgment</h3>
            <p>
              Our anonymous forum allows you to share experiences, ask questions, 
              and offer support without revealing your identity.
            </p>
            
            <ul className="feature-list">
              {features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <Icon icon={feature.icon} className="feature-icon" />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>

            <button className="join-btn">
              Join the Community
              <Icon icon="lucide:arrow-right" className="btn-icon" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
