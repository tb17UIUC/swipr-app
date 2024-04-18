import React from 'react';

const ClothingCard = ({ clothing }) => {
    const handleImageError = (e) => {
        e.target.onerror = null; // Prevents looping
        e.target.src = require('../assets/not-found.jpeg');
    };

    return (
        <div className="flex flex-col shadow-lg h-full rounded-xl">
            <div className="overflow-hidden h-4/5 object-cover rounded-t-xl">
                <img
                    src={clothing.Image}
                    alt={clothing.Name}
                    onError={handleImageError} // Use the error handler here
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Image scaling */}
            <div className="grow bg-primary text-white rounded-b-xl">
                <div className="font-bold text-xl mb-2 ml-2 mt-2">
                    {clothing.Name}
                </div>
                <p className="text-base ml-2">
                    <span className="text-tertiary text-sm ">
                        {clothing.Brand}
                    </span>
                </p>
                <p className="text-xl ml-2">${clothing.Price.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ClothingCard;
