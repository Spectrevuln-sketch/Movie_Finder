import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';

const LoginForm = () => {
    const { errors = {} } = usePage().props;

    const [form, setForm] = React.useState({
        username: '',
        password: '',
    });

    const [processing, setProcessing] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (processing) {
            return;
        }

        setProcessing(true);

        Inertia.post('/login', form, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const inputClassName = (hasError) => `
        w-full rounded-xl border bg-gray-700 px-4 py-3
        text-sm text-white placeholder-gray-400
        transition duration-150 ease-in-out
        focus:outline-none focus:shadow-outline
        ${
            hasError
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-600 focus:border-indigo-500'
        }
    `;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            <div>
                <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-gray-200"
                >
                    Username
                </label>

                <input
                    id="username"
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    autoComplete="username"
                    placeholder="Enter your username"
                    className={inputClassName(errors.username)}
                    disabled={processing}
                />

                {errors.username && (
                    <p className="mt-2 text-xs text-red-400 font-medium">
                        {errors.username}
                    </p>
                )}
            </div>

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-200"
                    >
                        Password
                    </label>
                </div>

                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        className={`${inputClassName(
                            errors.password
                        )} pr-16`}
                        disabled={processing}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-400 transition hover:bg-gray-600 hover:text-white focus:outline-none focus:shadow-outline"
                        disabled={processing}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>

                {errors.password && (
                    <p className="mt-2 text-xs text-red-400 font-medium">
                        {errors.password}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="
                    flex w-full items-center justify-center
                    rounded-xl bg-indigo-600 px-4 py-3.5
                    text-sm font-semibold text-white
                    shadow-lg transition duration-150 ease-in-out
                    hover:bg-indigo-500
                    focus:outline-none focus:shadow-outline
                    disabled:cursor-not-allowed disabled:opacity-50
                "
            >
                {processing && (
                    <svg
                        className="mr-2 h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}

                <span>
                    {processing ? 'Signing in...' : 'Sign In'}
                </span>
            </button>
        </form>
    );
};

export default LoginForm;
