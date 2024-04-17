import React from 'react';

const ClothingCard = ({ clothing }) => {
    return (
        <div className="max-w-xs rounded overflow-hidden shadow-lg my-2">
            <img className="w-full" src={clothing.Image} alt={clothing.Name} />
            <div className="px-6 py-4 bg-black bg-opacity-50 text-white">
                <div className="font-bold text-xl mb-2">{clothing.Name}</div>
                <p className="text-base">
                    <span className="text-gray-300 text-sm">
                        {clothing.Brand}
                    </span>
                </p>
                <p className="text-xl">${clothing.Price.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ClothingCard;
