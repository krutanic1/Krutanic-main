import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import MedProFormPage from './MedProFormPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<MedProFormPage />} />
      </Routes>
    </Router>
  );
};

export default App;
