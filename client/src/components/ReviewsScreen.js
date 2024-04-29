import Navbar from './Navbar';
import FilterReviewModal from './FilterReview';
import React, { useEffect, useState } from 'react';
import { filterReview } from '../api/Reviews';

export default function ReviewsScreen() {
    const handleFilterReview = async (filters) => {
        console.log(filters);
        try {
            const response = await filterReview(filters);
            console.log(response); // Log the response
        } catch (error) {
            console.error('Failed to retrieve review:', error);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div
                className="flex items-center justify-center flex-grow"
                style={{
                    backgroundImage: `url(${require('../assets/welcome-page-bg.png')})`,
                }}
            >
                <FilterReviewModal
                    filterReviewFunc={handleFilterReview}
                ></FilterReviewModal>
            </div>
        </div>
    );
}
