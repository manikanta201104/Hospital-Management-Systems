'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Homepage/page';
import Footer from '@/app/components/Footer/page';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  interface LoginResponse {
    accessToken?: string;
    message?: string;
    error?: string;
    [key: string]: any;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const loginResponse = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      const responseText = await loginResponse.text();
      let loginData: LoginResponse;

      try {
        loginData = JSON.parse(responseText);
      } catch {
        setError('Server returned an invalid response. Please try again.');
        return;
      }

      if (!loginResponse.ok) {
        setError(loginData.error || 'Login failed. Please check your credentials.');
        return;
      }

      if (!loginData.accessToken) {
        setError('No access token received from server.');
        return;
      }

      localStorage.setItem('accessToken', loginData.accessToken);
      localStorage.setItem('isLoggedIn', 'true');

      router.push('/');
    } catch (error) {
      setError('Unable to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      localStorage.removeItem('accessToken');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('isLoggedIn');

      router.push('/login');
    } catch (error) {
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      {/* <div className="bg-white shadow-lg">
        <Header />
      </div> */}

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Login Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Welcome
          </h1>
          <h2
            className="text-base sm:text-lg md:text-xl text-gray-900 mb-6 sm:mb-8 md:mb-10"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            Log in to Patient Portal
          </h2>

          <form
            onSubmit={handleLogin}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white text-gray-900 border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 shadow-none sm:shadow-sm"
            style={{ fontFamily: 'Arial, sans-serif' }}
            aria-busy={isLoading ? 'true' : 'false'}
          >
            {error && (
              <p
                className="mb-4 sm:mb-5 md:mb-6 text-center text-sm sm:text-base md:text-lg text-red-500"
                aria-live="polite"
              >
                {error}
              </p>
            )}

            <div className="mb-4 sm:mb-5 md:mb-6">
              <label
                htmlFor="email"
                className="block text-sm sm:text-base md:text-lg text-gray-900 mb-1 sm:mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 text-gray-900 rounded-md p-2 sm:p-3 text-sm sm:text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="mb-4 sm:mb-5 md:mb-6 relative">
              <label
                htmlFor="password"
                className="block text-sm sm:text-base md:text-lg text-gray-900 mb-1 sm:mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full border border-gray-300 text-gray-900 rounded-md p-2 sm:p-3 text-sm sm:text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-sm sm:text-base md:text-lg"
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-800 text-white rounded-full py-2 sm:py-3 min-h-10 sm:min-h-12 text-sm sm:text-base md:text-lg font-semibold hover:bg-blue-900 transition-all duration-300 disabled:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6 mr-2"
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
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Log in'
              )}
            </button>

            <div className="mt-4 sm:mt-5 md:mt-6 text-center">
              <Link
                href="/forgot-credentials"
                className="text-blue-600 text-sm sm:text-base md:text-lg hover:underline"
              >
                Forgot username or password?
              </Link>
            </div>

            <div className="mt-3 sm:mt-4 md:mt-5 text-center">
              <p className="text-sm sm:text-base md:text-lg text-gray-700">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-600 hover:underline">
                  Create one now.
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-4 sm:mt-5 md:mt-6 text-center">
            <p className="text-sm sm:text-base md:text-lg text-gray-700">
              Online support can be found under{' '}
              <Link href="/account-help" className="text-blue-600 hover:underline">
                Account help.
              </Link>
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className="w-full lg:w-1/3 bg-blue-800 text-white p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 uppercase">
            Quick Access
          </h3>
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <Link
              href="/pay-bill"
              className="flex items-center space-x-2 hover:underline text-sm sm:text-base md:text-lg"
            >
              <span className="text-lg sm:text-xl md:text-2xl">💵</span>
              <span>Pay a bill</span>
            </Link>
            <Link
              href="/refill-prescription"
              className="flex items-center space-x-2 hover:underline text-sm sm:text-base md:text-lg"
            >
              <span className="text-lg sm:text-xl md:text-2xl">📦</span>
              <span>Refill a prescription</span>
            </Link>
          </div>

          <div className="mt-6 sm:mt-8 md:mt-10">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 uppercaseવ
uppercase">
              Get the Minimalistic Clinic App
            </h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Link href="https://play.google.com/store">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  width={120}
                  height={36}
                  className="w-24 sm:w-32 md:w-40 h-auto"
                />
              </Link>
              <Link href="https://www.apple.com/app-store/">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store"
                  width={108}
                  height={36}
                  className="w-20 sm:w-28 md:w-36 h-auto"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <div className="bg-white shadow-lg">
        <Footer />
      </div> */}
    </div>
  );
};

export default LoginPage;