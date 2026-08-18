<?php

namespace Modules\Favorite\Services;

use Modules\Favorite\Models\Favorite;

class FavoriteService
{
    public function add(array $movie)
    {
        return Favorite::firstOrCreate(
            ['imdb_id' => $movie['imdb_id']],
            $movie
        );
    }

    public function remove(string $imdbId)
    {
        return Favorite::where('imdb_id', $imdbId)->delete();
    }

    public function find(string $imdbId)
    {
        return Favorite::where('imdb_id', $imdbId)->first();
    }

    public function all()
    {
        return Favorite::all();
    }

    public function exists(string $imdbId)
    {
        return Favorite::where('imdb_id', $imdbId)->exists();
    }
}
