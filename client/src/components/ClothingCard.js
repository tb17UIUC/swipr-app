import React from 'react';

const ClothingCard = ({ clothing }) => {
    const handleImageError = (e) => {
        e.target.onerror = null; // Prevents looping
        e.target.src = require('../assets/not-found.jpeg');
    };

    return (
        <div className="max-w-xs w-96 h-full rounded shadow-lg my-2">
            <div className="overflow-hidden w-full h-3/4 object-cover">
                <img
                    src={clothing.Image}
                    alt={clothing.Name}
                    onError={handleImageError} // Use the error handler here
                />
            </div>
            {/* Image scaling */}
            <div className="px-6 py-4 bg-black bg-opacity-50 text-white">
                <div className="font-bold text-xl mb-2">{clothing.Name}</div>
                <p className="text-base">
                    <span className="text-primary text-sm">
                        {clothing.Brand}
                    </span>
                </p>
                <p className="text-xl">${clothing.Price.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ClothingCard;
