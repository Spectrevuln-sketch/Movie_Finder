<?php

namespace Modules\Favorite\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Favorite\Services\FavoriteService;

class FavoriteController extends Controller
{
    protected $favoriteService;

    public function __construct(FavoriteService $favoriteService)
    {
        $this->favoriteService = $favoriteService;
    }

    public function index()
    {
        $favorites = $this->favoriteService->all();

        return Inertia::render('Favorite/favorite/index', [
            'favorites' => $favorites,
            'locale' => app()->getLocale(),
        ]);
    }


    public function showAll()
    {
        $favorites = $this->favoriteService->all();
        return response()->json($favorites, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'imdb_id' => 'required',
            'title' => 'required',
        ]);

        if ($this->favoriteService->exists($request->imdb_id)) {
            return response()->json(['error' => 'Already favorited'], 409);
        }

        $favorite = $this->favoriteService->add($request->only(['imdb_id', 'title', 'year', 'type', 'poster']));
        return response()->json($favorite, 201);
    }

    public function show($imdbId)
    {
        $favorite = $this->favoriteService->find($imdbId);

        if (!$favorite) {
            return response()->json(['error' => 'Favorite not found'], 404);
        }

        return response()->json($favorite, 200);
    }

    public function destroy($imdbId)
    {
        if (!$this->favoriteService->exists($imdbId)) {
            return response()->json(['error' => 'Favorite not found'], 404);
        }

        $this->favoriteService->remove($imdbId);
        return response()->json(['success' => true], 200);
    }
}
