import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    TextField,
    Rating,
    Divider,
    CircularProgress,
    Card,
    CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IBook, IUser, IReview } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addReview } from '../store/reviewsSlice';

const BookDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [book, setBook] = useState<IBook | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const [rating, setRating] = useState<number>(0);
    const [reviewText, setReviewText] = useState<string>('');
    const [submitError, setSubmitError] = useState<string>('');

    const user: IUser | null = JSON.parse(sessionStorage.getItem('user') || 'null');
    const bookReviews = useAppSelector((state) =>
        id ? state.reviews.reviews[id] || [] : []
    );

    // Find current user's existing review
    const existingUserReview = bookReviews.find(
        review => review.userInitials === user?.initials
    );

    useEffect(() => {
        const fetchBookDetails = async () => {
            if (!id) {
                setError('No book ID provided');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get<IBook>(
                    `https://www.googleapis.com/books/v1/volumes/${id}`
                );
                setBook(response.data);
            } catch (err) {
                setError('Failed to fetch book details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

    // Load existing review into form when available
    useEffect(() => {
        if (existingUserReview) {
            setRating(existingUserReview.rating);
            setReviewText(existingUserReview.reviewText);
        }
    }, [existingUserReview]);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');

        if (rating === 0) {
            setSubmitError('Please select a rating');
            return;
        }

        if (!reviewText.trim()) {
            setSubmitError('Please write a review');
            return;
        }

        if (!id || !user) {
            setSubmitError('Unable to submit review');
            return;
        }

        const newReview: IReview = {
            bookId: id,
            rating,
            reviewText: reviewText.trim(),
            userInitials: user.initials,
            timestamp: Date.now()
        };

        dispatch(addReview(newReview));

        // Reset form
        setRating(0);
        setReviewText('');
    };

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error || !book) {
        return (
            <Container maxWidth="md">
                <Box sx={{ py: 4 }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                    </Button>
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error || 'Book not found'}
                    </Typography>
                </Box>
            </Container>
        );
    }

    const { volumeInfo } = book;

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/dashboard')}
                    sx={{ mb: 3 }}
                >
                    Back to Dashboard
                </Button>

                <Paper sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                        {volumeInfo.imageLinks?.thumbnail && (
                            <Box sx={{ flexShrink: 0 }}>
                                <img
                                    src={volumeInfo.imageLinks.thumbnail}
                                    alt={volumeInfo.title}
                                    style={{ width: '200px', height: 'auto', borderRadius: '8px' }}
                                />
                            </Box>
                        )}

                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h4" component="h1" gutterBottom>
                                {volumeInfo.title}
                            </Typography>

                            {volumeInfo.authors && (
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    by {volumeInfo.authors.join(', ')}
                                </Typography>
                            )}

                            {volumeInfo.categories && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    <strong>Genre:</strong> {volumeInfo.categories.join(', ')}
                                </Typography>
                            )}

                            {volumeInfo.publisher && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    <strong>Publisher:</strong> {volumeInfo.publisher}
                                </Typography>
                            )}

                            {volumeInfo.publishedDate && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    <strong>Published:</strong> {volumeInfo.publishedDate}
                                </Typography>
                            )}

                            {volumeInfo.averageRating && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                                    <Rating value={volumeInfo.averageRating} readOnly precision={0.1} />
                                    <Typography variant="body2" color="text.secondary">
                                        ({volumeInfo.averageRating.toFixed(1)})
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {volumeInfo.description && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Description
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                                {volumeInfo.description}
                            </Typography>
                        </Box>
                    )}

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h5" gutterBottom>
                        {existingUserReview ? 'Edit Your Review' : 'Add Your Review'}
                    </Typography>

                    {existingUserReview && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            You already reviewed this book. Submitting will update your existing review.
                        </Typography>
                    )}

                    <Box component="form" onSubmit={handleSubmitReview} sx={{ mt: 2 }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography component="legend" gutterBottom>
                                Rating
                            </Typography>
                            <Rating
                                value={rating}
                                onChange={(_, newValue) => setRating(newValue || 0)}
                                size="large"
                            />
                        </Box>

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Your Review"
                            variant="outlined"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        {submitError && (
                            <Typography color="error" sx={{ mb: 2 }}>
                                {submitError}
                            </Typography>
                        )}

                        <Button type="submit" variant="contained" size="large">
                            {existingUserReview ? 'Update Review' : 'Submit Review'}
                        </Button>
                    </Box>

                    {bookReviews.length > 0 && (
                        <>
                            <Divider sx={{ my: 4 }} />
                            <Typography variant="h5" gutterBottom>
                                Reviews ({bookReviews.length})
                            </Typography>

                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {bookReviews.map((review, index) => (
                                    <Card key={index} variant="outlined">
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="subtitle2" color="primary">
                                                    {review.userInitials}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(review.timestamp).toLocaleString()}
                                                </Typography>
                                            </Box>
                                            <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
                                            <Typography variant="body2">
                                                {review.reviewText}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default BookDetails;
