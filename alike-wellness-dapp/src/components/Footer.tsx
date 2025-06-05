import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { text: 'How It Works', href: '#how-it-works' },
      { text: 'Our Experts', href: '#our-experts' },
      { text: 'Community', href: '#community' },
      { text: 'Privacy', href: '#privacy' }
    ],
    resources: [
      { text: 'FAQ', href: '/faq' },
      { text: 'Blog', href: '/blog' },
      { text: 'Support', href: '/support' },
      { text: 'Documentation', href: '/docs' }
    ],
    legal: [
      { text: 'Terms of Service', href: '/terms' },
      { text: 'Privacy Policy', href: '/privacy-policy' },
      { text: 'Cookie Policy', href: '/cookies' },
      { text: 'Compliance', href: '/compliance' }
    ]
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <Icon icon="lucide:activity" className="logo-icon" />
              <span>Alike</span>
            </Link>
            <p className="footer-description">
              Privacy-focused mental health and wellness platform built on
              blockchain technology.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3>Platform</h3>
              <ul>
                {footerLinks.platform.map((link) => (
                  <li key={link.text}>
                    <a href={link.href}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h3>Resources</h3>
              <ul>
                {footerLinks.resources.map((link) => (
                  <li key={link.text}>
                    <Link to={link.href}>{link.text}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h3>Legal</h3>
              <ul>
                {footerLinks.legal.map((link) => (
                  <li key={link.text}>
                    <Link to={link.href}>{link.text}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} Alike. All rights reserved.</p>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Icon icon="lucide:twitter" className="social-icon" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Icon icon="lucide:github" className="social-icon" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Icon icon="lucide:linkedin" className="social-icon" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
