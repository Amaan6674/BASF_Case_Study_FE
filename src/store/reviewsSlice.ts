import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IReview, IReviewsState } from '../types';

const initialState: IReviewsState = {
    reviews: {}
};

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        addReview: (state, action: PayloadAction<IReview>) => {
            const { bookId, userInitials } = action.payload;
            if (!state.reviews[bookId]) {
                state.reviews[bookId] = [];
            }

            // Find if user already has a review for this book
            const existingReviewIndex = state.reviews[bookId].findIndex(
                review => review.userInitials === userInitials
            );

            if (existingReviewIndex !== -1) {
                // Update existing review
                state.reviews[bookId][existingReviewIndex] = action.payload;
            } else {
                // Add new review
                state.reviews[bookId].push(action.payload);
            }
        },
        clearReviews: (state) => {
            state.reviews = {};
        }
    }
});

export const { addReview, clearReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;
