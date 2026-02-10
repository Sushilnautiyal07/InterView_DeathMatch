import {
  useUser
} from '@clerk/clerk-react';

import { Navigate, Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import Problemspage from './pages/Problemspage';
import { Toaster } from 'react-hot-toast';

function App() {

  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/problems"
          element={
            isSignedIn
              ? <Problemspage />
              : <Navigate to="/" replace />
          }
        />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
