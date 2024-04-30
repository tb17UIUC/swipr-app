import React, { useEffect, useState } from 'react';
import ReactImagePickerEditor from 'react-image-picker-editor';
import 'react-image-picker-editor/dist/index.css';
import { registerCustomer } from '../api/Customers';
import { getFilterInfo } from '../api/FilterInfo';
import Select from 'react-select';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';

export default function RegistrationScreen() {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [universityId, setUniversityId] = useState(null);
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);

    const config2 = {
        borderRadius: '8px',
        language: 'en',
        width: '100px',
        height: '100px',
        objectFit: 'contain',
        aspectRatio: 1,
        compressInitial: 10,
        hideDownloadBtn: true,
        hideAddBtn: true,
    };

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                setLoading(true);
                const data = await getFilterInfo();
                setUniversities(
                    data.universities?.map((uni) => ({
                        value: uni.University_Id,
                        label: uni.University_Name,
                    }))
                );
                setLoading(false);
            } catch (error) {
                console.error('Error fetching universities:', error);
                setLoading(false);
            }
        };

        fetchUniversities();
    }, []);

    const handleRegister = async () => {
        const customerData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            profilePicture: profilePicture,
            universityId: universityId,
        };

        const customerId = await registerCustomer(customerData);
        if (customerId) {
            setUser({ customerId });
            navigate('/clothes');
        }
    };

    const imageSaveHandler = (newDataUri) => {
        setProfilePicture(newDataUri);
        // console.log(newDataUri);
    };

    return (
        <div
            className="flex items-center justify-center h-screen"
            style={{
                backgroundImage: `url(${require('../assets/welcome-page-bg.png')})`,
            }}
        >
            <div className="p-10 bg-primary rounded-lg shadow-xl text-center">
                <h1 className="text-white text-4xl font-bold">
                    Create an Account
                </h1>
                <div className="mt-8">
                    <div className="mb-3">
                        <h2 className="text-white text-xl mb-2">
                            Upload a profile picture!
                        </h2>
                        <div className="mx-auto justify-center flex flex-row">
                            <ReactImagePickerEditor
                                config={config2}
                                imageChanged={imageSaveHandler}
                            />
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="block w-full p-2 mb-3 text-lg rounded-md shadow-md"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="block w-full p-2 mb-3 text-lg rounded-md shadow-md"
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full p-2 mb-3 text-lg rounded-md shadow-md"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full p-2 mb-3 text-lg rounded-md shadow-md"
                    />
                    {!loading && (
                        <div className="my-4">
                            <label className="text-white">
                                University (Optional)
                            </label>
                            <Select
                                options={universities}
                                onChange={(selectedOption) =>
                                    setUniversityId(selectedOption.value)
                                }
                                className="text-black"
                                menuPlacement="auto"
                            />
                        </div>
                    )}
                    <button
                        onClick={handleRegister}
                        className="bg-white text-primary font-semibold py-2 px-4 rounded-lg shadow"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}
