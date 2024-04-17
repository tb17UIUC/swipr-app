import React, { useState, useEffect } from 'react';
import ClothingCard from './ClothingCard'; // Ensure the component is correctly imported
import { HeartIcon, HandThumbDownIcon } from '@heroicons/react/24/solid';

export default function ClothesScreen({ clothingItemList }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [clothingItems, setClothingItems] = useState([]);

    useEffect(() => {
        setClothingItems(clothingItemList); // Simplified use of state
    }, [clothingItemList]);

    const handleSwipe = async (opinion) => {
        if (currentIndex < clothingItems.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            console.log('Reached the end of the list');
        }

        const currentClothingItem = clothingItems[currentIndex];
        if (currentClothingItem) {
            await postOpinion({
                userId: userId,
                clothingId: currentClothingItem.Clothing_Id,
                opinionType: opinion === 'l' ? 'L' : 'D',
            });
        }
    };

    return (
        <div className="relative flex flex-row items-center justify-center">
            {/* Navigation buttons with Heroicons */}
            <button
                onClick={() => handleSwipe('l')}
                className="bg-primary hover:bg-tertiary rounded-full p-5 shadow-lg mr-4"
            >
                <HandThumbDownIcon className="h-6 w-6 text-white" />
            </button>
            <div className="bg-gray-200">
                {clothingItems.length > 0 &&
                    currentIndex < clothingItems.length && (
                        <ClothingCard clothing={clothingItems[currentIndex]} />
                    )}
            </div>
            <button
                onClick={() => handleSwipe('d')}
                className="bg-primary hover:bg-tertiary rounded-full p-5 shadow-lg ml-4"
            >
                <HeartIcon className="h-6 w-6 text-white" />
            </button>
        </div>
    );
}
