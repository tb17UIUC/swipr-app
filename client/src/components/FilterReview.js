import React, { useState } from 'react';
import { Slider } from '@mui/material';

const FilterReviewModal = ({ filterReviewFunc, onClose }) => {
    // State variables to hold the values
    const [maxPrice, setMaxPrice] = useState(999); // Default value for maxPrice
    const [minPrice, setMinPrice] = useState(9.9); // Default value for minPrice
    const [sustainability, setSustainability] = useState(0); // Default value for sustainability
    const [brand, setBrand] = useState('Nike'); // Default value for brand
    const [madeInUSA, setMadeInUSA] = useState(false); // Default value for madeInUSA
    const [minorityOwned, setMinorityOwned] = useState(false); // Default value for minorityOwned
    const [starRating, setStarRating] = useState(0); // Default value for starRating

    const FilterArray = () => {
        const madeInUSAInt = madeInUSA ? 1 : 0;
        const minorityOwnedInt = minorityOwned ? 1 : 0;
        return {
            MaxPrice: maxPrice,
            MinPrice: minPrice,
            Sustainability: sustainability,
            Brand: brand,
            MIUSA: madeInUSAInt,
            MO: minorityOwnedInt,
            Star_Rating: starRating,
        };
    };

    // Event handlers to update the state variables
    const handleMaxPriceChange = (event, newValue) => {
        setMaxPrice(newValue);
    };

    const handleMinPriceChange = (event, newValue) => {
        setMinPrice(newValue);
    };

    const handleSustainabilityChange = (event, newValue) => {
        setSustainability(newValue);
    };

    const handleBrandChange = (event) => {
        setBrand(event.target.value);
    };

    const handleMadeInUSAChange = (event) => {
        setMadeInUSA(event.target.checked);
    };

    const handleMinorityOwnedChange = (event) => {
        setMinorityOwned(event.target.checked);
    };

    const handleStarRatingChange = (event, newValue) => {
        setStarRating(newValue);
    };

    // console.log(FilterArray());

    return (
        <div
            className="bg-primary text-white rounded-xl mb-4 p-6"
            style={{ height: '565px', width: '570px', fontSize: '1.2rem' }}
        >
            <h2
                className="text-xlg font-bold text-center"
                style={{ fontSize: '1.5rem' }}
            >
                Review Filters
            </h2>
            <div className="mb-1">
                <label className="block">Price Range:</label>
                <Slider
                    value={[minPrice, maxPrice]}
                    onChange={(event, newValue) => {
                        handleMinPriceChange(event, newValue[0]);
                        handleMaxPriceChange(event, newValue[1]);
                    }}
                    min={9.9}
                    max={999}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                />
                <div
                    className="flex justify-between text-sm"
                    style={{ fontSize: '1.0rem' }}
                >
                    <span>$9.90</span>
                    <span>$999.00</span>
                </div>
            </div>

            <div className="mb-1">
                <label className="block mb-2">Sustainability:</label>
                <Slider
                    value={sustainability}
                    onChange={handleSustainabilityChange}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                />
                <div
                    className="flex justify-between text-sm"
                    style={{ fontSize: '1.0rem' }}
                >
                    <span>0</span>
                    <span>100</span>
                </div>
            </div>

            <hr
                style={{
                    backgroundColor: 'white',
                    height: '2px',
                    border: 'none',
                    margin: '10px 0',
                }}
            />

            <div>
                <label className="block mb-2">Brand: </label>
                <select
                    className="mb-2"
                    value={brand}
                    onChange={handleBrandChange}
                    style={{ color: 'black' }}
                >
                    <option value="Nike">Nike</option>
                    <option value="Adidas">Adidas</option>
                    <option value="Patagonia">Patagonia</option>
                    <option value="Uniqlo">Uniqlo</option>
                </select>
            </div>

            <div>
                <label className="block mb-2">
                    Made in USA:
                    <input
                        type="checkbox"
                        checked={madeInUSA}
                        onChange={handleMadeInUSAChange}
                        style={{
                            marginLeft: '0.5rem',
                            transform: 'scale(1.5)',
                        }}
                    />
                </label>
            </div>

            <div className="mb-2"></div>

            <div>
                <label className="block mb-2">
                    Minority Owned:
                    <input
                        type="checkbox"
                        checked={minorityOwned}
                        onChange={handleMinorityOwnedChange}
                        style={{
                            marginLeft: '0.5rem',
                            transform: 'scale(1.5)',
                        }}
                    />
                </label>
            </div>

            <div className="mb-6">
                <label className="block mb-2">Minimum Star Rating:</label>
                <Slider
                    value={starRating}
                    onChange={handleStarRatingChange}
                    min={1}
                    max={5}
                    step={1}
                    valueLabelDisplay="auto"
                    aria-labelledby="star-rating-slider"
                />
                <div
                    className="flex justify-between text-sm"
                    style={{ fontSize: '1.0rem' }}
                >
                    <span>1</span>
                    <span>5</span>
                </div>
                <div className="flex justify-center items-center">
                    <button
                        className="bg-white text-primary rounded hover:bg-tertiary h-10 w-40 text-lg px-4"
                        onClick={() => {filterReviewFunc(FilterArray()); onClose()}}
                    >
                        <strong>View Reviews</strong>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterReviewModal;
