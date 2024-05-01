import React, { useState, useEffect } from 'react';
import {
    getClothesById,
    addClothing,
    deleteClothing,
    updateClothing,
} from '../api/Clothes';
import { fetchCustomerInfo, deleteCustomer } from '../api/Customers';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import NavbarAdmin from './NavbarAdmin';

export default function AdminScreen() {
    const [clothingId, setClothingId] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [tempCustomerId, setTempCustomerId] = useState('');
    const [tempClothingId, setTempClothingId] = useState('');
    const [clothingData, setClothingData] = useState({});
    const [customerData, setCustomerData] = useState({});
    const [showClothingDetails, setShowClothingDetails] = useState(false);
    const [editedClothingData, setEditedClothingData] = useState({});
    const [newClothingData, setNewClothingData] = useState({
        Name: '',
        Clothing_Color: '',
        Brand: '',
        Type: '',
        Price: 0,
        Image: '',
        URL: '',
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

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

    const [showAddClothing, setShowAddClothing] = useState(false);
    const [showManageCustomer, setShowManageCustomer] = useState(false);

    const [error, setError] = useState('');
    const [showErrorDialog, setShowErrorDialog] = useState(false);

    const handleDeleteError = (errorMessage) => {
        setError(errorMessage);
        setShowErrorDialog(true);
        console.log(errorMessage);
    };

    const handleHideManageClothing = () => {
        setShowClothingDetails(false);
    };

    const handleShowAddClothing = () => {
        setShowAddClothing(true);
    };

    const handleHideAddClothing = () => {
        setShowAddClothing(false);
    };

    const handleHideManageCustomer = () => {
        setShowManageCustomer(false);
    };

    useEffect(() => {
        const handleClothingSearch = async () => {
            try {
                const filters = { id: clothingId };
                const data = await getClothesById(filters);
                if (data.length === 0) {
                    handleDeleteError('Sorry, failed to fetch clothing.');
                    setShowClothingDetails(false);
                } else {
                    setClothingData(data);
                    setEditedClothingData(data);
                    setShowClothingDetails(true);
                    // console.log(clothingData);
                    // console.log(editedClothingData);
                }
            } catch (error) {
                console.error('Failed to fetch clothing:', error);
                setShowClothingDetails(false);
                handleDeleteError('Sorry, failed to fetch clothing.');
            }
        };

        if (clothingId !== '') {
            handleClothingSearch();
        }
    }, [clothingId]);

    const handleClothingSearchClick = () => {
        setClothingId(tempClothingId);
    };

    useEffect(() => {
        const handleCustomerSearch = async () => {
            try {
                const data = await fetchCustomerInfo(customerId);
                setCustomerData(data);
                setShowManageCustomer(true);
            } catch (error) {
                console.error('Failed to fetch customer info:', error);
                handleDeleteError('Sorry, that customer does not exist.');
                setShowManageCustomer(false);
            }
        };

        if (customerId !== '') {
            handleCustomerSearch();
        }
    }, [customerId]);

    const handleCustomerSearchClick = () => {
        setCustomerId(tempCustomerId);
    };

    const handleDeleteCustomer = async () => {
        try {
            await deleteCustomer(customerId);
            console.log('Customer deleted successfully');
            setCustomerId('');
            setCustomerData({});
            handleSnackbarOpen('Customer deleted!');
            setShowManageCustomer(false);
        } catch (error) {
            handleSnackbarOpen('Failed to delete customer.');
            console.error('Failed to delete customer:', error);
            handleDeleteError('Sorry, that customer does not exist.');
        }
    };

    const handleEditClothing = async () => {
        try {
            // Assuming editClothingData contains the updated information
            // Update the clothing item
            // console.log(editedClothingData);

            await updateClothing(clothingId, editedClothingData[0]);
            console.log('Clothing item updated successfully');
            handleSnackbarOpen('Clothing updated!');
            setShowClothingDetails(false);
        } catch (error) {
            handleSnackbarOpen('Failed to update clothing.');
            console.error('Failed to update clothing item:', error);
            handleDeleteError('Sorry, that clothing cannot be updated.');
        }
    };

    const handleAddClothing = async () => {
        try {
            await addClothing(newClothingData);
            console.log('Clothing item added successfully');
            setShowAddClothing(false);
        } catch (error) {
            console.error('Failed to add clothing item:', error);
            handleDeleteError('Sorry, that clothing cannot be added.');
        }
    };

    const handleDeleteClothing = async (clothingId) => {
        try {
            await deleteClothing(clothingId);
            console.log('Clothing item deleted successfully');
            setClothingId('');
            setClothingData({});
            setShowClothingDetails(false);
            handleSnackbarOpen('Clothing deleted!');
        } catch (error) {
            handleSnackbarOpen('Failed to delete clothing.');
            console.error('Failed to delete clothing item:', error);
            handleDeleteError('Sorry, that clothing does not exist.');
        }
    };

    return (
        <div
            className="flex flex-wrap h-max justify-center items-center gap-8 pb-4"
            style={{
                backgroundImage: `url(${require('../assets/welcome-page-bg.png')})`,
            }}
        >
            <NavbarAdmin />
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
            <div className="w-full md:w-1/2 p-4 border border-teal-500 bg-primary rounded-lg shadow-xl">
                <h1 className="text-white text-center py-4 text-6xl font-bold">
                    ADMIN PAGE
                </h1>
            </div>
            <div className="w-full md:w-1/2 p-4 border border-teal-500 bg-primary rounded-lg shadow-xl">
                <h2 className="text-lg font-bold text-white mb-4">
                    Manage Customers
                </h2>
                <input
                    type="text"
                    id="customerIdInput"
                    value={tempCustomerId}
                    onChange={(e) => setTempCustomerId(e.target.value)}
                    placeholder="Enter Customer ID"
                    className="mb-2 mr-2 p-2 border rounded"
                />
                <button
                    onClick={handleCustomerSearchClick}
                    className="p-2 mr-2 bg-tertiary text-white rounded hover:bg-secondary"
                >
                    Search Customer
                </button>
                {showManageCustomer && (
                    <div>
                        {/* Display customer information */}
                        <p className="text-white mt-2 font-medium">
                            Email: {customerData.Email}
                        </p>
                        <p className="text-white mt-2 font-medium">
                            First Name: {customerData.First_Name}
                        </p>
                        <p className="text-white mt-2 font-medium">
                            Last Name: {customerData.Last_Name}
                        </p>
                        <p className="text-white mt-2 font-medium">
                            Skin Color H: {customerData.Skin_Color_H}
                        </p>
                        <p className="text-white mt-2 font-medium">
                            Skin Color S: {customerData.Skin_Color_S}
                        </p>
                        <p className="text-white mt-2 font-medium">
                            Skin Color V: {customerData.Skin_Color_V}
                        </p>
                        <p className="text-white mt-2 font-medium">
                            University ID: {customerData.University_Id}
                        </p>
                        <button
                            onClick={handleDeleteCustomer}
                            className="p-2 mt-4 bg-red-500 text-white rounded mr-2"
                        >
                            Delete Customer
                        </button>
                        <button
                            onClick={handleHideManageCustomer}
                            className="p-2 bg-red-500 text-white rounded mr-2"
                        >
                            Hide
                        </button>
                    </div>
                )}
            </div>
            <div className="w-full md:w-1/2 p-4 border border-teal-500 bg-primary rounded-lg shadow-xl">
                <h2 className="text-lg text-white font-bold mb-4">
                    Manage Clothing
                </h2>
                <input
                    id="clothingIdInput"
                    type="text"
                    value={tempClothingId}
                    onChange={(e) => setTempClothingId(e.target.value)}
                    placeholder="Enter Clothing ID"
                    className="p-2 mr-2 border rounded"
                />
                <button
                    onClick={handleClothingSearchClick}
                    className="p-2 mr-2 bg-tertiary text-white rounded hover:bg-secondary"
                >
                    Search Clothing
                </button>
                {showClothingDetails && (
                    <div className="text-sm font-bold text-white mb-2"></div>
                )}
                {showClothingDetails && (
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">
                            Clothing Details
                        </h3>

                        <div className="flex flex-col">
                            <label htmlFor="name" className="text-white mb-1">
                                Name:
                            </label>
                            <input
                                type="text"
                                value={
                                    editedClothingData.Name ||
                                    (clothingData.length > 0
                                        ? clothingData[0].Name
                                        : '')
                                }
                                onChange={(e) => {
                                    const updatedClothingData = [
                                        ...editedClothingData,
                                    ]; // Create a copy of the array
                                    updatedClothingData[0].Name =
                                        e.target.value; // Update the Price property of the first element
                                    setEditedClothingData(updatedClothingData); // Update the state with the modified array
                                }}
                                className="mb-2 p-2 border rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="brand" className="text-white mb-1">
                                Brand:
                            </label>
                            <input
                                type="text"
                                value={
                                    editedClothingData.Brand ||
                                    (clothingData.length > 0
                                        ? clothingData[0].Brand
                                        : '')
                                }
                                onChange={(e) => {
                                    const updatedClothingData = [
                                        ...editedClothingData,
                                    ]; // Create a copy of the array
                                    updatedClothingData[0].Brand =
                                        e.target.value; // Update the Price property of the first element
                                    setEditedClothingData(updatedClothingData); // Update the state with the modified array
                                }}
                                className="mb-2 p-2 border rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="price" className="text-white mb-1">
                                Price:
                            </label>
                            <input
                                type="number"
                                value={
                                    editedClothingData.Price ||
                                    (clothingData.length > 0
                                        ? clothingData[0].Price
                                        : '')
                                }
                                onChange={(e) => {
                                    const updatedClothingData = [
                                        ...editedClothingData,
                                    ]; // Create a copy of the array
                                    updatedClothingData[0].Price =
                                        e.target.value; // Update the Price property of the first element
                                    setEditedClothingData(updatedClothingData); // Update the state with the modified array
                                }}
                                className="mb-2 p-2 border rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="color" className="text-white mb-1">
                                Clothing_Color:
                            </label>
                            <input
                                type="text"
                                value={
                                    editedClothingData.Clothing_Color ||
                                    (clothingData.length > 0
                                        ? clothingData[0].Clothing_Color
                                        : '')
                                }
                                onChange={(e) => {
                                    const updatedClothingData = [
                                        ...editedClothingData,
                                    ]; // Create a copy of the array
                                    updatedClothingData[0].Clothing_Color =
                                        e.target.value; // Update the Price property of the first element
                                    setEditedClothingData(updatedClothingData); // Update the state with the modified array
                                }}
                                className="mb-2 p-2 border rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="type" className="text-white mb-1">
                                Type:
                            </label>
                            <input
                                type="text"
                                value={
                                    editedClothingData.Type ||
                                    (clothingData.length > 0
                                        ? clothingData[0].Type
                                        : '')
                                }
                                onChange={(e) => {
                                    const updatedClothingData = [
                                        ...editedClothingData,
                                    ]; // Create a copy of the array
                                    updatedClothingData[0].Type =
                                        e.target.value; // Update the Price property of the first element
                                    setEditedClothingData(updatedClothingData); // Update the state with the modified array
                                }}
                                className="mb-2 p-2 border rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="image" className="text-white mb-1">
                                Image:
                            </label>
                            <input
                                type="text"
                                value={
                                    editedClothingData.Image ||
                                    (clothingData.length > 0
                                        ? clothingData[0].Image
                                        : '')
                                }
                                onChange={(e) => {
                                    const updatedClothingData = [
                                        ...editedClothingData,
                                    ]; // Create a copy of the array
                                    updatedClothingData[0].Image =
                                        e.target.value; // Update the Price property of the first element
                                    setEditedClothingData(updatedClothingData); // Update the state with the modified array
                                }}
                                className="mb-2 p-2 border rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="url" className="text-white mb-1">
                                URL:
                            </label>
                            <input
                                type="text"
                                value={
                                    editedClothingData.URL ||
                                    (clothingData.length > 0
                                        ? clothingData[0].URL
                                        : '')
                                }
                                onChange={(e) => {
                                    const updatedClothingData = [
                                        ...editedClothingData,
                                    ]; // Create a copy of the array
                                    updatedClothingData[0].URL = e.target.value; // Update the Price property of the first element
                                    setEditedClothingData(updatedClothingData); // Update the state with the modified array
                                }}
                                className="mb-2 p-2 border rounded"
                            />
                        </div>

                        {/* Add more input fields for other editable fields */}
                        <button
                            onClick={handleEditClothing}
                            className="p-2 bg-tertiary text-white rounded mr-2 hover:bg-secondary"
                        >
                            Submit
                        </button>

                        <button
                            onClick={() =>
                                handleDeleteClothing(
                                    clothingData[0].Clothing_Id
                                )
                            }
                            className="p-2 bg-red-500 text-white rounded mr-2"
                        >
                            Delete
                        </button>

                        <button
                            onClick={() => handleHideManageClothing()}
                            className="p-2 bg-red-500 text-white rounded mr-2"
                        >
                            Hide
                        </button>
                    </div>
                )}
            </div>
            <div className="w-full md:w-1/2 p-4 border border-teal-500 bg-primary rounded-lg shadow-xl">
                <h3 className="text-lg text-white font-bold mb-2">
                    Add Clothing
                </h3>
                {!showAddClothing && (
                    <button
                        onClick={handleShowAddClothing}
                        className="p-2 bg-tertiary text-white rounded hover:bg-secondary"
                    >
                        Add Clothing
                    </button>
                )}
                {showAddClothing && (
                    <>
                        <div className="flex flex-col">
                            <label htmlFor="name" className="text-white mb-1">
                                Name:
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={newClothingData.Name}
                                onChange={(e) => {
                                    console.log(newClothingData);
                                    const updatedClothingData = {
                                        ...newClothingData,
                                    };
                                    updatedClothingData.Name = e.target.value; // Update the Price property of the first element
                                    setNewClothingData(updatedClothingData); // Update the state with the modified array
                                }}
                                placeholder="Name"
                                className="mb-2 p-2 border rounded"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="brand" className="text-white mb-1">
                                Brand:
                            </label>
                            <input
                                type="text"
                                id="brand"
                                value={newClothingData.Brand}
                                onChange={(e) => {
                                    const updatedClothingData = {
                                        ...newClothingData,
                                    }; // Create a copy of the array
                                    updatedClothingData.Brand = e.target.value; // Update the Price property of the first element
                                    setNewClothingData(updatedClothingData); // Update the state with the modified array
                                }}
                                placeholder="Brand"
                                className="mb-2 p-2 border rounded"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="price" className="text-white mb-1">
                                Price:
                            </label>
                            <input
                                type="number"
                                id="price"
                                value={newClothingData.Price}
                                onChange={(e) => {
                                    const updatedClothingData = {
                                        ...newClothingData,
                                    }; // Create a copy of the array
                                    updatedClothingData.Price = e.target.value; // Update the Price property of the first element
                                    setNewClothingData(updatedClothingData); // Update the state with the modified array
                                }}
                                placeholder="Price"
                                className="mb-2 p-2 border rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="color" className="text-white mb-1">
                                Clothing Color:
                            </label>
                            <input
                                type="text"
                                id="colothingcolor"
                                value={newClothingData.Clothing_Color}
                                onChange={(e) => {
                                    const updatedClothingData = {
                                        ...newClothingData,
                                    }; // Create a copy of the array
                                    updatedClothingData.Clothing_Color =
                                        e.target.value; // Update the Price property of the first element
                                    setNewClothingData(updatedClothingData); // Update the state with the modified array
                                }}
                                placeholder="Clothing Color"
                                className="mb-2 p-2 border rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="type" className="text-white mb-1">
                                Type:
                            </label>
                            <input
                                type="text"
                                id="type"
                                value={newClothingData.Type}
                                onChange={(e) => {
                                    const updatedClothingData = {
                                        ...newClothingData,
                                    }; // Create a copy of the array
                                    updatedClothingData.Type = e.target.value; // Update the Price property of the first element
                                    setNewClothingData(updatedClothingData); // Update the state with the modified array
                                }}
                                placeholder="Type"
                                className="mb-2 p-2 border rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="image" className="text-white mb-1">
                                Image:
                            </label>
                            <input
                                type="text"
                                id="image"
                                value={newClothingData.Image}
                                onChange={(e) => {
                                    const updatedClothingData = {
                                        ...newClothingData,
                                    }; // Create a copy of the array
                                    updatedClothingData.Image = e.target.value; // Update the Price property of the first element
                                    setNewClothingData(updatedClothingData); // Update the state with the modified array
                                }}
                                placeholder="Image"
                                className="mb-2 p-2 border rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="url" className="text-white mb-1">
                                URL:
                            </label>
                            <input
                                type="text"
                                id="url"
                                value={newClothingData.URL}
                                onChange={(e) => {
                                    const updatedClothingData = {
                                        ...newClothingData,
                                    }; // Create a copy of the array
                                    updatedClothingData.URL = e.target.value; // Update the Price property of the first element
                                    setNewClothingData(updatedClothingData); // Update the state with the modified array
                                }}
                                placeholder="URL"
                                className="mb-2 p-2 border rounded"
                            />
                        </div>
                        {/* Add more input fields for other new clothing data */}
                        <button
                            onClick={handleAddClothing}
                            className="p-2 bg-tertiary text-white rounded mr-2 hover:bg-secondary"
                        >
                            Add
                        </button>

                        <button
                            onClick={handleHideAddClothing}
                            className="p-2 bg-red-500 text-white rounded mr-2"
                        >
                            Hide
                        </button>
                    </>
                )}
            </div>
            {showErrorDialog && (
                <Dialog
                    onClose={() => setShowErrorDialog(false)}
                    open={showErrorDialog}
                >
                    <DialogTitle>Error</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{error}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setShowErrorDialog(false)}
                            color="primary"
                        >
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
}
