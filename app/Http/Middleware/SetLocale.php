<?php

namespace App\Http\Middleware;

use Closure;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $locale = $request->header('X-Localization', session('locale', 'en'));
        if (in_array($locale, ['en', 'id'])) {
            app()->setLocale($locale);
            session(['locale' => $locale]);
        }
        return $next($request);
    }
}
