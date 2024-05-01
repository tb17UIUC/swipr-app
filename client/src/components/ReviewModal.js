import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import ReactStars from 'react-rating-stars-component';
import { useUser } from '../UserContext';
import { createReview } from '../api/Reviews';

const ReviewModal = ({ open, onCancel, onPost, clothing }) => {
    const { user } = useUser();
    const customerId = user.customerId || 1;
    const [reviewText, setReviewText] = useState('');
    const [stars, setStars] = useState(null);
    const [fit, setFit] = useState(null);

    const handleReviewSubmit = () => {
        const reviewInfo = {
            customerId: customerId,
            clothingId: clothing.Clothing_Id,
            brand: clothing.Brand,
            starRating: stars,
            fit: fit,
            text: reviewText,
        };

        // console.log(reviewInfo);

        createReview(reviewInfo)
            .then(() => {
                onPost();
                console.log('Review submitted successfully');
            })
            .catch((err) => {
                console.error('Failed to submit review:', err);
            });
    };

    const handleRatingChange = (newRating) => {
        setStars(newRating);
    };

    const handleFitChange = (event) => {
        setFit(event.target.value);
    };

    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogContent>
                <div className="flex flex-col items-center">
                    <img
                        src={clothing.Image}
                        alt={clothing.Name}
                        className="w-32 h-32 object-cover rounded-md my-4"
                    />
                    <p className="text-lg">
                        {clothing.Name} - ${clothing.Price.toFixed(2)}
                    </p>
                    <div className="flex flex-row w-full justify-between">
                        <ReactStars
                            count={5}
                            onChange={handleRatingChange}
                            size={24}
                            activeColor="#ffd700"
                            className="flex-grow"
                        />
                        <FormControl
                            size="medium"
                            variant="outlined"
                            className="w-40"
                        >
                            <InputLabel id="fit-label">Fit</InputLabel>
                            <Select
                                labelId="fit-label"
                                value={fit}
                                label="Fit"
                                onChange={handleFitChange}
                            >
                                <MenuItem value={null}></MenuItem>
                                <MenuItem value="Small">Small</MenuItem>
                                <MenuItem value="Perfect">Perfect</MenuItem>
                                <MenuItem value="Large">Large</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Your Review"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        multiline
                        rows={4}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={handleReviewSubmit}>Submit Review</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReviewModal;
