import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Load the user from local storage when the provider mounts
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : { customerId: null };
    });

    useEffect(() => {
        // Persist user changes to local storage when the user state changes
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
