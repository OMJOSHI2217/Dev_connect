import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/Toast';

// Modals
import { PublicProfileModal } from './components/common/PublicProfileModal';
import { ConnectedProfileModal } from './components/common/ConnectedProfileModal';
import { SendRequestModal } from './components/common/SendRequestModal';
import { ProjectCreateModal } from './components/common/ProjectCreateModal';
import { ProjectApplyModal } from './components/common/ProjectApplyModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { RepositoriesPage } from './pages/RepositoriesPage';
import { RepositoryDetailPage } from './pages/RepositoryDetailPage';
import { ProjectHistoryPage } from './pages/ProjectHistoryPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';

const AppContent: React.FC = () => {
  const { currentView, isAuthenticated } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication & Public Flow pages
  const isAuthView = ['login', 'register', 'verify_otp', 'forgot_password', 'reset_password'].includes(currentView);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'login':
      case 'register':
      case 'verify_otp':
      case 'forgot_password':
      case 'reset_password':
        return <AuthPage />;
      case 'onboarding':
        return <OnboardingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'discovery':
        return <DiscoveryPage />;
      case 'connections':
        return <ConnectionsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'repositories':
        return <RepositoriesPage />;
      case 'repository_detail':
        return <RepositoryDetailPage />;
      case 'project_history':
        return <ProjectHistoryPage />;
      case 'profile_settings':
        return <ProfileSettingsPage />;
      default:
        return <LandingPage />;
    }
  };

  // Full-width pages without sidebar: landing, auth flows, onboarding
  if (currentView === 'landing' || isAuthView || currentView === 'onboarding') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Navbar
          mobileMenuOpen={mobileMenuOpen}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <main className="flex-1">
          {renderCurrentView()}
        </main>
        {currentView === 'landing' && <Footer />}

        {/* Global Modals */}
        <PublicProfileModal />
        <ConnectedProfileModal />
        <SendRequestModal />
        <ProjectCreateModal />
        <ProjectApplyModal />
        <ToastContainer />
      </div>
    );
  }

  // Authenticated workspace with sidebar layout
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <div className="flex-1 flex w-full">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 w-full">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Modals */}
      <PublicProfileModal />
      <ConnectedProfileModal />
      <SendRequestModal />
      <ProjectCreateModal />
      <ProjectApplyModal />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
