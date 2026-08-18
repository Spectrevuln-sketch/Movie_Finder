import React from 'react';
import LazyImage from './LazyImage';

interface Props {
    title: string;
    type: string;
    movies: any[];
    t: any;
}

export const MovieSection = ({ title, type, movies, t }: Props) => (
    <section className="mb-12 px-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
            <a href={`/movies?mode=all&type=${type}`} className="text-[#E50914] hover:text-white transition-colors text-sm font-bold uppercase">
                {t.seeMore}
            </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map(m => (
                <a key={m.imdbID} href={`/movies/${m.imdbID}`} className="group relative block aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 border border-white/5 transition-all hover:scale-105">
                    <LazyImage src={m.Poster} alt={m.Title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-black/50 p-1.5 rounded text-white">+</div>
                </a>
            ))}
        </div>
    </section>
);