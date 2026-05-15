import React, { useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import DashboardScreen from './src/screens/DashboardScreen';

type Screen = 'login' | 'loading' | 'dashboard';

const App = () => {
  const [screen, setScreen] = useState<Screen>('login');

  const handleLoginSubmit = () => setScreen('loading');
  const handleLoadingDone = () => setScreen('dashboard');

  if (screen === 'login') {
    return <LoginScreen onSubmit={handleLoginSubmit} />;
  }
  if (screen === 'loading') {
    return <LoadingScreen onDone={handleLoadingDone} />;
  }
  return <DashboardScreen />;
};

export default App;
