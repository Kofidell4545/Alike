import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Forum from './pages/Forum';
import Profile from './pages/Profile';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import ExpertsSection from './components/ExpertsSection';
import CommunitySection from './components/CommunitySection';
import PrivacySection from './components/PrivacySection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import './App.css';
import './styles/pages/Dashboard.css';
import './styles/pages/Forum.css';
import './styles/pages/Profile.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app">
            <Navbar />
            <main>
              <HeroSection />
              <HowItWorks />
              <ExpertsSection />
              <CommunitySection />
              <PrivacySection />
              <CTASection />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
