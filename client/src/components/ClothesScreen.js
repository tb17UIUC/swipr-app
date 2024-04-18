import React, { useState, useEffect } from 'react';
import ClothingCard from './ClothingCard'; // Ensure the component is correctly imported
import {
    HeartIcon,
    HandThumbDownIcon,
    AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/solid';
import { postOpinion } from '../api/Opinions';
import FilterPanel from './FilterPanel';
import Navbar from './Navbar';
import { getFilteredClothes, getMatches } from '../api/Clothes';
import { getFilterInfo } from '../api/FilterInfo';

export default function ClothesScreen({ userId }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [clothingItems, setClothingItems] = useState([]);
    const [filterPanelVisible, setFilterPanelVisible] = useState(false);

    const [filters, setFilters] = useState({ userId: userId });

    const [filterInfo, setFilterInfo] = useState({});

    // console.log(userId);

    useEffect(() => {
        const fetchFilterInfo = async () => {
            try {
                const data = await getFilterInfo();
                setFilterInfo(data);
            } catch (error) {
                console.error('Error fetching filter info:', error);
            }
        };
        fetchFilterInfo();
    }, []);

    useEffect(() => {
        const fetchClothes = async () => {
            try {
                let data;
                const filterKeys = Object.keys(filters);

                // Check if only 'userId' is present
                if (filterKeys.length === 1 && filterKeys.includes('userId')) {
                    data = await getMatches(filters);
                } else {
                    data = await getFilteredClothes(filters);
                }

                setClothingItems(data);
            } catch (error) {
                console.error('Error fetching clothes:', error);
            }
        };

        fetchClothes();
    }, [filters]);

    const handleSwipe = async (opinion) => {
        if (clothingItems?.length > 0 && currentIndex < clothingItems.length) {
            const currentClothingItem = clothingItems[currentIndex];

            if (currentClothingItem) {
                await postOpinion({
                    userId: userId,
                    clothingId: currentClothingItem.Clothing_Id,
                    opinionType: opinion === 'l' ? 'L' : 'D',
                });
            }

            if (currentIndex < clothingItems.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                console.log('Reached the end of the list');
            }
        }
    };

    const toggleFilterPanel = () => setFilterPanelVisible(!filterPanelVisible);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Navbar />
            <div className="flex flex-row">
                <div className="container  w-5/12 flex flex-row items-center justify-center h-full mt-2 mb-2">
                    <button
                        onClick={() => handleSwipe('l')}
                        className="bg-primary hover:bg-tertiary rounded-full p-5 shadow-lg mr-4"
                    >
                        <HandThumbDownIcon className="h-6 w-6 text-white" />
                    </button>
                    <div className="h-full w-full">
                        {clothingItems.length > 0 &&
                            currentIndex < clothingItems.length && (
                                <ClothingCard
                                    clothing={clothingItems[currentIndex]}
                                />
                            )}
                    </div>
                    <button
                        onClick={() => handleSwipe('d')}
                        className="bg-primary hover:bg-tertiary rounded-full p-5 shadow-lg ml-4"
                    >
                        <HeartIcon className="h-6 w-6 text-white" />
                    </button>
                </div>
                <button
                    onClick={() => handleSwipe('l')}
                    className="bg-primary hover:bg-tertiary rounded-full p-5 shadow-lg mr-4"
                ></button>
                <button onClick={toggleFilterPanel} className="p-2 m-2">
                    <AdjustmentsHorizontalIcon className="h-6 w-6 text-white" />
                </button>
                {filterPanelVisible && (
                    <FilterPanel
                        setFilters={setFilters}
                        brands={filterInfo.brands}
                        universities={filterInfo.universities}
                        minPrice={filterInfo.minPrice}
                        maxPrice={filterInfo.maxPrice}
                    />
                )}
            </div>
        </div>
    );
}
