import React from 'react';
import { updateClothing } from '../api/Clothes';

const EditClothingCard = ({ clothing }) => {
    const [editedClothing, setEditedClothing] = React.useState(clothing);

    const handleChange = (event) => {
        setEditedClothing({
            ...editedClothing,
            [event.target.name]: event.target.value,
        });
    };

    const handleUpdate = async () => {
        try {
            await updateClothing(clothing.id, editedClothing);
            alert('Clothing updated successfully!');
        } catch (error) {
            alert('Failed to update clothing');
            console.error('Failed to update clothing:', error);
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded">
            <h3 className="font-bold text-xl mb-3">Edit Clothing</h3>
            <input
                type="text"
                name="name"
                value={editedClothing.name}
                onChange={handleChange}
                className="mb-2 p-2 border rounded w-full"
                placeholder="Name"
            />
            <input
                type="text"
                name="brand"
                value={editedClothing.brand}
                onChange={handleChange}
                className="mb-2 p-2 border rounded w-full"
                placeholder="Brand"
            />
            <input
                type="number"
                name="price"
                value={editedClothing.price}
                onChange={handleChange}
                className="mb-2 p-2 border rounded w-full"
                placeholder="Price"
            />
            <button
                onClick={handleUpdate}
                className="p-2 bg-blue-600 text-white rounded"
            >
                Update
            </button>
        </div>
    );
};

export default EditClothingCard;
