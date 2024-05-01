import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

export default function Navbar() {
    const navigate = useNavigate();
    const { setUser } = useUser(); // Get the setUser function from context to update user state

    const handleLogout = () => {
        setUser({ customerId: null });
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav className="bg-primary p-4 w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
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
                    {/* Logout button */}
                    <button
                        className="bg-white text-primary font-semibold py-2 px-4 rounded-lg shadow ml-4"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
