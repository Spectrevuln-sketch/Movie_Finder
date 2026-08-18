<?php

namespace Modules\Movie\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Movie\Services\OmdbService;

class MovieController extends Controller
{
    protected $omdb;

    public function __construct(OmdbService $omdb)
    {
        $this->omdb = $omdb;
    }

    public function landing(Request $request)
    {
        $search = $request->input('s', 'Avengers');
        $type = $request->input('type');
        $year = $request->input('y') ? (int) $request->input('y') : null;
        $page = (int) $request->input('page', 1);

        $movies = [];
        $total = 0;
        $error = null;
        $filters = ['s' => $search, 'type' => $type, 'y' => $year, 'page' => $page];

        if ($request->ajax() || $request->wantsJson()) {
            $response = $this->omdb->search($search, $type, $year, $page);
            return response()->json([
                'movies' => $response['Search'] ?? [],
                'totalResults' => (int) ($response['totalResults'] ?? 0),
                'error' => $response['Error'] ?? null,
            ]);
        }

        return Inertia::render('Movie/movie/landing', [
            'movies' => $movies,
            'totalResults' => $total,
            'filters' => $filters,
            'error' => $error,
            'locale' => app()->getLocale(),
        ]);
    }

    public function index(Request $request)
    {
        if ($request->input('mode') !== 'all') {
            return $this->landing($request);
        }

        $search = $request->input('s', 'Avengers');
        $type = $request->input('type', 'movie');
        $year = $request->input('y') ? (int) $request->input('y') : null;
        $page = 1;

        $data = $this->omdb->search($search, $type, $year, $page);
        $movies = $data['Search'] ?? [];
        $total = (int) ($data['totalResults'] ?? 0);

        return Inertia::render('Movie/movie/index', [
            'movies' => $movies,
            'totalResults' => $total,
            'filters' => ['s' => $search, 'type' => $type, 'y' => $year],
            'locale' => app()->getLocale(),
        ]);
    }

    public function getMovies(Request $request)
    {
        $search = $request->input('s', 'Avengers');
        $type = $request->input('type');
        $year = $request->input('y') ? (int) $request->input('y') : null;
        $page = (int) $request->input('page', 1);

        $movies = [];
        $total = 0;
        $error = null;

        $data = $this->omdb->search($search, $type, $year, $page);

        if ($data && isset($data['Response']) && $data['Response'] === 'True') {
            $movies = $data['Search'] ?? [];
            $total = (int) ($data['totalResults'] ?? 0);
        } else {
            $error = $data['Error'] ?? 'Unknown API error';
        }

        return response()->json([
            'movies' => $movies,
            'totalResults' => $total,
            'error' => $error,
        ]);
    }

    public function show($imdbId)
    {
        $data = $this->omdb->getById($imdbId);
        $error = null;

        if (!$data || (isset($data['Response']) && $data['Response'] === 'False')) {
            $error = $data['Error'] ?? 'Movie not found';
            $data = null;
        }

        return Inertia::render('Movie/movie/show', [
            'movie' => $data,
            'error' => $error,
            'locale' => app()->getLocale(),
        ]);
    }
}
