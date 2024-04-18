import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeScreen() {
    let navigate = useNavigate(); // Hook for navigation

    function handleClick() {
        navigate('/clothes'); // Navigate to ClothesScreen
    }

    return (
        <div
            className="flex items-center justify-center h-screen"
            style={{
                backgroundImage: `url(${require('../assets/welcome-page-bg.png')})`,
            }}
        >
            <div className="p-12 bg-primary rounded-lg shadow-xl text-center">
                <h1 className="text-white text-4xl font-bold">
                    Welcome to Swipr!
                </h1>
                <button
                    onClick={handleClick}
                    className="mt-8 bg-white text-primary font-semibold py-2 px-4 rounded-lg shadow"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
}
