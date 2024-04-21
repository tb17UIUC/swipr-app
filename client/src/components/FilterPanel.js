import React, { useState } from 'react';
import Select from 'react-select';
import { Slider } from '@mui/material';
// import ReactSlider from 'react-slider';
import { XCircleIcon } from '@heroicons/react/24/solid';

export default function FilterPanel({
    setFilters,
    customerId,
    brands,
    universities,
    minPrice,
    maxPrice,
    closePanel,
}) {
    const [localFilters, setLocalFilters] = useState({
        customerId: customerId,
        brands: [],
        universities: [],
        priceRange: [minPrice, maxPrice],
        type: [],
        stars: 1,
    });

    const handleApplyFilters = () => {
        setFilters(localFilters);
        closePanel(); // Call this function when filters are set
    };

    const handlePriceChange = (event, newValue) => {
        setLocalFilters((prev) => ({
            ...prev,
            priceRange: newValue,
        }));
    };

    const handleStarChange = (event, newValue) => {
        setLocalFilters((prev) => ({
            ...prev,
            stars: newValue,
        }));
    };

    return (
        <div className="m-4">
            <button className="text-right" onClick={() => closePanel()}>
                <XCircleIcon className="h-6 w-6" />
            </button>
            <div className="my-4">
                <label>Brand</label>
                <Select
                    isMulti
                    options={brands.map((brand) => ({
                        value: brand,
                        label: brand,
                    }))}
                    onChange={(selectedOptions) =>
                        setLocalFilters((prev) => ({
                            ...prev,
                            brands: selectedOptions.map(
                                (option) => option.value
                            ),
                        }))
                    }
                />
            </div>
            <div className="my-4">
                <label>Universities</label>
                <Select
                    isMulti
                    options={universities.map((university) => ({
                        value: university, // Here you store the full object
                        label: university.University_Name, // Display the name only
                    }))}
                    onChange={(selectedOptions) =>
                        setLocalFilters((prev) => ({
                            ...prev,
                            universities: selectedOptions.map(
                                (option) => option.value.University_Id
                            ),
                        }))
                    }
                    menuPlacement="auto"
                />
            </div>
            <div className="my-4">
                <label>Price Range</label>
                <Slider
                    value={localFilters.priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={minPrice}
                    max={maxPrice}
                />
                <div className="flex justify-between text-s">
                    <span>${minPrice}</span>
                    <span>${maxPrice}</span>
                </div>
            </div>
            <div className="my-4">
                <label>Type</label>
                <Select
                    isMulti
                    options={[
                        { value: 'Tops', label: 'Tops' },
                        { value: 'Bottoms', label: 'Bottoms' },
                        { value: 'Outerwear', label: 'Outerwear' },
                    ]}
                    onChange={(selectedOptions) =>
                        setLocalFilters((prev) => ({
                            ...prev,
                            type: selectedOptions.map((option) => option.value),
                        }))
                    }
                    menuPlacement="auto"
                />
            </div>
            <div className="my-4">
                <label>Minimum Star Rating</label>
                <Slider
                    value={localFilters.stars}
                    onChange={handleStarChange}
                    valueLabelDisplay="auto"
                    min={1}
                    max={5}
                    step={1}
                />
            </div>
            <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl mx-auto block"
                onClick={handleApplyFilters}
            >
                Set Filters
            </button>
        </div>
    );
}
