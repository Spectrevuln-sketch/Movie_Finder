<?php

namespace Modules\Auth\Middleware;

use Closure;
use Illuminate\Http\Request;
use Modules\Auth\Services\AuthenticationService;

class EnsureAuthenticated
{
    protected $authenticationService;

    public function __construct(
        AuthenticationService $authenticationService
    ) {
        $this->authenticationService = $authenticationService;
    }

    public function handle(Request $request, Closure $next)
    {
        if (!$this->authenticationService->check()) {
            return redirect()->route('login');
        }

        return $next($request);
    }
}