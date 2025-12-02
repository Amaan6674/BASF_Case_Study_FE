import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';
import {
    Box,
    Container,
    TextField,
    Typography,
    Button,
    Paper,
    CircularProgress
} from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { IBook, IUser } from '../types';

interface BookRow {
    id: string;
    title: string;
    author: string;
    genre: string;
    averageRating: number;
}

const Dashboard: React.FC = () => {
    const [books, setBooks] = useState<BookRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('react programming');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const user: IUser | null = JSON.parse(sessionStorage.getItem('user') || 'null');

    const fetchBooks = useCallback(async (query: string) => {
        if (!query.trim()) {
            setError('Please enter a search term');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Fetch two pages to get 40 results (20 + 20)
            const [response1, response2] = await Promise.all([
                axios.get<{ items: IBook[]; totalItems: number }>(
                    `https://www.googleapis.com/books/v1/volumes`,
                    {
                        params: {
                            q: query,
                            maxResults: 20,
                            startIndex: 0
                        }
                    }
                ),
                axios.get<{ items: IBook[]; totalItems: number }>(
                    `https://www.googleapis.com/books/v1/volumes`,
                    {
                        params: {
                            q: query,
                            maxResults: 20,
                            startIndex: 20
                        }
                    }
                )
            ]);

            const allItems = [
                ...(response1.data.items || []),
                ...(response2.data.items || [])
            ];

            if (allItems.length > 0) {
                const bookRows: BookRow[] = allItems.map((book: IBook) => ({
                    id: book.id,
                    title: book.volumeInfo.title || 'Unknown Title',
                    author: book.volumeInfo.authors?.join(', ') || 'Unknown Author',
                    genre: book.volumeInfo.categories?.join(', ') || 'Uncategorized',
                    averageRating: book.volumeInfo.averageRating || 0
                }));
                setBooks(bookRows);
                console.log(`Fetched ${bookRows.length} books out of ${response1.data.totalItems} total`);
            } else {
                setBooks([]);
                setError('No books found');
            }
        } catch (err) {
            setError('Failed to fetch books. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBooks(searchTerm);
    }, [fetchBooks, searchTerm]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchBooks(searchTerm);
    };

    const handleRowDoubleClick = (event: RowDoubleClickedEvent<BookRow>) => {
        if (event.data) {
            navigate(`/book/${event.data.id}`);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    const columnDefs: ColDef<BookRow>[] = [
        {
            field: 'title',
            headerName: 'Title',
            flex: 2,
            sortable: true,
            filter: true
        },
        {
            field: 'author',
            headerName: 'Author',
            flex: 1.5,
            sortable: true,
            filter: true
        },
        {
            field: 'genre',
            headerName: 'Genre',
            flex: 1,
            sortable: true,
            filter: true
        },
        {
            field: 'averageRating',
            headerName: 'Average Rating',
            flex: 0.8,
            sortable: true,
            filter: 'agNumberColumnFilter',
            valueFormatter: (params) => {
                return params.value > 0 ? params.value.toFixed(1) : 'N/A';
            }
        }
    ];

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Book Dashboard
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography variant="body1">
                            Welcome, <strong>{user?.initials}</strong>
                        </Typography>
                        <Button variant="outlined" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                </Box>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Search Books"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter book title or author..."
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ minWidth: 120 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Search'}
                        </Button>
                    </Box>
                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                </Paper>

                <Paper sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Double-click on a row to view book details and add reviews
                    </Typography>
                    <Box className="ag-theme-material" sx={{ height: 600, width: '100%' }}>
                        <AgGridReact<BookRow>
                            rowData={books}
                            columnDefs={columnDefs}
                            onRowDoubleClicked={handleRowDoubleClick}
                            pagination={true}
                            paginationPageSize={20}
                            paginationPageSizeSelector={false}
                            domLayout="normal"
                        />
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Dashboard;
