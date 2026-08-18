import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ThreeBackground from '../../components/movie/ThreeBackground';

interface Rating {
    Source: string;
    Value: string;
}

interface Movie {
    Poster: string;
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    imdbRating: string;
    imdbVotes: string;
    Ratings: Rating[];
    BoxOffice?: string;
    Website?: string;
    Metascore: string;
    imdbID: string;
}

interface MovieShowProps {
    movie: Movie | null;
    error: string | null;
    isFavorited: boolean;
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
    favorite: Favorite | null;
}

export default function MovieShow() {
    const initialState = {
        favorite: null
    };

    const { movie, error, isFavorited: initialIsFavorited } = usePage().props as unknown as MovieShowProps;
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
    const [adding, setAdding] = useState<boolean>(false);
    const [state, setState] = useState<IState>(initialState);
    useEffect(() => {
        getFavorite();
    }, [movie]);

    const getFavorite = async () => {
        try {
            const response = await axios.get(`/favorites/${movie?.imdbID}`);
            setState({ favorite: response.data });
            if (response.data) {
                setIsFavorited(true);
            } else {
                setIsFavorited(false);
            }
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
            setIsFavorited(false);
        }
    }
    const addFavorite = async (m: Movie) => {
        setAdding(true);
        try {
            await axios.post('/favorites', {
                imdb_id: m.imdbID,
                title: m.Title,
                year: m.Year,
                type: 'movie',
                poster: m.Poster,
            });
            setIsFavorited(true);
        } catch (error: any) {
            if (error.response?.status === 409) {
                setIsFavorited(true);
            } else {
                alert('Failed to add favorite');
            }
        } finally {
            setAdding(false);
        }
    };

    const renderStars = (rating: string) => {
        const val = parseFloat(rating);
        const stars = Math.round(val);
        return (
            <div className="flex text-yellow-500 text-lg">
                {[...Array(10)].map((_, i) => (
                    <span key={i}>{i < stars ? '★' : '☆'}</span>
                ))}
            </div>
        );
    };

    const getGenreColors = (genre: string) => {
        if (genre.includes('Action') || genre.includes('Sci-Fi')) return 'from-red-900/20';
        if (genre.includes('Drama')) return 'from-violet-900/20';
        if (genre.includes('Comedy')) return 'from-amber-900/20';
        return 'from-black/20';
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white font-sans">
            <ThreeBackground />
            {error && <div className="p-20 text-center text-red-500 text-xl">{error}</div>}

            {movie && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <div className="relative max-w-6xl mx-auto px-6 py-12">
                        <motion.a 
                            href="/" 
                            whileHover={{ x: -5 }}
                            className="inline-flex items-center text-gray-400 hover:text-red-500 mb-8 font-semibold"
                        >
                            <span className="mr-2">&larr;</span> Back to Browse
                        </motion.a>

                        <div className="flex flex-col md:flex-row gap-10">
                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                                className="w-full md:w-1/3"
                            >
                                <img src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450'} alt={movie.Title} className="w-full rounded-xl shadow-2xl border border-gray-900" />
                            </motion.div>
                            
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="w-full md:w-2/3 flex flex-col justify-center"
                            >
                                <h1 className="text-6xl font-black mb-4 tracking-tight">{movie.Title}</h1>
                                
                                <div className="flex flex-wrap gap-3 mb-6 text-sm font-medium text-gray-300">
                                    <span className="border border-gray-800 px-2 py-0.5 rounded">{movie.Rated}</span>
                                    <span>{movie.Year}</span>
                                    <span>{movie.Runtime}</span>
                                    <div className="flex gap-2">
                                        {movie.Genre.split(', ').map((g, i) => (
                                            <motion.span 
                                                key={g} 
                                                whileHover={{ scale: 1.05 }}
                                                className="bg-gray-900 text-gray-400 px-3 py-0.5 rounded-full uppercase text-xs tracking-wider border border-gray-800 cursor-default"
                                            >
                                                {g}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mb-8">
                                    <div className="transition-transform hover:scale-105 duration-300">
                                        <p className="text-4xl font-bold">{movie.imdbRating} <span className="text-xl text-gray-600">/ 10</span></p>
                                        {renderStars(movie.imdbRating)}
                                        <p className="text-xs text-gray-600 mt-1">{movie.imdbVotes} votes</p>
                                    </div>
                                    {isFavorited ? (
                                        <motion.button 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            disabled
                                            className="bg-gray-700 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-white/5 cursor-not-allowed"
                                        >
                                            Favorited
                                        </motion.button>
                                    ):(
                                        <motion.button 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => addFavorite(movie)} 
                                            disabled={isFavorited || adding}
                                            className={`px-8 py-3 rounded-full font-bold shadow-lg shadow-white/5 ${
                                                isFavorited 
                                                    ? 'bg-gray-800 text-gray-500 cursor-default' 
                                                    : 'bg-red-600 text-white'
                                            }`}
                                        >
                                            {adding ? 'Adding...' : (isFavorited ? '✓ Added to Favorites' : '+ Favorite')}
                                        </motion.button>
                                    )}
                                </div>

                                <div className="bg-[#0a0a0a] p-6 rounded-lg border border-gray-900 mb-8">
                                    <h3 className="text-gray-600 font-bold uppercase text-xs mb-2">Overview</h3>
                                    <p className="text-lg leading-relaxed text-gray-300">{movie.Plot}</p>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                        >
                            {movie.Ratings.map((r, i) => (
                                <motion.div 
                                    key={i} 
                                    whileHover={{ y: -5 }}
                                    className="bg-[#0a0a0a] p-5 rounded-lg border border-gray-900"
                                >
                                    <p className="text-gray-600 text-xs font-bold uppercase mb-1">{r.Source}</p>
                                    <p className="text-xl font-semibold">{r.Value}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="bg-[#0a0a0a] p-8 rounded-lg border border-gray-900"
                        >
                            <h3 className="text-white font-bold text-xl mb-6">Production Details</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 text-sm">
                                <div><p className="text-gray-500">Director</p><p className="text-gray-300">{movie.Director}</p></div>
                                <div><p className="text-gray-500">Writer</p><p className="text-gray-300 truncate">{movie.Writer}</p></div>
                                <div><p className="text-gray-500">Released</p><p className="text-gray-300">{movie.Released}</p></div>
                                <div><p className="text-gray-500">Box Office</p><p className="text-gray-300">{movie.BoxOffice || 'N/A'}</p></div>
                                <div className="col-span-2 md:col-span-4">
                                    <p className="text-gray-500 mb-2">Cast</p>
                                    <div className="flex flex-wrap gap-2">
                                        {movie.Actors.split(', ').map(a => (
                                            <span key={a} className="bg-gray-900 px-3 py-1 rounded-full text-xs text-gray-300">{a}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
