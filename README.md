# Book Recommendation System

A React-based book recommendation application built with TypeScript, Material UI, and Redux Toolkit.

## Features

- **Authentication**: Login with username/password (initials stored in sessionStorage)
- **Book Search**: Search books using Google Books API
- **Dashboard**: Display books in Ag-Grid with sorting and filtering
- **Book Details**: View detailed book information
- **Reviews**: Add ratings and reviews (stored in Redux, not persisted)

## Tech Stack

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material UI (MUI)
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Data Grid**: Ag-Grid React

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The application will open at http://localhost:3000

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   └── RequireAuth.tsx       # Route guard component
├── pages/
│   ├── Login.tsx             # Login page
│   ├── Dashboard.tsx         # Book list with Ag-Grid
│   └── BookDetails.tsx       # Book details and reviews
├── store/
│   ├── store.ts              # Redux store configuration
│   ├── reviewsSlice.ts       # Reviews state management
│   └── hooks.ts              # Typed Redux hooks
├── types.ts                  # TypeScript interfaces
├── App.tsx                   # Main app with routing
└── main.tsx                  # Entry point
```

## Usage

1. **Login**: Enter any username and password. The initials will be extracted and saved.
2. **Search Books**: Use the search bar to find books by title or author.
3. **View Books**: Browse books in the data grid with sorting and filtering.
4. **Book Details**: Double-click any row to view book details.
5. **Add Review**: Rate the book (1-5 stars) and write a review.

## Notes

- Reviews are stored in Redux and will be lost on page refresh (by design).
- Authentication uses sessionStorage for user credentials.
- The app fetches data from the Google Books API.
