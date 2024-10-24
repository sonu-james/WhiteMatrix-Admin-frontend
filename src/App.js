import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTOp';
import Dashboard from './components/dashboard';
import AdminSignIn from './components/AdminSignIn';





function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  return (
    <ScrollToTop>
      <Routes>
        <Route path="/" element={<AdminSignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />  
     


      </Routes>
    </ScrollToTop>
  );
}

export default App;