import React, { useState } from 'react';

interface Props {
    src: string;
    alt: string;
    className?: string;
}

export default function LazyImage({ src, alt, className }: Props) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const imageUrl = (src === 'N/A' || error) ? 'https://via.placeholder.com/300x450?text=No+Poster' : src;

    return (
        <div className={`relative overflow-hidden bg-[#111318] ${className}`}>
            {!loaded && !error && (
                <div className="absolute inset-0 animate-pulse bg-[#171A21]" />
            )}
            <img
                src={imageUrl}
                alt={alt}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                onError={() => { setError(true); setLoaded(true); }}
                className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
}
