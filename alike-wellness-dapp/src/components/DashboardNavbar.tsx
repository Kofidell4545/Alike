import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useWalletConnection } from '../hooks/useWalletConnection';

const DashboardNavbar = () => {
  const { isConnected, handleConnection } = useWalletConnection();
  return (
    <nav className="dashboard-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="logo-icon">
            <Icon icon="lucide:activity" />
          </div>
          <span className="logo-text">Alike</span>
        </Link>

        <div className="nav-center">
          <Link to="/dashboard" className="nav-item active">
            <Icon icon="lucide:layout-grid" />
            Dashboard
          </Link>
          <Link to="/forum" className="nav-item">
            <Icon icon="lucide:message-circle" />
            Forum
          </Link>
          <Link to="/profile" className="nav-item">
            <Icon icon="lucide:user" />
            Profile
          </Link>
        </div>

        <button className="connect-wallet-btn" onClick={handleConnection}>
          <Icon icon="lucide:wallet" className="wallet-icon" />
          {isConnected ? 'Connected' : 'Connect Wallet'}
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
