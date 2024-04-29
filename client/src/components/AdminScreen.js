import React, { useState, useEffect } from 'react';
import { getClothesById, getFilteredClothes, addClothingItem, deleteClothingItem } from '../api/Clothes';
import { fetchCustomerInfo, addCustomer, deleteCustomer } from '../api/Customers';
import ClothingCard from './ClothingCard';
import EditClothingCard from './EditClothingCard';

export default function AdminScreen() {
    const [clothingId, setClothingId] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [clothingData, setClothingData] = useState({});
    const [customerData, setCustomerData] = useState({});
    const [showClothingDetails, setShowClothingDetails] = useState(false);
    const [editClothingData, setEditClothingData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editedClothingData, setEditedClothingData] = useState({});
    const [newClothingData, setNewClothingData] = useState({
        Clothing_Color: '',
        Brand: '',
        Type: '',
        Price: 0,
        Image: '',
        URL: '',
    });
    const [newCustomerData, setNewCustomerData] = useState({
        Email: '',
        Password: '',
        First_Name: '',
        Last_Name: '',
        Skin_Color_H: 0,
        Skin_Color_S: 0,
        Skin_Color_V: 0,
        University_Id: 0,
    });
    const [showAddClothing, setShowAddClothing] = useState(false);
    const [showManageCustomer, setShowManageCustomer] = useState(false);

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
    

    const handleClothingSearch = async () => {
        try {
            const filters = { id: clothingId };
            const data = await getClothesById(filters);
            setClothingData(data);
            setShowClothingDetails(true);
        } catch (error) {
            console.error('Failed to fetch clothing:', error);
            setShowClothingDetails(false);
        }
    };

    const handleCustomerSearch = async () => {
        try {
            const data = await fetchCustomerInfo(customerId);
            setCustomerData(data);
            setShowManageCustomer(true);
        } catch (error) {
            console.error('Failed to fetch customer info:', error);
        }
    };

    const handleAddCustomer = async () => {
        try {
            //await addCustomer(newCustomerData);
            console.log('Customer added successfully');
        } catch (error) {
            console.error('Failed to add customer:', error);
        }
    };

    const handleDeleteCustomer = async () => {
        try {
            //await deleteCustomer(customerId);
            console.log('Customer deleted successfully');
            setCustomerId('');
            setCustomerData({});
        } catch (error) {
            console.error('Failed to delete customer:', error);
        }
    };

    const handleEditClothing = async () => {
        try {
            // Assuming editClothingData contains the updated information
            // Update the clothing item
            // await updateClothingItem(editClothingData);
            console.log('Clothing item updated successfully');
            setEditMode(false);
        } catch (error) {
            console.error('Failed to update clothing item:', error);
        }
    };

    const handleAddClothing = async () => {
        try {
            //await addClothingItem(newClothingData);
            console.log('Clothing item added successfully');
        } catch (error) {
            console.error('Failed to add clothing item:', error);
        }
    };

    const handleDeleteClothing = async (clothingId) => {
        try {
            //await deleteClothingItem(clothingId);
            console.log('Clothing item deleted successfully');
            setClothingId('');
            setClothingData({});
            setShowClothingDetails(false);
        } catch (error) {
            console.error('Failed to delete clothing item:', error);
        }
    };

    return (
    <div className="flex flex-wrap h-full justify-center items-center p-8 gap-8"  style={{
        backgroundImage: `url(${require('../assets/welcome-page-bg.png')})`, height: '100vh', overflowY: 'auto',
    }}>
    <div className="w-full md:w-1/2 p-8 border border-teal-500 bg-primary rounded-lg shadow-xl">
        <h1 className="text-white text-center py-4 text-6xl font-bold">ADMIN PAGE</h1>
    </div>
    <div className="w-full md:w-1/2 p-4 border border-teal-500 bg-primary rounded-lg shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4">Manage Customers</h2>
        <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Enter Customer ID"
            className="mb-2 mr-2 p-2 border rounded"
        />
        <button
            onClick={handleCustomerSearch}
            className="p-2 mr-2 bg-blue-500 text-white rounded"
        >
            Search Customer
        </button>
        {showManageCustomer && (
            <div>
                {/* Display customer information */}
                <p className="text-white mt-2 font-medium">Email: {customerData.Email}</p>
                <p className="text-white mt-2 font-medium">First Name: {customerData.First_Name}</p>
                <p className="text-white mt-2 font-medium">Last Name: {customerData.Last_Name}</p>
                <p className="text-white mt-2 font-medium">Skin Color H: {customerData.Skin_Color_H}</p>
                <p className="text-white mt-2 font-medium">Skin Color S: {customerData.Skin_Color_S}</p>
                <p className="text-white mt-2 font-medium">Skin Color V: {customerData.Skin_Color_V}</p>
                <p className="text-white mt-2 font-medium">University ID: {customerData.University_Id}</p>
                <button onClick={handleDeleteCustomer} className="p-2 mt-4 bg-red-500 text-white rounded mr-2">Delete Customer</button>
                <button onClick={() => handleHideManageCustomer()} className="p-2 bg-red-500 text-white rounded mr-2">
                Hide
                </button>
            </div>
        )}
    </div>
    <div className="w-full md:w-1/2 p-4 border border-teal-500 bg-primary rounded-lg shadow-xl">
        <h2 className="text-lg text-white font-bold mb-4">Manage Clothing</h2>
            <input
                id="clothingId"
                type="text"
                value={clothingId}
                onChange={(e) => setClothingId(e.target.value)}
                placeholder="Enter Clothing ID"
                className="p-2 mr-2 border rounded"
            />
            <button
            onClick={handleClothingSearch}
            className="p-2 mr-2 bg-blue-500 text-white rounded mr-2"
            >
            Search Clothing
            </button>
        {showClothingDetails && (
            <div className="text-sm font-bold text-white mb-2">
            </div>
        )}
        {showClothingDetails && (
            <div>
                <h3 className="text-lg font-bold text-white mb-2">Clothing Details</h3>

                <div className="flex flex-col">
                <label htmlFor="name" className="text-white mb-1">Name:</label>
                <input
                    type="text"
                    value={editedClothingData.Name || clothingData[0].Name}
                    onChange={(e) => setEditedClothingData({ ...editedClothingData, Name: e.target.value })}
                    className="mb-2 p-2 border rounded"
                />
                </div>

                <div className="flex flex-col">
                <label htmlFor="brand" className="text-white mb-1">Brand:</label>
                <input
                    type="text"
                    value={editedClothingData.Brand || clothingData[0].Brand}
                    onChange={(e) => setEditedClothingData({ ...editedClothingData, Brand: e.target.value })}
                    className="mb-2 p-2 border rounded"
                />
                </div>

                <div className="flex flex-col">
                <label htmlFor="price" className="text-white mb-1">Price:</label>
                <input
                    type="number"
                    value={editedClothingData.Price || clothingData[0].Price}
                    onChange={(e) => setEditedClothingData({ ...editedClothingData, Price: e.target.value })}
                    className="mb-2 p-2 border rounded"
                />
                </div>

                <div className="flex flex-col">
                <label htmlFor="color" className="text-white mb-1">Clothing_Color:</label>
                <input
                    type="text"
                    value={editedClothingData.Clothing_Color || clothingData[0].Clothing_Color}
                    onChange={(e) => setEditedClothingData({ ...editedClothingData, Clothing_Color: e.target.value })}
                    className="mb-2 p-2 border rounded"
                />
                </div>

                <div className="flex flex-col">
                <label htmlFor="type" className="text-white mb-1">Type:</label>
                <input
                    type="text"
                    value={editedClothingData.Type || clothingData[0].Type}
                    onChange={(e) => setEditedClothingData({ ...editedClothingData, Type: e.target.value })}
                    className="mb-2 p-2 border rounded"
                />
                </div>

                <div className="flex flex-col">
                <label htmlFor="image" className="text-white mb-1">Image:</label>
                <input
                    type="text"
                    value={editedClothingData.Image || clothingData[0].Image}
                    onChange={(e) => setEditedClothingData({ ...editedClothingData, Image: e.target.value })}
                    className="mb-2 p-2 border rounded"
                />
                </div>

                <div className="flex flex-col">
                <label htmlFor="url" className="text-white mb-1">URL:</label>
                <input
                    type="text"
                    value={editedClothingData.URL || clothingData[0].URL}
                    onChange={(e) => setEditedClothingData({ ...editedClothingData, URL: e.target.value })}
                    className="mb-2 p-2 border rounded"
                />
                </div>
                
                {/* Add more input fields for other editable fields */}
                <button onClick={handleEditClothing} className="p-2 bg-blue-500 text-white rounded mr-2">Submit</button>

                <button onClick={() => handleDeleteClothing(clothingData[0].Clothing_Id)} className="p-2 bg-red-500 text-white rounded mr-2">
                    Delete
                </button>

                <button onClick={() => handleHideManageClothing()} className="p-2 bg-red-500 text-white rounded mr-2">
                    Hide
                </button>
            </div>
        )}
    </div>
    <div className="w-full md:w-1/2 p-4 border border-teal-500 bg-primary rounded-lg shadow-xl">
    <h3 className="text-lg text-white font-bold mb-2">Add Clothing</h3>
    {!showAddClothing && (<button onClick={handleShowAddClothing} className="p-2 bg-blue-500 text-white rounded">Add Clothing</button>)}
    {showAddClothing && (
        <>
            <div className="flex flex-col">
                <label htmlFor="name" className="text-white mb-1">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={newClothingData.Name}
                    onChange={(e) => setNewClothingData({ ...newClothingData, Name: e.target.value })}
                    placeholder="Name"
                    className="mb-2 p-2 border rounded"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="brand" className="text-white mb-1">Brand:</label>
                <input
                    type="text"
                    id="brand"
                    value={newClothingData.Brand}
                    onChange={(e) => setNewClothingData({ ...newClothingData, Brand: e.target.value })}
                    placeholder="Brand"
                    className="mb-2 p-2 border rounded"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="price" className="text-white mb-1">Price:</label>
                <input
                    type="number"
                    id="price"
                    value={newClothingData.Price}
                    onChange={(e) => setNewClothingData({ ...newClothingData, Price: e.target.value })}
                    placeholder="Price"
                    className="mb-2 p-2 border rounded"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="color" className="text-white mb-1">Clothing Color:</label>
                <input
                    type="text"
                    id="colothingcolor"
                    value={newClothingData.Clothing_Color}
                    onChange={(e) => setNewClothingData({ ...newClothingData, Clothing_Color: e.target.value })}
                    placeholder="Clothing COlor"
                    className="mb-2 p-2 border rounded"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="type" className="text-white mb-1">Type:</label>
                <input
                    type="text"
                    id="type"
                    value={newClothingData.Type}
                    onChange={(e) => setNewClothingData({ ...newClothingData, Type: e.target.value })}
                    placeholder="Type"
                    className="mb-2 p-2 border rounded"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="image" className="text-white mb-1">Image:</label>
                <input
                    type="text"
                    id="image"
                    value={newClothingData.Image}
                    onChange={(e) => setNewClothingData({ ...newClothingData, Image: e.target.value })}
                    placeholder="Image"
                    className="mb-2 p-2 border rounded"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="url" className="text-white mb-1">URL:</label>
                <input
                    type="text"
                    id="url"
                    value={newClothingData.Image}
                    onChange={(e) => setNewClothingData({ ...newClothingData, URL: e.target.value })}
                    placeholder="URL"
                    className="mb-2 p-2 border rounded"
                />
            </div>
            {/* Add more input fields for other new clothing data */}
            <button onClick={handleAddClothing} className="p-2 bg-blue-500 text-white rounded mr-2">Add</button>

            <button onClick={() => handleHideAddClothing()} className="p-2 bg-red-500 text-white rounded mr-2">
                    Hide
            </button>
        </>
    )}
    </div>
</div>


    );
}
