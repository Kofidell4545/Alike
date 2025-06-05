import { Link } from 'react-router-dom';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useWalletConnection } from '../hooks/useWalletConnection';

const Navbar = () => {
  const { isConnected, handleConnection } = useWalletConnection();
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="logo-icon">A</div>
          <span className="logo-text">Alike</span>
        </div>
        
        <ul className="nav-links">
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#our-experts">Our Experts</a></li>
          <li><a href="#community">Community</a></li>
          <li><a href="#privacy">Privacy</a></li>
        </ul>
        
        <div className="nav-actions">
          <Link to="/dashboard">
            <Button variant="flat" className="dashboard-btn">
              Dashboard
            </Button>
          </Link>
          <Button 
            color="primary" 
            className="start-btn"
            onClick={handleConnection}
          >
            <Icon icon="lucide:shield" className="btn-icon" />
            {isConnected ? 'Connected' : 'Start Anonymously'}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
