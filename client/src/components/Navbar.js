import React from 'react';

export default function Navbar() {
    return (
        <nav className="bg-lime-400 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {/* Logo */}
                    <img
                        src={require('../assets/main-logo.png')}
                        alt="Logo"
                        className="h-8 mr-4"
                    />
                </div>
                <div className="flex items-center">
                    {/* Navbar links */}
                    {/* Add your navbar links here */}
                </div>
            </div>
        </nav>
    );
}
