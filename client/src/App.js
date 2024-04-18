import './App.css';
import React from 'react';
import clothes from './test_data/test_clothes'; // Assuming the path to your clothes data
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import ClothesScreen from './components/ClothesScreen';
import Navbar from './components/Navbar';

export default function App() {
    return (
        <Router>
            <Navbar /> {/* This will place the Navbar on every page */}
            <Routes>
                <Route path="/" element={<WelcomeScreen />} />
                <Route
                    path="/clothes"
                    element={
                        <ClothesScreen clothingItemList={clothes} userId={1} />
                    }
                />
            </Routes>
        </Router>
    );
}
