import { Icon } from '@iconify/react';
import DashboardNavbar from '../components/DashboardNavbar';

const Profile = () => {
  const userStats = {
    memberSince: 'Oct 2023',
    sessionsCompleted: 3,
    forumPosts: 5,
    walletId: '0x71...8a92'
  };

  return (
    <div className="profile">
      <DashboardNavbar />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Your Profile</h1>
          <p>Manage your sessions, saved content, and privacy settings.</p>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-card">
              <div className="avatar">
                <span>Ano</span>
              </div>
              <h2 className="username">Anonymous User</h2>
              <div className="wallet-badge">
                <Icon icon="lucide:wallet" />
                <span>{userStats.walletId}</span>
                <div className="verified-badge">
                  <Icon icon="lucide:check" />
                  Verified Wallet
                </div>
              </div>

              <div className="user-stats">
                <div className="stat-item">
                  <span className="stat-label">Member since</span>
                  <span className="stat-value">{userStats.memberSince}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Sessions completed</span>
                  <span className="stat-value">{userStats.sessionsCompleted}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Forum posts</span>
                  <span className="stat-value">{userStats.forumPosts}</span>
                </div>
              </div>

              <button className="delete-account">
                Delete Account Data
              </button>
            </div>
          </div>

          <div className="profile-main">
            <div className="profile-tabs">
              <button className="tab-btn active">
                <Icon icon="lucide:calendar" />
                Sessions
              </button>
              <button className="tab-btn">
                <Icon icon="lucide:bookmark" />
                Saved
              </button>
              <button className="tab-btn">
                <Icon icon="lucide:settings" />
                Settings
              </button>
            </div>

            <div className="sessions-section">
              <div className="section-header">
                <h2>Your Sessions</h2>
                <button className="book-session-btn">
                  <Icon icon="lucide:plus" />
                  Book New Session
                </button>
              </div>

              <div className="upcoming-sessions">
                <h3>Upcoming Sessions</h3>
                <div className="empty-sessions">
                  <Icon icon="lucide:calendar" className="empty-icon" />
                  <h4>No upcoming sessions</h4>
                  <p>You don't have any scheduled sessions. Book a session with one of our professionals.</p>
                  <button className="book-btn">
                    <Icon icon="lucide:calendar" />
                    Book a Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
