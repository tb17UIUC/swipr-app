import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import ClothesScreen from './components/ClothesScreen';
import LoginScreen from './components/LoginScreen';
import RegistrationScreen from './components/RegistrationScreen';
import { UserProvider } from './UserContext';
import ProfileScreen from './components/ProfileScreen';

export default function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<WelcomeScreen />} />
                    <Route path="/clothes" element={<ClothesScreen />} />
                    <Route path="/register" element={<RegistrationScreen />} />
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/profile" element={<ProfileScreen />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}
