import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import AuthPage from './pages/AuthPage';
import UserMenu from './components/UserMenu';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import ShippingHandling from './pages/ShippingHandling';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div>
        {isAuthenticated && <UserMenu user={user} onLogout={handleLogout} />}
        <Routes>
          {/* Updated Route Logic */}
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate replace to="/auth" />} />
          <Route
            path="/auth"
            element={!isAuthenticated ? (
              <AuthPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            ) : (
              <Navigate replace to="/" />
            )}
          />
          <Route path="/products" element={isAuthenticated ? <ProductList /> : <Navigate replace to="/auth" />} />
          <Route path="/products/:id" element={isAuthenticated ? <ProductDetail /> : <Navigate replace to="/auth" />} />
          <Route path="/shipping" element={isAuthenticated ? <ShippingHandling /> : <Navigate replace to="/auth" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate replace to="/auth" />} />
          <Route path="/contact" element={isAuthenticated ? <Contact /> : <Navigate replace to="/auth" />} />
          <Route path="/inventory" element={isAuthenticated ? <Inventory /> : <Navigate replace to="/auth" />} />
          <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate replace to="/auth" />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;