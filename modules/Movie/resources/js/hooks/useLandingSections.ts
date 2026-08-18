import { useState, useEffect } from 'react';
import axios from 'axios';

export const useLandingSections = () => {
    const [sections, setSections] = useState({ movie: [], series: [], episode: [] });
    const [loading, setLoading] = useState(true);

    const fetchPreviews = async () => {
        setLoading(true);
        const types = ['movie', 'series', 'episode'];
        const results: any = {};
        for (const type of types) {
            try {
                const res = await axios.get('/movies/api', { 
                    params: { s: 'Avengers', type, page: 1 }, 
                    headers: { 'X-Requested-With': 'XMLHttpRequest' } 
                });
                results[type] = res.data.movies?.slice(0, 6) || [];
            } catch (e) {
                results[type] = [];
            }
        }
        setSections(results);
        setLoading(false);
    };

    useEffect(() => {
        fetchPreviews();
    }, []);

    return { sections, loading };
};