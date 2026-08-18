import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLanding, MoviePageProps, Favorite } from '../../hooks/useLanding';
import { usePage } from '@inertiajs/inertia-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import LazyImage from '../../components/movie/LazyImage';
import ThreeBackground from '../../components/movie/ThreeBackground';

export default function MovieLanding() {
    const { movies: initialMovies, totalResults, filters, error: initialError } = usePage().props as unknown as MoviePageProps;
    const {
        processing, 
        form, 
        setForm, 
        submit, 
        reset, 
        addFavorite,
        state,
    } = useLanding();

    const [isLanding, setIsLanding] = useState(true);
    const [sections, setSections] = useState({ movie: [], series: [], episode: [] });

    useEffect(() => {
        fetchPreviews();
    }, []);

    const fetchPreviews = async () => {
        const types = ['movie', 'series', 'episode'];
        const results: any = {};
        for (const type of types) {
            const res = await axios.get('/movies/api', { params: { s: 'Avengers', type, page: 1 }, headers: { 'X-Requested-With': 'XMLHttpRequest' }});
            results[type] = res.data.movies?.slice(0, 6) || [];
        }
        setSections(results);
    };

    const renderSection = (title: string, type: string, movies: any[]) => (
        <section className="mb-16">
            <div className="flex justify-between items-center mb-8 px-2">
                <h2 className="text-3xl font-black text-white tracking-tight">{title}</h2>
                <a href={`/movies?mode=all&type=${type}`} className="text-white hover:text-[#E50914] font-bold text-sm transition-colors uppercase tracking-widest flex items-center gap-2 group">
                    Show All
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                {movies.map(m => (
                    <a key={m.imdbID} href={`/movies/${m.imdbID}`} className="group relative bg-[#181818] rounded-md overflow-hidden hover:scale-105 transition-all duration-300 block shadow-xl">
                        <div className="aspect-[2/3] overflow-hidden bg-[#181818]">
                            <LazyImage src={m.Poster} alt={m.Title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="p-3">
                            <h3 className="font-semibold text-white truncate text-sm mb-1">{m.Title}</h3>
                            <p className="text-[#808080] text-xs font-medium uppercase tracking-wider">{m.Year}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );

    if (isLanding) {
        return (
            <div className="min-h-screen bg-[#030303] text-white font-sans p-6 md:p-12 relative">
                <ThreeBackground />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-16">
                        <div className="text-3xl font-black text-[#E50914] tracking-tighter uppercase flex items-center gap-2">
                            <span className="bg-[#E50914] text-white px-2 py-0.5 rounded font-black text-2xl">M</span>
                            Movie Finder
                        </div>
                        <button onClick={() => setIsLanding(false)} className="text-white bg-[#181818] hover:bg-[#E50914] transition-colors px-6 py-2 rounded font-bold uppercase text-xs tracking-widest">
                            Enter Search
                        </button>
                    </div>
                    {renderSection('Movies', 'movie', sections.movie)}
                    {renderSection('Series', 'series', sections.series)}
                    {renderSection('Episodes', 'episode', sections.episode)}
                </div>
            </div>
        );
    }
    

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans relative">
            <ThreeBackground />
            <div className="relative z-10">
                <nav className="fixed w-full z-50 flex items-center justify-between px-8 py-4 bg-[#030303]/90 backdrop-blur-md border-b border-white/[0.08]">
                    <div className="text-2xl font-black text-[#E50914] tracking-tighter uppercase flex items-center gap-2">
                        <span className="bg-[#E50914] text-white px-2 py-0.5 rounded font-black text-xl">M</span>
                        Movie Finder
                    </div>
                    <div className="flex items-center gap-6 font-medium text-sm">
                        <a href="/" className="text-white hover:text-[#E50914] transition-colors">Movies</a>
                        <a href="/favorites" className="text-white hover:text-[#E50914] transition-colors">Favorites</a>
                        <form action="/logout" method="POST">
                            <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as any)?.content || ''} />
                            <button type="submit" className="text-white hover:text-[#E50914] transition-colors uppercase tracking-widest text-xs font-bold">Logout</button>
                        </form>
                    </div>
                </nav>

                <header className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight">
                            Discover your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-[#B20710]">favorite movie</span>.
                        </h1>
                        <p className="text-lg text-white max-w-xl mx-auto">
                            Explore thousands of movies, series, and episodes.
                        </p>
                        <form onSubmit={submit} className="flex gap-2 bg-[#181818] p-2 rounded-md border border-white/[0.1] shadow-2xl max-w-2xl mx-auto focus-within:border-[#E50914] transition-colors">
                            <input 
                                type="text" 
                                value={form.s} 
                                onChange={e => setForm({...form, s: e.target.value})} 
                                placeholder="Search titles, actors, genres..." 
                                className="w-full bg-transparent px-6 py-3 text-white placeholder-[#808080] focus:outline-none text-base font-medium" 
                            />
                            <motion.button 
                                type="submit" 
                                disabled={processing} 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-[#E50914] to-[#B20710] text-white px-8 py-3 rounded-sm font-bold uppercase text-sm tracking-widest transition-all shadow-lg shadow-[#E50914]/20"
                            >
                                {processing ? 'Searching...' : 'Search'}
                            </motion.button>
                        </form>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-6 pb-24 space-y-16">
                    {renderSection('Movies', 'movie', sections.movie)}
                    {renderSection('Series', 'series', sections.series)}
                    {renderSection('Episodes', 'episode', sections.episode)}
                </main>
            </div>
        </div>
    );
}
