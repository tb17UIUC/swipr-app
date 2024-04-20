import React, { useEffect, useState } from 'react';
import ReactImagePickerEditor from 'react-image-picker-editor';
import 'react-image-picker-editor/dist/index.css';
import { getFilterInfo } from '../api/FilterInfo';
import Select from 'react-select';
import { useUser } from '../UserContext';
import { fetchCustomerInfo } from '../api/Customers';
import { updateCustomer } from '../api/Customers';
import Navbar from './Navbar';
import { TailSpin } from 'react-loading-icons';
import { fetchCustomerOpinions } from '../api/Opinions';
import MiniClothingCard from './MiniClothingCard';
import { deleteOpinion } from '../api/Opinions';

export default function ProfileScreen() {
    const { user } = useUser();
    const customerId = user.customerId;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [profilePicture, setProfilePicture] = useState('');
    const [universityId, setUniversityId] = useState(null);
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);

    const [likes, setLikes] = useState([]);
    const [dislikes, setDislikes] = useState([]);

    const config2 = {
        borderRadius: '8px',
        language: 'en',
        width: '100px',
        height: '100px',
        objectFit: 'contain',
        aspectRatio: 1,
        compressInitial: 0.3,
        hideDownloadBtn: true,
        hideAddBtn: true,
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const customerInfo = await fetchCustomerInfo(
                    user.customerId || 1
                );
                if (customerInfo) {
                    setFirstName(customerInfo.First_Name);
                    setLastName(customerInfo.Last_Name);
                    setEmail(customerInfo.Email);
                    setUniversityId(customerInfo.University_Id);
                }

                const filterData = await getFilterInfo(); // Assuming it returns universities
                setUniversities(
                    filterData.universities.map((uni) => ({
                        value: uni.University_Id,
                        label: uni.University_Name,
                    }))
                );
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        const fetchOpinions = async () => {
            try {
                const customerId = user.customerId || 1; // Default to 1 if user.customerId is undefined
                const data = await fetchCustomerOpinions(customerId);
                setLikes(
                    data.filter((opinion) => opinion.Opinion_Type === 'L')
                );
                setDislikes(
                    data.filter((opinion) => opinion.Opinion_Type === 'D')
                );
            } catch (error) {
                console.error('Error fetching customer opinions:', error);
            }
        };

        fetchOpinions();

        fetchData();
    }, [user.customerId]);

    const handleSaveChanges = async () => {
        const customerData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            profilePicture: profilePicture,
            universityId: universityId,
        };

        try {
            const updateSuccessful = await updateCustomer(
                customerData,
                customerId
            );
            if (updateSuccessful) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Update failed:', error);
            alert(
                'An error occurred while updating your profile. Please check your network connection and try again.'
            );
        }
    };

    const handlePasswordChangeClick = () => {
        setShowPassword(!showPassword);
    };

    const removeOpinion = async (clothingId) => {
        try {
            await deleteOpinion({ customerId, clothingId }); // Call the API
            // Update state to remove the opinion from UI
            setLikes((prevLikes) =>
                prevLikes.filter((item) => item.Clothing_Id !== clothingId)
            );
            setDislikes((prevDislikes) =>
                prevDislikes.filter((item) => item.Clothing_Id !== clothingId)
            );
        } catch (error) {
            console.error('Failed to delete opinion:', error);
        }
    };

    return loading ? (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-lg font-medium mb-2">Fetching Profile Info</p>
            <TailSpin stroke="#4DCCBD" />
        </div>
    ) : (
        <div className="flex flex-col items-center h-screen">
            <Navbar />
            <div className="flex flex-row h-full w-full ">
                <div className="p-6 m-2 bg-primary rounded-xl shadow-xl text-center basis-1/4">
                    <h1 className="text-white text-4xl font-bold">
                        Your Profile
                    </h1>
                    <div className="mt-8 flex flex-col">
                        <div className="mx-auto mb-3">
                            <ReactImagePickerEditor
                                config={config2}
                                imageSrcProp={profilePicture}
                                imageChanged={(newDataUri) =>
                                    setProfilePicture(newDataUri)
                                }
                            />
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
                        {showPassword && (
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full p-2 mb-3 text-lg rounded-md shadow-md"
                            />
                        )}
                        <button
                            onClick={handlePasswordChangeClick}
                            className="bg-white text-primary font-semibold py-1 rounded-lg shadow mt-2"
                        >
                            {showPassword ? 'Cancel' : 'Change Password'}
                        </button>
                        {!loading && (
                            <div className="my-4">
                                <label className="text-white">
                                    University (Optional)
                                </label>
                                <Select
                                    options={universities}
                                    value={universities.find(
                                        (uni) => uni.value === universityId
                                    )}
                                    onChange={(selectedOption) =>
                                        setUniversityId(selectedOption.value)
                                    }
                                    className="text-black"
                                    menuPlacement="auto"
                                />
                            </div>
                        )}
                        <button
                            onClick={handleSaveChanges}
                            className="bg-white text-primary font-semibold py-2 px-4 rounded-lg shadow mt-4"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
                <div className="flex flex-row basis-3/4">
                    <div className="flex flex-col overflow-auto m-2 ml-2 mr-2 border-2 border-primary rounded-xl basis-1/2">
                        <h2 className="text-lg font-bold m-2 ">Your Likes</h2>
                        {likes.map((clothing) => (
                            <MiniClothingCard
                                key={clothing.Clothing_Id}
                                clothing={clothing}
                                onDelete={() =>
                                    removeOpinion(clothing.Clothing_Id)
                                }
                            />
                        ))}
                    </div>
                    <div className="flex flex-col overflow-auto m-2 ml-2 mr-2 border-2 border-primary rounded-xl basis-1/2">
                        <h2 className="text-lg font-bold m-2">Your Dislikes</h2>
                        {dislikes.map((clothing) => (
                            <MiniClothingCard
                                key={clothing.Clothing_Id}
                                clothing={clothing}
                                onDelete={removeOpinion}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
