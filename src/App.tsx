import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-stone-50">
                    <Navbar />
                    <Home />
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/shop"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-stone-50">
                    <Navbar />
                    <Shop />
                  </div>
                </PrivateRoute>
              }
            />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;