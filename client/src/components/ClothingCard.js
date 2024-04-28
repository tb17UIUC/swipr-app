import React, { useState, useEffect } from 'react';
import { fetchClothingOpinions } from '../api/Opinions';
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    HeartIcon,
} from '@heroicons/react/24/solid';

const ClothingCard = ({ clothing, onViewReviews }) => {
    const [opinions, setOpinions] = useState({
        like_count: 0,
        dislike_count: 0,
        superlike_count: 0,
    });

    useEffect(() => {
        const fetchOpinionsForItem = async () => {
            if (clothing && clothing.Clothing_Id) {
                try {
                    const response = await fetchClothingOpinions(
                        clothing.Clothing_Id
                    );
                    setOpinions(response); // Set the state with the fetched data
                } catch (error) {
                    console.error('Error fetching opinions:', error);
                }
            }
        };


        fetchOpinionsForItem(); // Call the async function

    }, [clothing]);

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
                <div className="font-bold text-xl mb-2 ml-2 mt-2 underline">
                    <a
                        href={clothing.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {clothing.Name}
                    </a>
                </div>
                <p className="text-base ml-2">
                    <span className="text-tertiary text-sm ">
                        {clothing.Brand}
                    </span>
                </p>
                <div className="flex justify-between items-center ml-2 mr-2">
                    <p className="text-xl">${clothing.Price.toFixed(2)}</p>
                    <div className="flex items-center">
                        <HandThumbUpIcon className="h-5 w-5 text-white" />{' '}
                        <span>{opinions.like_count}</span>
                        <HandThumbDownIcon className="h-5 w-5 text-white ml-3" />{' '}
                        <span>{opinions.dislike_count}</span>
                        <HeartIcon className="h-5 w-5 text-white ml-3" />{' '}
                        <span>{opinions.superlike_count}</span>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                <button className="bg-white text-primary rounded hover:bg-tertiary h-10 w-40 text-lg px-4"
                    onClick={() => onViewReviews(clothing)}
                >
                    <strong>View Reviews</strong>
                </button>
                </div>
            </div>
        </div>
    );
};

export default ClothingCard;
