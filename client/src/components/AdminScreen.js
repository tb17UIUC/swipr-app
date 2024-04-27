import React, { useState } from 'react';
import { getFilteredClothes } from '../api/Clothes';
import { fetchCustomerInfo } from '../api/Customers';
import EditClothingCard from './EditClothingCard';

export default function AdminScreen() {
    const [clothingId, setClothingId] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [clothingData, setClothingData] = useState({});
    const [customerData, setCustomerData] = useState({});

    const handleClothingSearch = async () => {
        try {
            const filters = { id: clothingId };
            const data = await getFilteredClothes(filters);
            setClothingData(data);
        } catch (error) {
            console.error('Failed to fetch clothing:', error);
        }
    };

    const handleCustomerSearch = async () => {
        try {
            const data = await fetchCustomerInfo(customerId);
            setCustomerData(data);
        } catch (error) {
            console.error('Failed to fetch customer info:', error);
        }
    };

    return (
        <div className="flex w-full">
            <div className="w-1/2 p-4 border-r">
                <h2 className="text-lg font-bold mb-4">Manage Clothing</h2>
                <input
                    type="text"
                    value={clothingId}
                    onChange={(e) => setClothingId(e.target.value)}
                    placeholder="Enter Clothing ID"
                    className="mb-2 p-2 border rounded"
                />
                <button
                    onClick={handleClothingSearch}
                    className="p-2 bg-blue-500 text-white rounded mr-2"
                >
                    Search Clothing
                </button>
                {clothingData && <EditClothingCard clothing={clothingData} />}
            </div>
            <div className="w-1/2 p-4">
                <h2 className="text-lg font-bold mb-4">Manage Customers</h2>
                <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="Enter Customer ID"
                    className="mb-2 p-2 border rounded"
                />
                <button
                    onClick={handleCustomerSearch}
                    className="p-2 bg-green-500 text-white rounded"
                >
                    Search Customer
                </button>
            </div>
        </div>
    );
}
