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
import { useUser } from '../UserContext';
import { useSpring, animated } from 'react-spring';
import ViewReviewModal from './ViewReviewModal';

export default function ClothesScreen() {
    const { user } = useUser();
    const customerId = user.customerId || 1; // 1 for testing

    const [currentIndex, setCurrentIndex] = useState(0);
    const [clothingItems, setClothingItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [filters, setFilters] = useState({ customerId: customerId });

    const [filterInfo, setFilterInfo] = useState({});

    const [{ x, opacity }, set] = useSpring(() => ({ x: 0, opacity: 1 }));

    const [panelState, setPanelState] = useState('closed');

    const [viewReviewOpen, setViewReviewOpen] = useState(false);
    const [selectedClothingForViewReview, setSelectedClothingForViewReview] =
        useState(null);

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

                // Check if only 'customerId' is present
                if (
                    filterKeys?.length === 1 &&
                    filterKeys.includes('customerId')
                ) {
                    data = await getMatches(filters);
                } else {
                    data = await getFilteredClothes(filters);
                }

                setClothingItems(data);
                setCurrentIndex(0);
            } catch (error) {
                console.error('Error fetching clothes:', error);
            }
        };

        setIsLoading(true);
        // console.log(filters);
        fetchClothes();
        setIsLoading(false);
    }, [filters]);

    const handleSwipe = async (direction) => {
        if (currentIndex < clothingItems.length) {
            const currentClothingItem = clothingItems[currentIndex];
            if (currentClothingItem) {
                await postOpinion({
                    customerId: customerId,
                    clothingId: currentClothingItem.Clothing_Id,
                    opinionType: direction === 'left' ? 'D' : 'L',
                });
            }

            // Trigger faster animation: move and fade out
            set({
                x: direction === 'left' ? -1000 : 1000,
                opacity: 0,
                immediate: false,
                config: { duration: 200 }, // Faster animation
                onRest: () => {
                    if (currentIndex < clothingItems.length - 1) {
                        setCurrentIndex(currentIndex + 1);
                        set({ x: 0, opacity: 1, immediate: true });
                    } else {
                        console.log('Reached the end of the list');
                    }
                },
            });
        }
    };

    const handleViewReviews = (clothing) => {
        setSelectedClothingForViewReview(clothing);
        setViewReviewOpen(true);
    };

    const handleCancelViewReviewModal = () => {
        setSelectedClothingForViewReview(null);
        setViewReviewOpen(false);
    };

    return isLoading ? (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-lg font-medium mb-2">
                Fetching recommendations!
            </p>
            <TailSpin stroke="#4DCCBD" />
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center h-screen">
            {selectedClothingForViewReview && (
                <ViewReviewModal
                    open={viewReviewOpen}
                    onCancel={handleCancelViewReviewModal}
                    clothing={selectedClothingForViewReview}
                />
            )}
            <Navbar />
            <div className="fixed top-16 right-0 p-5">
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
                        'absolute right-0 w-96 bg-gray-100 shadow-lg top-20 bottom-2 rounded-l-xl border-2 border-primary overflow-auto',
                        {
                            'filter-panel-entering': panelState === 'opening',
                            'filter-panel-exiting': panelState === 'closing',
                        }
                    )}
                >
                    <FilterPanel
                        setFilters={setFilters}
                        customerId={customerId}
                        brands={filterInfo.brands}
                        universities={filterInfo.universities}
                        minPrice={filterInfo.minPrice}
                        maxPrice={filterInfo.maxPrice}
                        closePanel={toggleFilterPanel}
                    />
                </div>
            )}
            <div className="container w-5/12 flex flex-row items-center justify-center h-full mt-2 mb-2">
                <button
                    onClick={() => handleSwipe('left')}
                    className="bg-primary hover:bg-tertiary rounded-full p-5 shadow-lg mr-4"
                >
                    <HandThumbDownIcon className="h-6 w-6 text-white" />
                </button>
                {clothingItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full bg-gray-200 rounded-xl">
                        <p className="text-lg font-medium mt-4 p-4">
                            No clothes found. Try adjusting your filters!
                        </p>
                    </div>
                ) : (
                    <animated.div
                        style={{ x, opacity }}
                        className="h-full w-full"
                    >
                        {currentIndex < clothingItems.length && (
                            <ClothingCard
                                clothing={clothingItems[currentIndex]}
                                onViewReviews={handleViewReviews}
                            />
                        )}
                    </animated.div>
                )}
                <button
                    onClick={() => handleSwipe('right')}
                    className="bg-primary hover:bg-tertiary rounded-full p-5 shadow-lg ml-4"
                >
                    <HeartIcon className="h-6 w-6 text-white" />
                </button>
            </div>
        </div>
    );
}
