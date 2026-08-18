import React from 'react';
import { usePage } from '@inertiajs/inertia-react';
import { useLandingSections } from '../../hooks/useLandingSections';
import { HeroBanner } from '../../components/movie/HeroBanner';
import { MovieSection } from '../../components/movie/MovieSection';
import ThreeBackground from '../../components/movie/ThreeBackground';
import axios from 'axios';

export default function MovieLanding() {
    const { sections } = useLandingSections();
    const { locale } = usePage().props as any;
    const currentLocale = locale || 'en';

    const translations: any = {
        en: {
            favorites: 'Favorites',
            trends: 'Trends',
            movies: 'Movies',
            series: 'Series',
            episodes: 'Episodes',
            play: 'Play',
            seeMore: 'See More',
            popularChoice: 'Popular choice for movie enthusiasts.',
            logout: 'Logout'
        },
        id: {
            favorites: 'Favorit',
            trends: 'Sedang Tren',
            movies: 'Film',
            series: 'Serial',
            episodes: 'Episode',
            play: 'Putar',
            seeMore: 'Lihat Semua',
            popularChoice: 'Pilihan populer bagi para pecinta film.',
            logout: 'Keluar'
        }
    };

    const t = translations[currentLocale] || translations.en;

    const toggleLanguage = () => {
        const next = currentLocale === 'en' ? 'id' : 'en';
        axios.post('/locale', { locale: next }, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then(() => window.location.reload());
    };

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans relative overflow-x-hidden">
            <ThreeBackground />
            
            <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-black/50 backdrop-blur-xl border-b border-white/5">
                <div className="text-xl font-bold tracking-tighter text-white uppercase tracking-widest">
                    MovieFinder
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleLanguage}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-bold uppercase transition cursor-pointer"
                    >
                        {currentLocale === 'en' ? 'ID (Indonesia)' : 'EN (English)'}
                    </button>
                    <a href="/favorites" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.favorites}</a>
                    <form action="/logout" method="POST" className="inline">
                        <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as any)?.content || ''} />
                        <button type="submit" className="text-gray-400 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider">{t.logout}</button>
                    </form>
                </div>
            </nav>

            <div className="relative z-10 pt-24 max-w-7xl mx-auto px-6">
                {sections.movie.length > 0 && <HeroBanner movie={sections.movie[0]} t={t} />}
                
                <MovieSection title={t.trends} type="movie" movies={sections.movie} t={t} />
                <MovieSection title={t.movies} type="movie" movies={sections.movie} t={t} />
                <MovieSection title={t.series} type="series" movies={sections.series} t={t} />
                <MovieSection title={t.episodes} type="episode" movies={sections.episode} t={t} />
            </div>
        </div>
    );
}