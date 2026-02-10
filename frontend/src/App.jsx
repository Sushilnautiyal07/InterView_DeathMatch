import { useUser } from '@clerk/clerk-react';
import { Navigate, Routes, Route } from 'react-router';

import HomePage from './pages/HomePage';
import Problemspage from './pages/ProblemsPage';
import DashboardPage from './pages/DashboardPage';

import { Toaster } from 'react-hot-toast';

function App() {

  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <>
      <Routes>

        <Route
          path="/"
          element={!isSignedIn ? <HomePage /> : <Navigate to="/dashboard" />}
        />

        <Route
          path="/dashboard"
          element={isSignedIn ? <DashboardPage /> : <Navigate to="/" />}
        />

        <Route
          path="/problems"
          element={isSignedIn ? <Problemspage /> : <Navigate to="/" />}
        />

      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
