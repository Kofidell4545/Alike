import { Icon } from '@iconify/react';

interface Expert {
  name: string;
  title: string;
  description: string;
  image: string;
  rating: number;
}

const ExpertsSection = () => {
  const experts: Expert[] = [
    {
      name: "Dr. Sarah Chen",
      title: "Clinical Psychologist",
      description: "Specializes in addiction recovery and cognitive behavioral therapy with 10+ years of experience.",
      image: "/images/experts/sarah.jpg",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      title: "Addiction Counselor",
      description: "Former addict turned counselor with a compassionate approach to substance abuse recovery.",
      image: "/images/experts/michael.jpg",
      rating: 4.5
    },
    {
      name: "Emma Thompson",
      title: "Nutritionist",
      description: "Holistic nutritionist specializing in eating disorders and balanced nutrition for mental health.",
      image: "/images/experts/emma.jpg",
      rating: 5
    }
  ];

  const renderRating = (rating: number) => {
    return (
      <div className="expert-rating">
        {[...Array(5)].map((_, index) => (
          <Icon 
            key={index}
            icon="lucide:star"
            className={`star-icon ${index < rating ? 'filled' : 'empty'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <section id="our-experts" className="experts-section">
      <div className="container">
        <h2 className="section-title">Meet Our Experts</h2>
        <p className="section-subtitle">
          Our verified professionals are ready to support you on your wellness journey.
        </p>
        
        <div className="experts-grid">
          {experts.map((expert) => (
            <div key={expert.name} className="expert-card">
              <div className="expert-image-container">
                <img src={expert.image} alt={expert.name} className="expert-image" />
              </div>
              <div className="expert-info">
                <h3 className="expert-name">{expert.name}</h3>
                <p className="expert-title">{expert.title}</p>
                <p className="expert-description">{expert.description}</p>
                {renderRating(expert.rating)}
              </div>
            </div>
          ))}
        </div>

        <div className="experts-cta">
          <button className="explore-btn">
            Explore All Experts
            <Icon icon="lucide:arrow-right" className="btn-icon" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExpertsSection;
