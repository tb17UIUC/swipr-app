import React, { useState, useEffect } from 'react';
import ClothingCard from './ClothingCard'; // Assuming you have a ClothingCard component

// Correct the function parameter to use destructuring for props
export default function ClothesScreen({ clothingItemList }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [clothingItems, setClothingItems] = useState([]);

    useEffect(() => {
        // Set the clothing items from the props
        setCurrentIndex(0);
        setClothingItems(clothingItemList);
    }, [clothingItemList]); // Ensure clothingItemList is in the dependency array

    const handleSwipe = (opinion) => {
        if (currentIndex < clothingItems.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            console.log('Reached the end of the list');
        }

        if (opinion === 'l') {
            console.log('Liked item');
        } else if (opinion === 'd') {
            console.log('Disliked item');
        }
    };

    return (
        <div className="relative flex h-screen items-center justify-center">
            <div className="absolute inset-0 bg-gray-200">
                {clothingItems.length > 0 &&
                    currentIndex < clothingItems.length && (
                        <ClothingCard clothing={clothingItems[currentIndex]} />
                    )}
            </div>
            {/* Navigation buttons */}
            <button
                onClick={() => handleSwipe('l')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-lime-500 hover:bg-lime-600 rounded-full p-4 shadow-lg"
            >
                {/* Left arrow icon */}
            </button>
            <button
                onClick={() => handleSwipe('d')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-lime-500 hover:bg-lime-600 rounded-full p-4 shadow-lg"
            >
                {/* Right arrow icon */}
            </button>
        </div>
    );
}
