// src/App.jsx

import React from 'react';

// ⬅️ Change this import path and name
import AboutSection from './components/AboutSection/AboutSection'; 
import Services from './components/Services/Services'; 
import './App.css'; 

function App() {
  return (
    <main className="page-wrapper">
      
      {/* ⬅️ Change the component tag */}
      <AboutSection /> 
      
      <Services /> 
      
    </main>
  );
}

export default App;