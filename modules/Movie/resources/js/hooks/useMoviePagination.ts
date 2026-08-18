import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

export const useMoviePagination = (initialMovies: any[], totalResults: number, filters: any) => {
    const [movies, setMovies] = useState(initialMovies);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    const reload = useCallback(async (newFilters: any) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('/movies/api', {
                params: { ...newFilters, page: 1 },
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (res.data.movies) {
                setMovies(res.data.movies);
                setPage(1);
            }
        } catch (e) {
            setError('Failed to load movies.');
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMore = useCallback(async (customFilters = {}) => {
        if (loading || movies.length >= totalResults) return;
        
        setLoading(true);
        setError(null);
        try {
            const next = page + 1;
            const res = await axios.get('/movies/api', {
                params: { ...filters, ...customFilters, page: next },
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (res.data.movies) {
                setMovies(prev => [...prev, ...res.data.movies]);
                setPage(next);
            }
        } catch (e) {
            setError('Failed to load more movies.');
        } finally {
            setLoading(false);
        }
    }, [loading, movies.length, totalResults, page, filters]);

    const reset = (newMovies: any[]) => {
        setMovies(newMovies);
        setPage(1);
        setError(null);
    };

    const lastElementRef = useCallback((node: HTMLAnchorElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && movies.length < totalResults) {
                loadMore();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, movies.length, totalResults, loadMore]);

    return { movies, loading, error, loadMore, reload, reset, lastElementRef };
};
