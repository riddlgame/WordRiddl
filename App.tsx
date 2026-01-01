
import React, { useState, useEffect, useCallback } from 'react';
import { GamePage } from './pages/GamePage';
import { AdminPage } from './pages/AdminPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { authService } from './services/authService';

type View = 'game' | 'admin_login' | 'admin_dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<View>('game');

  useEffect(() => {
    // Check if user is already logged in as admin
    if (authService.isAdmin()) {
      setView('admin_dashboard');
    }
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setView('admin_dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    authService.logout();
    setView('game');
  }, []);

  const navigateToAdmin = useCallback(() => {
    setView('admin_login');
  }, []);

  const navigateToGame = useCallback(() => {
    setView('game');
  }, []);

  const renderView = () => {
    switch (view) {
      case 'admin_login':
        return <AdminLoginPage onLoginSuccess={handleLoginSuccess} onBack={navigateToGame} />;
      case 'admin_dashboard':
        return <AdminPage onLogout={handleLogout} />;
      case 'game':
      default:
        return <GamePage onNavigateToAdmin={navigateToAdmin} />;
    }
  };

  return <div className="h-screen w-screen bg-slate-900 text-white font-sans">{renderView()}</div>;
};

export default App;
