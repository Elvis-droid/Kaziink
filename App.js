import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { SEED_JOBS } from './src/data';
import LandingScreen        from './src/screens/LandingScreen';
import AuthScreen           from './src/screens/AuthScreen';
import WorkerProfileScreen  from './src/screens/WorkerProfileScreen';
import WorkerFeedScreen     from './src/screens/WorkerFeedScreen';
import WorkerJobScreen      from './src/screens/WorkerJobScreen';
import EmployerProfileScreen from './src/screens/EmployerProfileScreen';
import EmployerDashScreen   from './src/screens/EmployerDashScreen';

export default function App() {
  // ── Navigation ──────────────────────────────────────────────────────────────
  const [screen,  setScreen]  = useState('landing');
  const [uType,   setUType]   = useState(null);

  // ── User State ───────────────────────────────────────────────────────────────
  const [user,      setUser]      = useState(null);
  const [workers,   setWorkers]   = useState([]);
  const [employers, setEmployers] = useState([]);

  // ── App Data ─────────────────────────────────────────────────────────────────
  const [jobs,   setJobs]   = useState(SEED_JOBS);
  const [apps,   setApps]   = useState([]);
  const [msgs,   setMsgs]   = useState([]);
  const [selJob, setSelJob] = useState(null);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const go   = (s) => setScreen(s);
  const ping = (msg) => setMsgs(p => [...p, { id: Date.now(), text: msg, at: new Date().toLocaleTimeString() }]);

  // ── Shared props ─────────────────────────────────────────────────────────────
  const p = { go, uType, setUType, user, setUser, workers, setWorkers, employers, setEmployers, jobs, setJobs, apps, setApps, ping, selJob, setSelJob, msgs };

  // ── Screen Router ─────────────────────────────────────────────────────────────
  const render = () => {
    switch (screen) {
      case 'landing':         return <LandingScreen        {...p} />;
      case 'auth':            return <AuthScreen           {...p} />;
      case 'worker-profile':  return <WorkerProfileScreen  {...p} />;
      case 'worker-feed':     return <WorkerFeedScreen     {...p} />;
      case 'worker-job':      return <WorkerJobScreen      {...p} />;
      case 'emp-profile':     return <EmployerProfileScreen {...p} />;
      case 'emp-dash':        return <EmployerDashScreen   {...p} />;
      default:                return <LandingScreen        {...p} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {render()}
    </SafeAreaProvider>
  );
}
