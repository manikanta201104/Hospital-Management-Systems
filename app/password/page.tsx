'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

const PasswordPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    password: '',
    apiError: '',
  });
  const [isMounted, setIsMounted] = useState(false);

  // Ensure the component is mounted on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Extract email and handle redirection after mounting
  useEffect(() => {
    if (!isMounted) return;

    const emailFromParams = searchParams.get('email') || '';
    setEmail(emailFromParams);

    // If no email is provided, redirect back to signup page
    if (!emailFromParams) {
      router.push('/signup');
    }
  }, [isMounted, searchParams, router]);

  // Prevent rendering until the component is mounted
  if (!isMounted) {
    return null;
  }

  interface PasswordStrength {
    label: string;
    width: string;
    color: string;
  }

  const getPasswordStrength = (pwd: string): PasswordStrength => {
    if (pwd.length === 0) return { label: '', width: '0%', color: '' };

    let types = 0;
    if (/[a-z]/.test(pwd)) types++;
    if (/[A-Z]/.test(pwd)) types++;
    if (/[0-9]/.test(pwd)) types++;
    if (/[^a-zA-Z0-9]/.test(pwd)) types++;

    if (types === 1) {
      if (pwd.length >= 14) return { label: 'Good', width: '60%', color: 'bg-yellow-500' };
      else if (pwd.length >= 10) return { label: 'Poor', width: '40%', color: 'bg-orange-500' };
      else if (pwd.length >= 8) return { label: 'Very Poor', width: '20%', color: 'bg-red-500' };
    }

    if (types === 2 && pwd.length >= 8) return { label: 'Good', width: '60%', color: 'bg-yellow-500' };
    if (types === 3 && pwd.length >= 8) return { label: 'Strong', width: '80%', color: 'bg-blue-500' };
    if (types === 4 && pwd.length >= 8) return { label: 'Very Strong', width: '100%', color: 'bg-green-500' };

    return { label: 'Very Poor', width: '20%', color: 'bg-red-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleContinue = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = {
      fullName: '',
      password: '',
      apiError: '',
    };

    // Validate fields
    if (!fullName.trim()) {
      newErrors.fullName = 'This field is mandatory';
      hasErrors = true;
    }
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      try {
        console.log('Sending signup request with payload:', { username: fullName, email, password });
        const response = await fetch('http://localhost:5000/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: fullName.trim().toLowerCase(),
            email,
            password,
          }),
        });

        const data = await response.json();
        console.log('Signup response:', response.status, data);
        if (!response.ok) {
          setErrors((prev) => ({
            ...prev,
            apiError: data.message || 'Signup failed. Please try again.',
          }));
          return;
        }

        // On successful signup, redirect to login
        alert('Account created successfully! Please log in.');
        router.push('/login');
      } catch (error) {
        console.error('Signup error:', error);
        setErrors((prev) => ({
          ...prev,
          apiError: 'An error occurred during signup. Please try again.',
        }));
      }
    }
  };

  // Get current date and time in IST
  const currentDateTime = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left Section: Password Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-3 xs:p-4 sm:p-6 md:p-8">
          {/* Minimalistic Clinic Logo */}
          <div className="mb-4 xs:mb-6 sm:mb-8">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Minimalistic Clinic Logo"
                width={48}
                height={48}
                className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12"
                priority
              />
            </Link>
          </div>

          {/* Header Text */}
          <h1
            className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-2 xs:mb-3 sm:mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Set Up Your Account
          </h1>
          <p
            className="text-xs xs:text-sm sm:text-base text-gray-900 mb-4 xs:mb-6 sm:mb-8 text-center"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            Finish setting up your account
          </p>

          {/* Password Form */}
          <div
            className="w-full max-w-xs xs:max-w-sm sm:max-w-md bg-white border border-gray-200 rounded-lg p-3 xs:p-4 sm:p-6 shadow-none xs:shadow-sm"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {/* Email Address Field (Disabled) */}
            <div className="mb-3 xs:mb-4">
              <label
                htmlFor="email"
                className="block text-xs xs:text-sm sm:text-base text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="text"
                id="email"
                value={email}
                disabled
                className="w-full border border-gray-300 rounded-md px-3 xs:px-4 py-2 text-xs xs:text-sm sm:text-base bg-gray-100 text-gray-700"
              />
            </div>

            {/* Legal Full Name Field */}
            <div className="mb-3 xs:mb-4">
              <label
                htmlFor="fullName"
                className="block text-xs xs:text-sm sm:text-base text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                placeholder="Enter full name"
                className="w-full border border-gray-300 rounded-md px-3 xs:px-4 py-2 text-xs xs:text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-gray-900"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
              {errors.fullName && (
                <p id="fullName-error" className="mt-1 text-xs xs:text-sm sm:text-base text-red-500" aria-live="polite">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-3 xs:mb-4">
              <label
                htmlFor="password"
                className="block text-xs xs:text-sm sm:text-base text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-md px-3 xs:px-4 py-2 text-xs xs:text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-gray-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 text-xs xs:text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-xs xs:text-sm sm:text-base text-red-500" aria-live="polite">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mb-3 xs:mb-4">
                <label
                  className="block text-xs xs:text-sm sm:text-base text-gray-700 mb-1"
                  aria-live="polite"
                >
                  Password Strength: {passwordStrength.label}
                </label>
                <div className="w-full bg-gray-200 rounded-full h-1.5 xs:h-2">
                  <div
                    className={`h-1.5 xs:h-2 rounded-full ${passwordStrength.color}`}
                    style={{ width: passwordStrength.width }}
                  />
                </div>
              </div>
            )}

            {/* API Error Message */}
            {errors.apiError && (
              <p
                className="mb-3 xs:mb-4 text-center text-xs xs:text-sm sm:text-base text-red-500"
                aria-live="polite"
              >
                {errors.apiError}
              </p>
            )}

            {/* Terms and Privacy */}
            <p className="text-center text-xs xs:text-sm sm:text-base text-gray-700 mb-3 xs:mb-4">
              By signing up, I accept the Minimalistic Clinic{' '}
              <Link href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and acknowledge the{' '}
              <Link href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full bg-blue-800 text-white rounded-full py-2 min-h-10 text-xs xs:text-sm sm:text-base font-semibold hover:bg-blue-900 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              Continue
            </button>
          </div>
        </div>

        {/* Right Section: Quick Access */}
        <div
          className="w-full md:w-1/3 bg-blue-800 text-white p-3 xs:p-4 sm:p-6 md:p-8 flex flex-col justify-center"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          <h3 className="text-xs xs:text-sm sm:text-base font-semibold mb-1 xs:mb-2 sm:mb-4 uppercase">
            Quick Access
          </h3>
          <div className="space-y-1 xs:space-y-2 sm:space-y-4">
            <Link
              href="/pay-bill"
              className="flex items-center space-x-2 hover:underline text-xs xs:text-sm sm:text-base"
            >
              <span className="text-base xs:text-lg sm:text-xl">💵</span>
              <span>Pay a bill</span>
            </Link>
            <Link
              href="/refill-prescription"
              className="flex items-center space-x-2 hover:underline text-xs xs:text-sm sm:text-base"
            >
              <span className="text-base xs:text-lg sm:text-xl">📦</span>
              <span>Refill a prescription</span>
            </Link>
          </div>

          <div className="mt-4 xs:mt-6 sm:mt-8">
            <h3 className="text-xs xs:text-sm sm:text-base font-semibold mb-1 xs:mb-2 sm:mb-4 uppercase">
              Get the Minimalistic Clinic App
            </h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Link href="https://play.google.com/store">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  width={96}
                  height={28}
                  className="w-20 xs:w-24 sm:w-32 h-auto"
                />
              </Link>
              <Link href="https://www.apple.com/app-store/">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store"
                  width={84}
                  height={28}
                  className="w-16 xs:w-20 sm:w-28 h-auto"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Dynamic Date */}
      <footer
        className="w-full border-t border-gray-200 py-4 text-center text-sm text-gray-700"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        <div className="flex flex-col items-center space-y-1">
          <span className="font-semibold uppercase text-md underline">
            Legal restrictions and terms of use applicable to this site
          </span>
          <span className="text-gray-400">
            Use of this site signifies your agreement to the terms of use.
          </span>
          <span>
            © 1998 - 2025 Minimalistic Foundation for Medical Education and Research.
            All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default PasswordPage;