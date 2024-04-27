import React from 'react';
import {
    TrashIcon,
    HandThumbDownIcon,
    HeartIcon,
} from '@heroicons/react/24/solid';

const MiniClothingCard = ({
    clothing,
    onDelete,
    onPurchase,
    onReview,
    opinionType,
    onOpinionChange,
}) => {
    return (
        <div className="flex flex-col p-2 border-2 rounded-md mb-2">
            <div className="flex flex-row">
                <img
                    src={clothing.Image}
                    alt={clothing.Name}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'default-image-url';
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
                <div className="flex flex-col">
                    <button
                        className="p-1"
                        onClick={() => onDelete(clothing.Clothing_Id)}
                    >
                        <TrashIcon className="h-6 w-6 text-red-500" />
                    </button>
                    {opinionType === 'l' ? (
                        <button
                            className="p-1 mt-1"
                            onClick={() =>
                                onOpinionChange(clothing.Clothing_Id, 'D')()
                            }
                        >
                            <HandThumbDownIcon className="h-6 w-6 hover:text-red-500" />
                        </button>
                    ) : (
                        <button
                            className="p-1 mt-1"
                            onClick={() =>
                                onOpinionChange(clothing.Clothing_Id, 'L')()
                            }
                        >
                            <HeartIcon className="h-6 w-6 text-tertiary hover:text-green-500" />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex flex-row h-20">
                {!clothing.Purchased ? (
                    <button
                        className="mr-auto my-auto bg-tertiary text-white rounded hover:bg-primary h-16 w-56 p-2"
                        onClick={() => onPurchase(clothing.Clothing_Id)}
                    >
                        Have you purchased this item?
                    </button>
                ) : (
                    <p className="ml-auto my-auto text-green-500 font-semibold">
                        You've purchased this item!
                    </p>
                )}
                <button
                    className="ml-auto my-auto bg-tertiary text-white rounded hover:bg-primary h-16 w-56 p-2"
                    onClick={() => onReview(clothing)}
                >
                    Review This Item
                </button>
            </div>
        </div>
    );
};

export default MiniClothingCard;
