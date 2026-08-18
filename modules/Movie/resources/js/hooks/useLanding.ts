import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import Axios from 'axios';

export interface Movie {
    imdbID: string;
    Title: string;
    Year: string;
    Type: string;
    Poster: string;
}

export interface MovieFilters {
    s: string;
    type: string;
    y: string;
}

export interface MoviePageProps {
    movies: Movie[];
    totalResults: number;
    filters: MovieFilters;
    error: string | null;
}

export interface Favorite {
    id: number;
    imdb_id: string;
    title: string;
    year: string;
    type: 'movie' | 'series' | 'episode';
    poster: string;
    created_at: string;
    updated_at: string;
}

interface IState {
    favorites: Favorite[] | [];
}

export interface IReturn {
    processing: boolean;
    form: MovieFilters;
    setForm: (value: MovieFilters) => void;
    submit: (event: React.FormEvent<HTMLFormElement>) => void;
    reset: () => void;
    addFavorite: (movie: any) => void;
    state: IState;
}

export const useLanding = (): IReturn => {
    const initialFilters : MovieFilters = {
        s: '',
        type: '',
        y: '',
    }
    const initialState: IState = {
        favorites: [],
    }
    const [state, setState] = useState<IState>(initialState)
    const [processing, setProcessing] = useState(false);

    const [form, setFormState] = useState<MovieFilters>(initialFilters);

    useEffect(() => {
        getFavorites();
    }, []);

    const getFavorites = async () => {
        try {
            const response = await Axios.get('/favorites/all');
            if (response.status === 200) {
                const data = await response.data;
                setState({ favorites: data });
            }
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
        }
    };

    const setForm = (value: MovieFilters) => {
        setFormState(value);
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setProcessing(true);

        Inertia.get('/', { s: form.s, type: form.type, y: form.y }, {
            preserveState: true,
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const reset = () => {
        const resetFilters = { s: '', type: '', y: '' };
        setForm(resetFilters);
        Inertia.get('/', resetFilters, { preserveState: true });
    };

    const addFavorite = (movie: any) => {
        Inertia.post('/favorites', {
            imdb_id: movie.imdbID || movie.imdb_id,
            title: movie.Title || movie.title,
            year: movie.Year || movie.year,
            type: movie.Type || movie.type,
            poster: movie.Poster || movie.poster,
        }, {
            preserveState: true,
            onSuccess: () => alert('Added to favorites!'),
            onError: (errors: any) => alert(errors.error || 'Failed to add favorite'),
        });
    };

    return {
        processing,
        form,
        setForm,
        submit,
        reset,
        addFavorite,
        state
    };
};