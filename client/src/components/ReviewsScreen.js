import Navbar from './Navbar';
import FilterReviewModal from './FilterReview';
import { filterReview } from '../api/Reviews';
import React, { useState } from 'react';
import { TailSpin } from 'react-loading-icons';
import { useUser } from '../UserContext';

export default function ReviewsScreen() {
    const { user } = useUser();
    console.log(user);
    const [filterInfo, setFilterInfo] = useState({});
    const [showFilterModal, setShowFilterModal] = useState(true);
    const [showAdditionalBox, setShowAdditionalBox] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleFilterReview = async (filters) => {
        setShowFilterModal(false);
        setIsLoading(true);
        try {
            const response = await filterReview(filters);
            setFilterInfo(response[0]);
            setShowAdditionalBox(true);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to retrieve review:', error);
        }
    };
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-screen">
                    <p className="text-lg font-medium mb-2">
                        Fetching reviews!
                    </p>
                    <TailSpin stroke="#4DCCBD" />
                </div>
            ) : (
                <div
                    className="flex items-center justify-center flex-grow"
                    style={{
                        backgroundImage: `url(${require('../assets/welcome-page-bg.png')})`,
                    }}
                >
                    {showFilterModal && (
                        <FilterReviewModal
                            filterReviewFunc={handleFilterReview}
                            onClose={() => setShowFilterModal(false)}
                        />
                    )}
                    {showAdditionalBox && (
                        <div>
                            <AdditionalBox filterInfo={filterInfo} />
                            {
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <button
                                        className="bg-white text-primary font-semibold hover:bg-tertiary py-2 px-4 rounded-lg shadow ml-4"
                                        onClick={() => window.location.reload()}
                                    >
                                        Filter Reviews Again!
                                    </button>
                                </div>
                            }
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const AdditionalBox = ({ filterInfo }) => {
    return (
        <div
            className="bg-white text-black rounded-xl mb-4 p-6 overflow-auto"
            style={{ maxWidth: '1000px', maxHeight: '80vh' }}
        >
            {filterInfo.length === 0 ? (
                <p className="text-center text-lg">
                    <strong>
                        Sorry, we couldn't find any reviews with those filters
                    </strong>
                </p>
            ) : (
                filterInfo.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-200 rounded-xl mb-4 p-6 flex"
                        style={{ maxWidth: '600px' }}
                    >
                        <div
                            className="flex flex-col justify-center items-center mr-6"
                            style={{ width: '50%' }}
                        >
                            <h2 className="text-xl font-bold text-center mb-4">
                                Review for <strong>{item.Name}</strong> from{' '}
                                <i>{item.Brand}</i>
                            </h2>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <img
                                    src={item.Image}
                                    alt={item.Name}
                                    className="max-w-xs max-h-48 rounded-lg mb-2"
                                />
                                <p>
                                    <strong>Price:</strong> ${item.Price}
                                </p>
                            </div>
                        </div>
                        <div
                            className="border-l-2 border-solid border-gray-400 pl-6"
                            style={{ width: '50%' }}
                        >
                            <p>
                                <strong>Star Rating:</strong>{' '}
                                <span style={{ color: 'yellow' }}>
                                    {'★'.repeat(Math.floor(item.Star_Rating))}
                                </span>
                            </p>
                            <p>
                                <strong>Avg Star Rating:</strong>{' '}
                                <span style={{ color: 'yellow' }}>
                                    {'★'.repeat(
                                        Math.floor(item.Avg_Star_Rating)
                                    )}
                                </span>
                            </p>
                            <p>
                                <strong>Clothing ID:</strong> {item.Clothing_Id}
                            </p>
                            <p>
                                <strong>Made in USA:</strong>{' '}
                                <span
                                    className={
                                        item.Made_In_USA
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }
                                >
                                    {item.Made_In_USA ? 'Yes' : 'No'}
                                </span>
                            </p>
                            <p>
                                <strong>Minority Owned:</strong>{' '}
                                <span
                                    className={
                                        item.Minority_Owned
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }
                                >
                                    {item.Minority_Owned ? 'Yes' : 'No'}
                                </span>
                            </p>
                            <p>
                                <strong>Sustainability:</strong>{' '}
                                {item.Sustainability}%
                            </p>
                            <p>
                                <strong></strong> {item.Text}
                            </p>
                            <a
                                href={item.URL}
                                className="block text-center mt-4 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Product
                            </a>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
