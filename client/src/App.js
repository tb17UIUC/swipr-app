import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import ClothesScreen from './components/ClothesScreen';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomeScreen />} />
                <Route path="/clothes" element={<ClothesScreen userId={1} />} />
            </Routes>
        </Router>
    );
}
