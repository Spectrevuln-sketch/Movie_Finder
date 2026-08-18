import React, { useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import axios from 'axios';

interface Favorite {
    imdb_id: string;
    title: string;
    year: string;
    type: string;
    poster: string;
}

interface FavoriteProps {
    favorites: Favorite[];
}

export default function FavoriteIndex() {
    const { favorites: initialFavorites } = usePage().props as unknown as FavoriteProps;
    const [favorites, setFavorites] = useState<Favorite[]>(initialFavorites);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const removeFavorite = async (imdbId: string) => {
        setDeletingId(imdbId);
        try {
            await axios.delete(`/favorites/${imdbId}`);
            setFavorites(favorites.filter(f => f.imdb_id !== imdbId));
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to remove favorite');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans p-6">
            <nav className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
                <h1 className="text-2xl font-black text-red-600 uppercase tracking-tighter">Movie Finder</h1>
                <div className="flex gap-6">
                    <a href="/" className="hover:text-red-500">Movies</a>
                    <a href="/favorites" className="text-red-500 font-bold">Favorites</a>
                </div>
            </nav>

            <header className="max-w-7xl mx-auto mb-10">
                <h1 className="text-4xl font-extrabold mb-2">My Favorites</h1>
                <p className="text-gray-400">{favorites.length} movies saved</p>
            </header>

            {favorites.length === 0 ? (
                <div className="max-w-7xl mx-auto text-center py-20 bg-gray-900 rounded-lg">
                    <p className="text-xl text-gray-400 mb-6">No favorites yet.</p>
                    <a href="/" className="bg-red-600 px-8 py-3 rounded-full font-bold hover:bg-red-700 transition">Explore Movies</a>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {favorites.map(m => (
                        <div key={m.imdb_id} className="bg-gray-900 rounded-lg overflow-hidden group hover:scale-105 transition duration-300 shadow-xl relative">
                            <img src={m.poster !== 'N/A' ? m.poster : 'https://via.placeholder.com/300x450'} alt={m.title} className="w-full h-72 object-cover" />
                            <div className="p-4">
                                <h3 className="font-bold truncate text-sm mb-1">{m.title}</h3>
                                <p className="text-gray-400 text-xs mb-3">{m.year} • <span className="uppercase">{m.type}</span></p>
                                <button 
                                    onClick={() => removeFavorite(m.imdb_id)}
                                    disabled={deletingId === m.imdb_id}
                                    className="w-full py-2 bg-gray-800 hover:bg-red-900 rounded text-xs font-bold uppercase transition disabled:opacity-50"
                                >
                                    {deletingId === m.imdb_id ? 'Removing...' : 'Remove'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
