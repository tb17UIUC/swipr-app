import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Slider from 'react-slider';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';

export default function FilterPanel({
    setFilters,
    brands,
    universities,
    minPrice,
    maxPrice,
}) {
    const [localFilters, setLocalFilters] = useState({
        brand: [],
        university: '',
        priceRange: [minPrice, maxPrice],
        type: [],
        stars: 1,
    });

    const handleApplyFilters = () => {
        setFilters(localFilters);
    };

    return (
        <div className="fixed right-0 top-0 h-full bg-white shadow-lg w-96 p-4 transform transition-transform translate-x-full">
            <button className="text-right">
                <AdjustmentsHorizontalIcon className="h-6 w-6" />
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
                            brand: selectedOptions.map(
                                (option) => option.value
                            ),
                        }))
                    }
                />
            </div>
            <div className="my-4">
                <label>Universities</label>
                <Select
                    options={universities.map((university) => ({
                        value: university,
                        label: university,
                    }))}
                    onInputChange={(inputValue) =>
                        setLocalFilters((prev) => ({
                            ...prev,
                            university: inputValue,
                        }))
                    }
                    onChange={(selectedOption) =>
                        setLocalFilters((prev) => ({
                            ...prev,
                            university: selectedOption.value,
                        }))
                    }
                />
            </div>
            <div className="my-4">
                <label>Price Range</label>
                <Slider
                    min={minPrice}
                    max={maxPrice}
                    value={localFilters.priceRange}
                    onChange={(value) =>
                        setLocalFilters((prev) => ({
                            ...prev,
                            priceRange: value,
                        }))
                    }
                    withTracks
                />
                <div className="flex justify-between text-xs">
                    <span>${localFilters.priceRange[0]}</span>
                    <span>${localFilters.priceRange[1]}</span>
                </div>
            </div>
            <div className="my-4">
                <label>Type</label>
                <Select
                    isMulti
                    options={[
                        { value: 'tops', label: 'Tops' },
                        { value: 'bottoms', label: 'Bottoms' },
                        { value: 'outerwear', label: 'Outerwear' },
                    ]}
                    onChange={(selectedOptions) =>
                        setLocalFilters((prev) => ({
                            ...prev,
                            type: selectedOptions.map((option) => option.value),
                        }))
                    }
                />
            </div>
            <div className="my-4">
                <label>Stars</label>
                <Slider
                    min={1}
                    max={5}
                    value={localFilters.stars}
                    onChange={(value) =>
                        setLocalFilters((prev) => ({ ...prev, stars: value }))
                    }
                    withTracks
                />
                <div className="text-center">{localFilters.stars} Stars</div>
            </div>
            <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleApplyFilters}
            >
                Set Filters
            </button>
        </div>
    );
}
