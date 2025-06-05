const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Connect Anonymously",
      description: "Connect your wallet to access the platform without revealing your personal identity."
    },
    {
      number: "2",
      title: "Choose Your Support",
      description: "Browse professionals across addiction, mental health, and nutrition categories."
    },
    {
      number: "3",
      title: "Start Your Journey",
      description: "Book encrypted sessions and pay with cryptocurrency for complete privacy."
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          Getting help is simple, private, and secure with our three-step process.
        </p>
        
        <div className="steps-container">
          {steps.map((step) => (
            <div key={step.number} className="step-card">
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
