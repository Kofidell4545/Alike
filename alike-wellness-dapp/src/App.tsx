import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useAlikeUser } from './hooks/useAlikeUser';


import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wallet';
import './App.css';
import './styles/pages/Dashboard.css';
import './styles/pages/Forum.css';
import './styles/pages/Profile.css';

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

const queryClient = new QueryClient();

function AppContent() {
  const { isConnected } = useAccount();
  const { isRegistered, registerUser } = useAlikeUser();

  useEffect(() => {
    if (isConnected && !isRegistered) {
      registerUser().catch(console.error);
    }
  }, [isConnected, isRegistered, registerUser]);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={(
            <>
              <main>
                <HeroSection />
                <HowItWorks />
                <ExpertsSection />
                <CommunitySection />
                <PrivacySection />
                <CTASection />
              </main>
              <Footer />
            </>
          )} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>

    </Router>
  );
}

function App() {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
