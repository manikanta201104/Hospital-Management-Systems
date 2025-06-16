'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    terms: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = {
      email: '',
      terms: '',
    };

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'This field is mandatory';
      hasErrors = true;
    } else if (!email.includes('@') || !email.toLowerCase().endsWith('@gmail.com')) {
      newErrors.email = 'Please enter a valid Gmail address (e.g., example@gmail.com)';
      hasErrors = true;
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      newErrors.terms = 'Please accept the terms of service and privacy policy';
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      router.push(`/otp?email=${encodeURIComponent(email)}`);
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
        {/* Left Section: Signup Form */}
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

          {/* Welcome Text */}
          <h1
            className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-2 xs:mb-3 sm:mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Create an Account
          </h1>
          <h2
            className="text-xs xs:text-sm sm:text-base text-gray-900 mb-4 xs:mb-6 sm:mb-8 text-center"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            Create your{' '}
            <Link href="#" className="text-blue-600 hover:underline">
              Patient Online Services Account
            </Link>{' '}
            using the form below.
          </h2>

          {/* Signup Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xs xs:max-w-sm sm:max-w-md bg-white border border-gray-200 rounded-lg p-3 xs:p-4 sm:p-6 shadow-none xs:shadow-sm"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {/* Email Field */}
            <div className="mb-3 xs:mb-4">
              <label
                htmlFor="email"
                className="block text-xs xs:text-sm sm:text-base text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 xs:px-4 py-2 border border-gray-300 text-gray-900 rounded-full text-xs xs:text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Enter your email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs xs:text-sm sm:text-base text-red-500" aria-live="polite">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="mb-3 xs:mb-4 flex items-start">
              <input
                type="checkbox"
                id="accept-terms"
                className="h-4 w-4 xs:h-5 xs:w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-all duration-300 mt-0.5"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                aria-invalid={!!errors.terms}
                aria-describedby={errors.terms ? 'terms-error' : undefined}
              />
              <label
                htmlFor="accept-terms"
                className="ml-2 text-xs xs:text-sm sm:text-base text-gray-700"
              >
                By signing up, I accept the Minimalistic Clinic{' '}
                <Link href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and acknowledge the{' '}
                <Link href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>.
              </label>
            </div>
            {errors.terms && (
              <p id="terms-error" className="mb-3 xs:mb-4 text-xs xs:text-sm sm:text-base text-red-500" aria-live="polite">
                {errors.terms}
              </p>
            )}

            {/* Sign up Button */}
            <button
              type="submit"
              className="w-full bg-blue-800 text-white rounded-full py-2 min-h-10 text-xs xs:text-sm sm:text-base font-semibold hover:bg-blue-900 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
            >
              Next
            </button>

            {/* Login Link */}
            <div className="mt-3 xs:mt-4 text-center">
              <p className="text-xs xs:text-sm sm:text-base text-gray-700">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Log in.
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right Section: Quick Access and App Links */}
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

export default SignupPage;