import React from 'react';
import { usePage } from '@inertiajs/inertia-react';
import LoginForm from '../../components/auth/login-form';

const LoginPage = () => {
    const { errors = {} } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="grid min-h-screen lg:grid-cols-2">

                <div className="relative hidden overflow-hidden lg:flex bg-gray-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-90" />

                    <div className="relative z-10 flex flex-1 flex-col justify-between p-12 xl:p-16">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 shadow-lg">
                                <span className="text-sm font-bold">
                                    MF
                                </span>
                            </div>

                            <span className="text-lg font-semibold text-white">
                                Movie Finder
                            </span>
                        </div>

                        <div className="max-w-xl">
                            <span className="mb-5 inline-block rounded-full border border-indigo-500 bg-indigo-900 px-3 py-1 text-xs font-medium text-indigo-300">
                                DISCOVER · SAVE · ENJOY
                            </span>

                            <h1 className="text-5xl font-bold leading-tight text-white xl:text-6xl">
                                Find your next
                                <span className="block text-indigo-400">
                                    favorite movie.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-lg text-base leading-7 text-gray-400">
                                Search movies, explore detailed information,
                                and keep your favorites in one place.
                            </p>
                        </div>

                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} Movie Finder
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center bg-gray-900 px-6 py-12 sm:px-10 lg:px-16">
                    <div className="w-full max-w-md">

                        <div className="mb-8 lg:hidden">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
                                    <span className="text-sm font-bold text-white">
                                        MF
                                    </span>
                                </div>

                                <span className="text-lg font-semibold text-white">
                                    Movie Finder
                                </span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white">
                                Welcome back
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-gray-400">
                                Sign in to continue exploring movies.
                            </p>
                        </div>

                        {errors.credentials && (
                            <div className="mb-6 rounded-xl border border-red-800 bg-red-900 px-4 py-3">
                                <p className="text-sm text-red-300">
                                    {errors.credentials}
                                </p>
                            </div>
                        )}

                        <div className="rounded-2xl border border-gray-800 bg-gray-800 p-6 shadow-2xl sm:p-8">
                            <LoginForm />
                        </div>

                        <p className="mt-6 text-center text-xs leading-5 text-gray-500">
                            Secure access to your Movie Finder account.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
