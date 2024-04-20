import React from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';

const MiniClothingCard = ({ clothing, onDelete }) => {
    return (
        <div className="flex items-center p-2 shadow-md rounded-md mb-2">
            <img
                src={clothing.Image}
                alt={clothing.Name}
                className="w-24 h-24 object-cover rounded-md mr-4"
                onError={(e) => {
                    e.target.onerror = null; // Avoid infinite callback loop
                    e.target.src = 'default-image-url'; // Placeholder if image fails to load
                }}
            />
            <div className="flex-grow">
                <div className="text-lg mb-2 ml-2 mt-2 underline">
                    <a
                        href={clothing.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {clothing.Name}
                    </a>
                </div>
                <p className="text-sm">{clothing.Brand}</p>
                <p className="text-md font-semibold">
                    ${clothing.Price.toFixed(2)}
                </p>
            </div>
            <button
                className="p-1"
                onClick={() => onDelete(clothing.Clothing_Id)}
            >
                <TrashIcon className="h-6 w-6 text-red-500" />
            </button>
        </div>
    );
};

export default MiniClothingCard;
