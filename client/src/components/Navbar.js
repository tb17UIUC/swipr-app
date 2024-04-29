import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="bg-primary p-4 w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {/* Logo wrapped in button to make it clickable and navigate to home */}
                    <button onClick={() => navigate('/')}>
                        <img
                            src={require('../assets/main-logo.png')}
                            alt="Logo"
                            className="h-8 mr-4"
                        />
                    </button>
                </div>
                <div className="flex items-center">
                    {/* Navbar links */}
                    <button
                        className="bg-white text-primary font-semibold py-2 px-4 rounded-lg shadow ml-4"
                        onClick={() => navigate('/reviews')}                 
                    >
                        Reviews
                    </button>
                    <button
                        className="bg-white text-primary font-semibold py-2 px-4 rounded-lg shadow ml-4"
                        onClick={() => navigate('/clothes')}
                    >
                        Explore Styles
                    </button>
                    <button
                        className="bg-white text-primary font-semibold py-2 px-4 rounded-lg shadow ml-4"
                        onClick={() => navigate('/profile')}
                    >
                        Profile
                    </button>
                </div>
            </div>
        </nav>
    );
}
