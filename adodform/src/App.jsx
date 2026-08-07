import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import MedProFormPage from './MedProFormPage';
import DataAnalystFormPage from './DataAnalystFormPage';
import AvgFormPage from './AvgFormPage';
import WarrFormPage from './WarrFormPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<MedProFormPage />} />
        <Route path="/DataAnalytics" element={<DataAnalystFormPage />} />
        <Route path="/avg" element={<AvgFormPage />} />
        <Route path="/warr" element={<WarrFormPage />} />
      </Routes>
    </Router>
  );
};
//gfofhpiwefhoie
export default App;
