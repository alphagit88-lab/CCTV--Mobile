import React, { useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import DashboardScreen from './src/screens/DashboardScreen';

import ProjectScreen from './src/screens/ProjectScreen';
import CameraDetailScreen from './src/screens/CameraDetailScreen';

type Screen = 'login' | 'loading' | 'dashboard' | 'project' | 'camera_detail';

const App = () => {
  const [screen, setScreen] = useState<Screen>('login');
  const [selectedCamera, setSelectedCamera] = useState<any>(null);

  const handleLoginSubmit = () => setScreen('loading');
  const handleLoadingDone = () => setScreen('dashboard');
  const handleOpenProject = () => setScreen('project');
  const handleBackToDashboard = () => setScreen('dashboard');
  const handleOpenCamera = (camera: any) => {
    setSelectedCamera(camera);
    setScreen('camera_detail');
  };
  const handleBackToProject = () => setScreen('project');

  const handleNavigateTab = (tab: 'dashboard' | 'projects' | 'profile') => {
    if (tab === 'dashboard') setScreen('dashboard');
    if (tab === 'projects') setScreen('project');
  };

  if (screen === 'login') {
    return <LoginScreen onSubmit={handleLoginSubmit} />;
  }
  if (screen === 'loading') {
    return <LoadingScreen onDone={handleLoadingDone} />;
  }
  if (screen === 'project') {
    return (
      <ProjectScreen 
        onBack={handleBackToDashboard} 
        onNavigateTab={handleNavigateTab}
        onOpenCamera={handleOpenCamera}
      />
    );
  }
  if (screen === 'camera_detail') {
    return (
      <CameraDetailScreen 
        camera={selectedCamera} 
        onBack={handleBackToProject} 
        onNavigateTab={handleNavigateTab} 
      />
    );
  }
  return <DashboardScreen onOpenProject={handleOpenProject} />;
};

export default App;
