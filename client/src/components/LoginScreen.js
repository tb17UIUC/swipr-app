import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginCustomer } from '../api/Customers';
import { useUser } from '../UserContext';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrectLogin, setIncorrectLogin] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleLogin = async () => {
        const customerData = {
            email: email,
            password: password,
        };

        console.log(customerData);

        try {
            const customerId = await loginCustomer(customerData);
            if (customerId) {
                setUser({ customerId });
                if (customerId === 2514) {
                    // 2514 = Admin Id
                    navigate('/admin');
                } else {
                    navigate('/clothes');
                }
            } else {
                setIncorrectLogin(true);
            }
        } catch (error) {
            console.error('Login failed:', error);
            setIncorrectLogin(true);
        }
    };

    return (
        <div
            className="flex items-center justify-center h-screen"
            style={{
                backgroundImage: `url(${require('../assets/welcome-page-bg.png')})`,
            }}
        >
            <div className="p-12 bg-primary rounded-lg shadow-xl text-center">
                <h1 className="text-white text-4xl font-bold">SIGN IN</h1>
                {incorrectLogin && (
                    <p className="text-red-500 text-lg">
                        Incorrect email or password
                    </p>
                )}
                <div className="mt-8">
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full p-2 mb-4 text-lg rounded-md shadow-md"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full p-2 mb-4 text-lg rounded-md shadow-md"
                    />
                    <button
                        onClick={handleLogin}
                        className="bg-white text-primary font-semibold py-2 px-4 rounded-lg shadow"
                    >
                        Sign In
                    </button>
                </div>
                <p className="text-white text-lg mt-4">
                    Don't have an account?{' '}
                    <span
                        onClick={handleRegisterClick}
                        className="underline cursor-pointer"
                    >
                        Click here
                    </span>{' '}
                    to register
                </p>
            </div>
        </div>
    );
}
