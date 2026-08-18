<?php

namespace Modules\Auth\Services;

use Illuminate\Support\Facades\Session;

class AuthenticationService
{
    public function attempt(string $username, string $password): bool
    {
        $configuredUsername = (string) config('modules.auth.username');
        $configuredPassword = (string) config('modules.auth.password');

        if (
            !hash_equals($configuredUsername, $username) ||
            !hash_equals($configuredPassword, $password)
        ) {
            return false;
        }

        Session::put('auth.user', [
            'username' => $username,
        ]);

        Session::put('auth.authenticated', true);

        return true;
    }

    public function check(): bool
    {
        return Session::get('auth.authenticated', false) === true
            && Session::has('auth.user');
    }

    public function user(): ?array
    {
        return Session::get('auth.user');
    }

    public function username(): ?string
    {
        return data_get($this->user(), 'username');
    }

    public function logout(): void
    {
        Session::forget([
            'auth.authenticated',
            'auth.user',
        ]);

        Session::regenerateToken();
        Session::regenerate();
    }
}