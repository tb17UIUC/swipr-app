import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { readReview } from '../api/Reviews';

const ViewReviewModal = ({ open, onCancel, clothing }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            if (clothing && clothing.Clothing_Id) {
                try {
                    const response = await readReview(clothing.Clothing_Id);
                    setReviews(response); // Set the state with the fetched data
                } catch (error) {
                    console.error('Error fetching reviews:', error);
                }
            }
        };

        fetchReviews();
    }, [clothing]); // Re-run effect when clothing prop changes

    console.log(reviews);

    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>
                <strong>Reviews</strong> for {clothing?.Name} from <i>{clothing?.Brand}</i>
            </DialogTitle>
            <DialogContent>
                <div className="flex flex-col items-center">
                    <img
                        src={clothing?.Image}
                        alt={clothing?.Name}
                        className="w-32 h-32 object-cover rounded-md my-4"
                    />
                </div>
                <div>
                {reviews.map((item, index) => (
                    <div className="bg-tertiary text-white rounded-xl mb-4 p-4 relative" key={index}>
                        <p className="text-lg font-bold absolute top-2 left-4">Fit: {item.Fit}</p>
                        <div className="absolute top-2 right-4">
                            <div style={{ fontSize: '24px' }}>
                                {[...Array(item.Star_Rating)].map((_, i) => (
                                    <span key={i} className="text-yellow-500">&#9733;</span>
                                ))}
                            </div>
                        </div>
                        <p className="text-lg mt-10">{item.Text}</p>
                    </div>
                ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewReviewModal;
