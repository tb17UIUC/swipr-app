import React, { useState, useEffect } from 'react';
import ClothingCard from './ClothingCard'; // Ensure the component is correctly imported
import {
    HeartIcon,
    HandThumbDownIcon,
    AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/solid';
import { TailSpin } from 'react-loading-icons';
import { postOpinion } from '../api/Opinions';
import FilterPanel from './FilterPanel';
import Navbar from './Navbar';
import { getFilteredClothes, getMatches } from '../api/Clothes';
import { getFilterInfo } from '../api/FilterInfo';
import clsx from 'clsx';

export default function ClothesScreen({ userId }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [clothingItems, setClothingItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [filters, setFilters] = useState({ userId: userId });

    const [filterInfo, setFilterInfo] = useState({});

    // console.log(userId);

    const [panelState, setPanelState] = useState('closed');

    const toggleFilterPanel = () => {
        if (panelState === 'open' || panelState === 'opening') {
            setPanelState('closing');
            setTimeout(() => setPanelState('closed'), 300); // Corresponds to animation duration
        } else {
            setPanelState('opening');
            setTimeout(() => setPanelState('open'), 300);
        }
    };

    useEffect(() => {
        const fetchFilterInfo = async () => {
            try {
                const data = await getFilterInfo();
                const transformedData = {
                    ...data,
                    brands: data.brands.map((brand) => brand.Brand_Name),
                    maxPrice: data.maxPrice[0].maxPrice,
                    minPrice: data.minPrice[0].minPrice,
                };
                setFilterInfo(transformedData);
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
                if (filterKeys?.length === 1 && filterKeys.includes('userId')) {
                    data = await getMatches(filters);
                } else {
                    data = await getFilteredClothes(filters);
                }

                setClothingItems(data);
            } catch (error) {
                console.error('Error fetching clothes:', error);
            }
        };

        setIsLoading(true);
        // console.log(filters);
        fetchClothes();
        setIsLoading(false);
    }, [filters]);

    const handleSwipe = async (opinion) => {
        if (clothingItems?.length > 0 && currentIndex < clothingItems?.length) {
            const currentClothingItem = clothingItems[currentIndex];

            if (currentClothingItem) {
                await postOpinion({
                    userId: userId,
                    clothingId: currentClothingItem.Clothing_Id,
                    opinionType: opinion === 'l' ? 'L' : 'D',
                });
            }

            if (currentIndex < clothingItems?.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                console.log('Reached the end of the list');
            }
        }
    };

    return isLoading ? (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-lg font-medium mb-2">
                Fetching recommendations!
            </p>
            <TailSpin stroke="#4A90E2" /> {/* Customize the color as needed */}
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center h-screen">
            <Navbar />
            <div className="fixed top-14 right-0 p-5">
                <button
                    onClick={toggleFilterPanel}
                    className="bg-primary hover:bg-tertiary rounded-full p-5 shadow-lg"
                >
                    <AdjustmentsHorizontalIcon className="h-6 w-6 text-white" />
                </button>
            </div>
            {panelState !== 'closed' && (
                <div
                    className={clsx(
                        'absolute right-0 w-96 bg-gray-100 shadow-lg top-16 bottom-0 rounded-l-xl border-2 border-primary',
                        {
                            'filter-panel-entering': panelState === 'opening',
                            'filter-panel-exiting': panelState === 'closing',
                        }
                    )}
                >
                    <FilterPanel
                        setFilters={setFilters}
                        userId={userId}
                        brands={filterInfo.brands}
                        universities={filterInfo.universities}
                        minPrice={filterInfo.minPrice}
                        maxPrice={filterInfo.maxPrice}
                        closePanel={toggleFilterPanel}
                    />
                </div>
            )}
            <div className="container  w-5/12 flex flex-row items-center justify-center h-full mt-2 mb-2">
                <button
                    onClick={() => handleSwipe('l')}
                    className="bg-primary hover:bg-tertiary rounded-full p-5 shadow-lg mr-4"
                >
                    <HandThumbDownIcon className="h-6 w-6 text-white" />
                </button>
                <div className="h-full w-full">
                    {clothingItems?.length > 0 &&
                        currentIndex < clothingItems?.length && (
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
        </div>
    );
}
