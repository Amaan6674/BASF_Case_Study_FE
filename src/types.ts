// User interface
export interface IUser {
    username: string;
    initials: string;
}

// Book interface based on Google Books API
export interface IBook {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        categories?: string[];
        averageRating?: number;
        description?: string;
        imageLinks?: {
            thumbnail?: string;
            smallThumbnail?: string;
        };
        publishedDate?: string;
        publisher?: string;
    };
}

// Review interface for Redux store
export interface IReview {
    bookId: string;
    rating: number;
    reviewText: string;
    userInitials: string;
    timestamp: number;
}

// Redux state interface
export interface IReviewsState {
    reviews: Record<string, IReview[]>;
}
