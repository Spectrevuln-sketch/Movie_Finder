import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePage } from '@inertiajs/inertia-react';
import { useMoviePagination } from '../../hooks/useMoviePagination';
import LazyImage from '../../components/movie/LazyImage';
import ThreeBackground from '../../components/movie/ThreeBackground';

interface Props {
    movies: any[];
    totalResults: number;
    filters: any;
}

export default function MovieIndex() {
    const { movies: initialMovies, totalResults, filters: initialFilters } = usePage().props as unknown as Props;
    const [filters, setFilters] = useState(initialFilters);
    const { movies, loading, error, loadMore, reload, reset, lastElementRef } = useMoviePagination(initialMovies, totalResults, filters);

    const updateFilter = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        window.history.pushState({}, '', `?s=${newFilters.s}&type=${newFilters.type}&y=${newFilters.y}&mode=all`);
        reload(newFilters);
    };

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans relative overflow-x-hidden">
            <ThreeBackground />

            {/* Navbar */}
            <nav className="fixed w-full z-50 flex items-center justify-between px-8 h-16 bg-[#030303]/90 backdrop-blur-md border-b border-white/[0.08]">
                <div className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-2">
                    <span className="bg-[#E50914] text-white px-2 py-0.5 rounded font-black text-xl shadow-lg shadow-[#E50914]/30">M</span>
                    Movie Finder
                </div>
                <div className="flex items-center gap-8 font-medium text-sm">
                    <motion.a href="/" whileHover={{ scale: 1.05 }} className="relative text-white font-semibold py-1">
                        Movies
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E50914] rounded-full"></span>
                    </motion.a>
                    <motion.a href="/favorites" whileHover={{ scale: 1.05 }} className="text-white hover:text-white transition-colors">Favorites</motion.a>
                    <form action="/logout" method="POST">
                        <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as any)?.content || ''} />
                        <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-white hover:text-white transition-colors cursor-pointer">Logout</motion.button>
                    </form>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="pt-24 px-8 max-w-7xl mx-auto pb-20 relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-[#080A0F] to-[#0E1117] p-8 rounded-2xl border border-white/[0.08] shadow-2xl relative overflow-hidden backdrop-blur-sm"
                    style={{ background: 'linear-gradient(to right, rgba(8,10,15,0.9), rgba(14,17,23,0.9)), rgba(0,0,0,0.25)' }}
                >
                    <div className="absolute right-0 top-0 w-96 h-96 bg-[#E50914]/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 bg-black/25 p-4 rounded-xl -m-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">Discover</h1>
                        <p className="text-white text-base max-w-xl font-medium">Find your next favorite movie, series, or episode.</p>
                    </div>

                    <div className="w-full md:w-96 relative z-10">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={filters.s}
                            onChange={(e) => updateFilter('s', e.target.value)}
                            placeholder="Search movies, series..."
                            className="w-full bg-[#030303] border border-white/[0.15] text-white pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#E50914]/80 focus:ring-1 focus:ring-[#E50914]/80 transition-all text-sm placeholder-[#CBD5E1]"
                        />
                    </div>
                </motion.div>

                {/* Filters & Results Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-[#080A0F]/90 backdrop-blur-md p-4 rounded-xl border border-white/[0.08]"
                >
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Type Segmented Control */}
                        <div className="flex bg-[#030303] p-1 rounded-lg border border-white/[0.15]">
                            {['movie', 'series', 'episode'].map((t) => (
                                <motion.button
                                    key={t}
                                    onClick={() => updateFilter('type', t)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-1.5 rounded-md text-xs font-semibold capitalize transition-all duration-300 ${
                                        filters.type === t
                                            ? 'bg-gradient-to-r from-[#E50914] to-[#B20710] text-white shadow-lg'
                                            : 'bg-[#181818] text-white hover:bg-[#2F2F2F]'
                                    }`}
                                >
                                    {t}
                                </motion.button>
                            ))}
                        </div>

                        {/* Year Input */}
                        <div className="flex items-center bg-[#030303] border border-white/[0.15] rounded-lg px-3 py-1.5">
                            <span className="text-white font-bold uppercase mr-2">Year</span>
                            <input
                                type="number"
                                value={filters.y || ''}
                                onChange={(e) => updateFilter('y', e.target.value)}
                                placeholder="Any"
                                className="w-20 bg-transparent text-white text-xs focus:outline-none placeholder-[#CBD5E1]"
                            />
                        </div>

                        {/* Reset Filter Button */}
                        <motion.button
                            onClick={() => {
                                updateFilter('s', 'Avengers');
                                updateFilter('type', 'movie');
                                updateFilter('y', '');
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 bg-[#181818] hover:bg-[#2F2F2F] border border-white/[0.1] text-xs font-medium text-white rounded-lg transition-all duration-300"
                        >
                            Reset
                        </motion.button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg text-xs font-medium text-white shadow-sm">
                            <strong className="text-[#E50914]">{totalResults}</strong> results
                        </span>
                        {filters.s && (
                            <span className="px-3 py-1.5 bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg text-xs font-medium text-white">
                                query: <strong className="text-white">{filters.s}</strong>
                            </span>
                        )}
                    </div>
                </motion.div>

                {/* Movie Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {movies.map((m, i) => (
                        <motion.a
                            key={`${m.imdbID}-${i}`}
                            ref={i === movies.length - 1 ? lastElementRef : null}
                            href={`/movies/${m.imdbID}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: (i % 10) * 0.04 }}
                            whileHover={{ y: -5 }}
                            className="group relative bg-[#101318] rounded-xl overflow-hidden border border-white/[0.08] shadow-lg transition-all duration-300 block hover:border-white/[0.2] hover:shadow-2xl hover:shadow-[#E50914]/10 cursor-pointer"
                        >
                            <div className="aspect-[2/3] overflow-hidden relative bg-[#030303]">
                                <LazyImage src={m.Poster} alt={m.Title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#101318] via-transparent to-transparent opacity-90"></div>
                            </div>
                            <div className="p-4 relative -mt-14 z-10 bg-gradient-to-t from-[#101318] via-[#101318]/95 to-transparent pt-6">
                                <h3 className="font-bold text-white truncate text-sm mb-1 group-hover:text-[#E50914] transition-colors">{m.Title}</h3>
                                <div className="flex items-center justify-between text-xs font-medium text-white">
                                    <span className="uppercase tracking-wider">{m.Year}</span>
                                    <span className="px-2 py-0.5 bg-[rgba(255,255,255,0.08)] rounded border border-[rgba(255,255,255,0.15)] capitalize text-[10px] text-white">{m.Type}</span>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </main>
        </div>
    );
}
