<?php

namespace Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Auth\Services\AuthenticationService;

class AuthController extends Controller
{
    protected $authenticationService;

    public function __construct(
        AuthenticationService $authenticationService
    ) {
        $this->authenticationService = $authenticationService;
    }

    public function showLogin()
    {
        if ($this->authenticationService->check()) {
            return redirect()->route('landing');
        }

        return Inertia::render('Auth/auth/login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if (!$this->authenticationService->attempt(
            $credentials['username'],
            $credentials['password']
        )) {
            return back()->withErrors([
                'credentials' => 'Invalid username or password.',
            ]);
        }

        return redirect()->route('landing');
    }

    public function logout()
    {
        $this->authenticationService->logout();

        return redirect()->route('login');
    }
}