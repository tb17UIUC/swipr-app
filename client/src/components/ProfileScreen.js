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
import { fetchCustomerActions } from '../api/Opinions';
import MiniClothingCard from './MiniClothingCard';
import { deleteOpinion, postOpinion } from '../api/Opinions';
import { postPurchase } from '../api/Purchases';
import ReviewModal from './ReviewModal';
import ViewReviewModal from './ViewReviewModal';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function ProfileScreen() {
    const { user } = useUser();
    const customerId = user.customerId || 1;

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

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedClothingForReview, setSelectedClothingForReview] =
        useState(null);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [viewReviewOpen, setViewReviewOpen] = useState(false);
    const [selectedClothingForViewReview, setSelectedClothingForViewReview] =
        useState(null);

    const handleSnackbarOpen = (message) => {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleOpenReviewModal = (clothing) => {
        setSelectedClothingForReview(clothing);
        setReviewModalOpen(true);
    };

    const handlePostedReviewModal = () => {
        setSelectedClothingForReview(null);
        handleSnackbarOpen('Review posted!');
        setReviewModalOpen(false);
    };

    const handleCancelReviewModal = () => {
        setSelectedClothingForReview(null);
        setReviewModalOpen(false);
    };

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
                    setProfilePicture(customerInfo.Profile_Picture);
                }

                const filterData = await getFilterInfo();
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

        const fetchActions = async () => {
            try {
                const customerId = user.customerId || 1;
                const data = await fetchCustomerActions(customerId);
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

        fetchActions();

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
                handleSnackbarOpen('Profile update was successful!');
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

    const handlePurchase = async (clothingId) => {
        try {
            await postPurchase({ customerId, clothingId });
            setLikes((prevLikes) =>
                prevLikes.map((item) =>
                    item.Clothing_Id === clothingId
                        ? { ...item, Purchased: true }
                        : item
                )
            );
            setDislikes((prevDislikes) =>
                prevDislikes.map((item) =>
                    item.Clothing_Id === clothingId
                        ? { ...item, Purchased: true }
                        : item
                )
            );
            handleSnackbarOpen("You've purchased this item!");
        } catch (error) {
            console.error('Failed to post purchase:', error);
            alert('Failed to save your purchase. Please try again.');
        }
    };

    const handlePasswordChangeClick = () => {
        setShowPassword(!showPassword);
    };

    const handleOpinionChange = (clothingId, newOpinionType) => async () => {
        try {
            await postOpinion({
                customerId: customerId,
                clothingId: clothingId,
                opinionType: newOpinionType,
            });

            handleSnackbarOpen('Opinion updated!');

            const updatedLikes = likes.filter(
                (item) => item.Clothing_Id !== clothingId
            );
            const updatedDislikes = dislikes.filter(
                (item) => item.Clothing_Id !== clothingId
            );

            const clothingItem = likes
                .concat(dislikes)
                .find((item) => item.Clothing_Id === clothingId);

            if (newOpinionType === 'L') {
                setLikes([
                    ...updatedLikes,
                    { ...clothingItem, Opinion_Type: 'L' },
                ]);
                setDislikes(updatedDislikes);
            } else {
                setDislikes([
                    ...updatedDislikes,
                    { ...clothingItem, Opinion_Type: 'D' },
                ]);
                setLikes(updatedLikes);
            }
        } catch (err) {
            console.error('Error changing opinion:', err);
            alert('Failed to change opinion. Please try again.');
        }
    };

    const removeOpinion = async (clothingId) => {
        try {
            await deleteOpinion({ customerId, clothingId });
            setLikes((prevLikes) =>
                prevLikes.filter((item) => item.Clothing_Id !== clothingId)
            );
            setDislikes((prevDislikes) =>
                prevDislikes.filter((item) => item.Clothing_Id !== clothingId)
            );
            handleSnackbarOpen("You've removed an opinion.");
        } catch (error) {
            console.error('Failed to delete opinion:', error);
            alert('Failed to remove your opinion. Please try again.');
        }
    };

    const handleViewReviews = (clothing) => {
        setSelectedClothingForViewReview(clothing)
        setViewReviewOpen(true);
    };

    const handleCancelViewReviewModal = () => {
        setSelectedClothingForViewReview(null);
        setViewReviewOpen(false);
    };

    return loading ? (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-lg font-medium mb-2">Fetching Profile Info</p>
            <TailSpin stroke="#4DCCBD" />
        </div>
    ) : (
        <div className="flex flex-col items-center h-screen">
            {selectedClothingForReview && (
                <ReviewModal
                    open={reviewModalOpen}
                    onCancel={handleCancelReviewModal}
                    onPost={handlePostedReviewModal}
                    clothing={selectedClothingForReview}
                />
            )}
            {selectedClothingForViewReview && (
                <ViewReviewModal
                    open={viewReviewOpen}
                    onCancel={handleCancelViewReviewModal}
                    clothing={selectedClothingForViewReview}
                />
            )}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
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
                                onDelete={removeOpinion}
                                onPurchase={handlePurchase}
                                onReview={handleOpenReviewModal}
                                opinionType="l"
                                onOpinionChange={handleOpinionChange}
                                onViewReviews={handleViewReviews}
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
                                onPurchase={handlePurchase}
                                onReview={handleOpenReviewModal}
                                opinionType="d"
                                onOpinionChange={handleOpinionChange}
                                onViewReviews={handleViewReviews}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
