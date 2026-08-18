import React from 'react';
import LazyImage from './LazyImage';

interface Props {
    movie: any;
    t: any;
}

export const HeroBanner = ({ movie, t }: Props) => {
    if (!movie) return null;

    return (
        <div className="relative w-full h-[50vh] overflow-hidden mb-12 rounded-xl border border-white/5 p-4">
            <LazyImage src={movie.Poster} alt={movie.Title} className="w-auto h-[20px] float-right" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-transparent flex flex-col justify-end p-8">
                <div className="max-w-xl space-y-2">
                    <h2 className="text-4xl font-black text-white">{movie.Title}</h2>
                    <p className="text-gray-300 text-sm">{t.popularChoice}</p>
                    <div className="flex gap-3 pt-2">
                        <a href={`/movies/${movie.imdbID}`} className="bg-white text-black px-6 py-2 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition">
                            {t.play}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};