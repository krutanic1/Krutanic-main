import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import MedProFormPage from './MedProFormPage';
import DataAnalystFormPage from './DataAnalystFormPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<MedProFormPage />} />
        <Route path="/DataAnalytics" element={<DataAnalystFormPage />} />
      </Routes>
    </Router>
  );
};
//gfofhpiwefhoie
export default App;
