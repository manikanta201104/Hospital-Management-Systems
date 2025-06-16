'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

const OtpPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({
    otp: '',
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

  const handleVerifyOtp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = {
      otp: '',
    };

    // Validate OTP field
    if (!otp.trim()) {
      newErrors.otp = 'OTP is required';
      hasErrors = true;
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = 'OTP must be a 6-digit number';
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      // Navigate to password page with email as query parameter
      router.push(`/password?email=${encodeURIComponent(email)}`);
    }
  };

  const handleResendCode = () => {
    console.log('Resending OTP to:', email);
    alert(`A new OTP has been sent to ${email}`);
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
        {/* Left Section: OTP Form */}
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
            Verify Your Email
          </h1>
          <p
            className="text-xs xs:text-sm sm:text-base text-gray-900 mb-4 xs:mb-6 sm:mb-8 text-center"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            Enter the 6-digit code we sent to{' '}
            <span className="font-medium">{email}</span>
          </p>

          {/* OTP Form */}
          <div
            className="w-full max-w-xs xs:max-w-sm sm:max-w-md bg-white border border-gray-200 rounded-lg p-3 xs:p-4 sm:p-6 shadow-none xs:shadow-sm"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {/* OTP Field */}
            <div className="mb-3 xs:mb-4">
              <label
                htmlFor="otp"
                className="block text-xs xs:text-sm sm:text-base text-gray-700 mb-1"
              >
                OTP
              </label>
              <input
                type="text"
                id="otp"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full border border-gray-300 rounded-md px-3 xs:px-4 py-2 text-xs xs:text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-gray-900 text-center"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                aria-invalid={!!errors.otp}
                aria-describedby={errors.otp ? 'otp-error' : undefined}
              />
              {errors.otp && (
                <p id="otp-error" className="mt-1 text-xs xs:text-sm sm:text-base text-red-500" aria-live="polite">
                  {errors.otp}
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-800 text-white rounded-full py-2 min-h-10 text-xs xs:text-sm sm:text-base font-semibold hover:bg-blue-900 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              Verify OTP
            </button>

            {/* Resend Code Link */}
            <div className="mt-3 xs:mt-4 text-center">
              <p className="text-xs xs:text-sm sm:text-base text-gray-700">
                Didn’t receive a code?{' '}
                <button
                  onClick={handleResendCode}
                  className="text-blue-600 hover:underline focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  Resend code
                </button>
              </p>
            </div>
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

export default OtpPage;