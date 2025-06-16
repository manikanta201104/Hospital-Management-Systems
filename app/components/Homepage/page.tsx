'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaSearch, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Define type for user details from API
interface UserDetails {
  username?: string;
  email?: string;
  [key: string]: any;
}

const Navbar: React.FC = () => {
  const [isCareDropdownOpen, setIsCareDropdownOpen] = useState(false);
  const [isHealthDropdownOpen, setIsHealthDropdownOpen] = useState(false);
  const [isMedicalDropdownOpen, setIsMedicalDropdownOpen] = useState(false);
  const [isResearchDropdownOpen, setIsResearchDropdownOpen] = useState(false);
  const [isGivingDropdownOpen, setIsGivingDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      // Fetch user details from localStorage
      const storedUsername = localStorage.getItem('username') || 'User';
      const storedEmail = localStorage.getItem('email') || '';
      setUsername(storedUsername);
      setEmail(storedEmail);

      // Fetch user details from API
      const fetchUserDetails = async () => {
        try {
          const response = await fetch('http://localhost:5000/auth/me', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          const data: UserDetails = await response.json();
          console.log('Fetched user details:', response.status, data);
          if (response.ok) {
            const newUsername = data.username || storedUsername;
            const newEmail = data.email || storedEmail;
            setUsername(newUsername);
            setEmail(newEmail);
            localStorage.setItem('username', newUsername);
            localStorage.setItem('email', newEmail);
          } else {
            console.warn('API response not OK:', data);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };
      fetchUserDetails();
    }
  }, []);

  useEffect(() => {
    // Prevent scroll when dropdowns or mobile menu are open
    document.body.style.overflow =
      isCareDropdownOpen ||
      isHealthDropdownOpen ||
      isMedicalDropdownOpen ||
      isResearchDropdownOpen ||
      isGivingDropdownOpen ||
      isMobileMenuOpen ||
      isProfileDropdownOpen
        ? 'hidden'
        : 'auto';

    // Handle window resize to reset mobile menu on desktop
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // Tailwind's lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call on mount to ensure correct initial state

    return () => window.removeEventListener('resize', handleResize);
  }, [
    isCareDropdownOpen,
    isHealthDropdownOpen,
    isMedicalDropdownOpen,
    isResearchDropdownOpen,
    isGivingDropdownOpen,
    isMobileMenuOpen,
    isProfileDropdownOpen,
  ]);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
      });
      if (response.ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        setUsername('');
        setEmail('');
        router.push('/');
        alert('Logged out successfully!');
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('isLoggedIn');
      setIsLoggedIn(false);
      setUsername('');
      setEmail('');
      router.push('/');
      alert('Logged out successfully!');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsCareDropdownOpen(false);
    setIsHealthDropdownOpen(false);
    setIsMedicalDropdownOpen(false);
    setIsResearchDropdownOpen(false);
    setIsGivingDropdownOpen(false);
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2 md:py-3 bg-gradient-to-r from-blue-50 to-blue-100 backdrop-blur-md border-b border-blue-200 shadow-lg w-full z-50 transition-all duration-300 ease-in-out font-sans">
      {/* Left: Logo */}
      <div className="flex items-center flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-all duration-200 ease-in-out">
          <Image
            src="/images/logo.png"
            alt="Minimalistic Clinic Logo"
            width={48}
            height={48}
            priority
            className="rounded-full border-2 border-blue-400 ring-2 ring-blue-300 shadow-sm"
          />
          <span className="hidden sm:block text-sm md:text-base font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            Minimalistic Clinic
          </span>
        </Link>
      </div>

      {/* Center: Navigation Links (Desktop) */}
      <div className="hidden lg:flex items-center justify-center flex-1">
        <div className="flex items-center gap-4 xl:gap-6">
          {/* Care Dropdown */}
          <div className="relative group">
            <button
              onClick={() => {
                setIsCareDropdownOpen(!isCareDropdownOpen);
                setIsHealthDropdownOpen(false);
                setIsMedicalDropdownOpen(false);
                setIsResearchDropdownOpen(false);
                setIsGivingDropdownOpen(false);
                setIsProfileDropdownOpen(false);
              }}
              className="flex items-center space-x-1 text-xs xl:text-sm font-semibold text-gray-800 hover:text-blue-600 transition-all duration-300 ease-in-out"
            >
              <span>Care at Minimalistic Clinic</span>
              <FaChevronDown className={`text-xs transition-transform duration-300 ease-in-out ${isCareDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isCareDropdownOpen && (
              <div className="fixed left-0 top-[60px] bg-gradient-to-b from-white to-blue-50 bg-opacity-95 backdrop-blur-lg text-gray-800 shadow-2xl border border-blue-100 rounded-xl z-40 w-full animate-slide-down">
                <div className="max-w-7xl mx-auto py-6 px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col space-y-3">
                    <span className="text-base font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif', textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      Care Services
                    </span>
                    {[
                      ['Request Appointment', '/request-appointment'],
                      ['Find a Doctor', '/find-a-doctor'],
                      ['Locations', '/locations'],
                      ['Patient & Visitor Guide', '/patient-visitor'],
                      ['Contact Us', '/contact'],
                    ].map(([text, href]) => (
                      <Link
                        key={href}
                        href={href}
                        className="block py-2 px-4 text-sm text-gray-700 transition-all duration-200 ease-in-out"
                        onClick={() => setIsCareDropdownOpen(false)}
                      >
                        <span className="inline-block hover:bg-blue-100 hover:text-blue-600 hover:scale-105 hover:shadow-blue-200 rounded-lg transition-all duration-200 ease-in-out px-2 py-1">
                          {text}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Health Dropdown */}
          <div className="relative group">
            <button
              onClick={() => {
                setIsHealthDropdownOpen(!isHealthDropdownOpen);
                setIsCareDropdownOpen(false);
                setIsMedicalDropdownOpen(false);
                setIsResearchDropdownOpen(false);
                setIsGivingDropdownOpen(false);
                setIsProfileDropdownOpen(false);
              }}
              className="flex items-center space-x-1 text-xs xl:text-sm font-semibold text-gray-800 hover:text-blue-600 transition-all duration-300 ease-in-out"
            >
              <span>Health Library</span>
              <FaChevronDown className={`text-xs transition-transform duration-300 ease-in-out ${isHealthDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isHealthDropdownOpen && (
              <div className="fixed left-0 top-[60px] bg-gradient-to-b from-white to-blue-50 bg-opacity-95 backdrop-blur-lg text-gray-800 shadow-2xl border border-blue-100 rounded-xl z-40 w-full animate-slide-down">
                <div className="max-w-7xl mx-auto py-6 px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col space-y-3">
                    <span className="text-base font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif', textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      Health Resources
                    </span>
                    {[
                      ['Diseases & Conditions', '/conditions-diseases'],
                      ['Symptoms', '/symptoms'],
                      ['Tests & Procedures', '/test-pro'],
                    ].map(([text, href]) => (
                      <Link
                        key={href}
                        href={href}
                        className="block py-2 px-4 text-sm text-gray-700 transition-all duration-200 ease-in-out"
                        onClick={() => setIsHealthDropdownOpen(false)}
                      >
                        <span className="inline-block hover:bg-blue-100 hover:text-blue-600 hover:scale-105 hover:shadow-blue-200 rounded-lg transition-all duration-200 ease-in-out px-2 py-1">
                          {text}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Medical Professionals Dropdown */}
          <div className="relative group">
            <button
              onClick={() => {
                setIsMedicalDropdownOpen(!isMedicalDropdownOpen);
                setIsCareDropdownOpen(false);
                setIsHealthDropdownOpen(false);
                setIsResearchDropdownOpen(false);
                setIsGivingDropdownOpen(false);
                setIsProfileDropdownOpen(false);
              }}
              className="flex items-center space-x-1 text-xs xl:text-sm font-semibold text-gray-800 hover:text-blue-600 transition-all duration-300 ease-in-out"
            >
              <span>For Medical Professionals</span>
              <FaChevronDown className={`text-xs transition-transform duration-300 ease-in-out ${isMedicalDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isMedicalDropdownOpen && (
              <div className="fixed left-0 top-[60px] bg-gradient-to-b from-white to-blue-50 bg-opacity-95 backdrop-blur-lg text-gray-800 shadow-2xl border border-blue-100 rounded-xl z-40 w-full animate-slide-down">
                <div className="max-w-7xl mx-auto py-6 px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col space-y-3">
                    <span className="text-base font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif', textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      Professional Resources
                    </span>
                    {[
                      ['Medical Professional Resources', '/medical-professional-resources'],
                      ['Refer a Patient', '/refer-patient'],
                      ['Continuing Medical Education', '/continuing-medical-education'],
                      ['AskMinimalisticExpert', '/ask-Minimalistic'],
                    ].map(([text, href]) => (
                      <Link
                        key={href}
                        href={href}
                        className="block py-2 px-4 text-sm text-gray-700 transition-all duration-200 ease-in-out"
                        onClick={() => setIsMedicalDropdownOpen(false)}
                      >
                        <span className="inline-block hover:bg-blue-100 hover:text-blue-600 hover:scale-105 hover:shadow-blue-200 rounded-lg transition-all duration-200 ease-in-out px-2 py-1">
                          {text}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-3">
                    <span className="text-base font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif', textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      Additional Resources
                    </span>
                    {[
                      ['Minimalistic Clinic Laboratories', '/Minimalistic-clinic-laboratories'],
                      ['Video Center', '/video-center'],
                      ['Journals & Publications', '/journals-publications'],
                      ['Minimalistic Clinic Alumni Association', '/Minimalistic-clinic-alumni'],
                    ].map(([text, href]) => (
                      <Link
                        key={href}
                        href={href}
                        className="block py-2 px-4 text-sm text-gray-700 transition-all duration-200 ease-in-out"
                        onClick={() => setIsMedicalDropdownOpen(false)}
                      >
                        <span className="inline-block hover:bg-blue-100 hover:text-blue-600 hover:scale-105 hover:shadow-blue-200 rounded-lg transition-all duration-200 ease-in-out px-2 py-1">
                          {text}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Research & Education Dropdown */}
          <div className="relative group">
            <button
              onClick={() => {
                setIsResearchDropdownOpen(!isResearchDropdownOpen);
                setIsCareDropdownOpen(false);
                setIsHealthDropdownOpen(false);
                setIsMedicalDropdownOpen(false);
                setIsGivingDropdownOpen(false);
                setIsProfileDropdownOpen(false);
              }}
              className="flex items-center space-x-1 text-xs xl:text-sm font-semibold text-gray-800 hover:text-blue-600 transition-all duration-300 ease-in-out"
            >
              <span>Research & Education</span>
              <FaChevronDown className={`text-xs transition-transform duration-300 ease-in-out ${isResearchDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isResearchDropdownOpen && (
              <div className="fixed left-0 top-[60px] bg-gradient-to-b from-white to-blue-50 bg-opacity-95 backdrop-blur-lg text-gray-800 shadow-2xl border border-blue-100 rounded-xl z-40 w-full animate-slide-down">
                <div className="max-w-7xl mx-auto py-6 px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col space-y-3">
                    <span className="text-base font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif', textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      Research
                    </span>
                    {[
                      ['Research at Minimalistic Clinic', '/research-at-Minimalistic-clinic'],
                      ['Research Faculty', '/research-faculty'],
                      ['Laboratories', '/laboratories'],
                      ['Core Facilities', '/core-facilities'],
                      ['Centers & Programs', '/centers-programs'],
                      ['Departments & Divisions', '/departments-divisions'],
                      ['Clinical Trials', '/clinical-trials'],
                      ['Institutional Review Board', '/irb'],
                      ['Postdoctoral Fellowships', '/postdoctoral-fellowships'],
                      ['Training Grant Programs', '/training-grants'],
                    ].map(([text, href]) => (
                      <Link
                        key={href}
                        href={href}
                        className="block py-2 px-4 text-sm text-gray-700 transition-all duration-200 ease-in-out"
                        onClick={() => setIsResearchDropdownOpen(false)}
                      >
                        <span className="inline-block hover:bg-blue-100 hover:text-blue-600 hover:scale-105 hover:shadow-blue-200 rounded-lg transition-all duration-200 ease-in-out px-2 py-1">
                          {text}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-3">
                    <span className="text-base font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif', textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      Education
                    </span>
                    {[
                      ['Minimalistic Clinic College of Medicine and Science', '#'],
                      ['Minimalistic Clinic Graduate School of Biomedical Sciences', '#'],
                      ['Minimalistic Clinic Alix School of Medicine', '#'],
                      ['Minimalistic Clinic School of Graduate Medical Education', '#'],
                      ['Minimalistic Clinic School of Health Sciences', '#'],
                      ['Minimalistic Clinic School of Professional Development', '#'],
                    ].map(([text, href]) => (
                      <Link
                        key={href}
                        href={href}
                        className="block py-2 px-4 text-sm text-gray-700 transition-all duration-200 ease-in-out"
                        onClick={() => setIsResearchDropdownOpen(false)}
                      >
                        <span className="inline-block hover:bg-blue-100 hover:text-blue-600 hover:scale-105 hover:shadow-blue-200 rounded-lg transition-all duration-200 ease-in-out px-2 py-1">
                          {text}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Giving to Minimalistic Clinic Dropdown */}
          <div className="relative group">
            <button
              onClick={() => {
                setIsGivingDropdownOpen(!isGivingDropdownOpen);
                setIsCareDropdownOpen(false);
                setIsHealthDropdownOpen(false);
                setIsMedicalDropdownOpen(false);
                setIsResearchDropdownOpen(false);
                setIsProfileDropdownOpen(false);
              }}
              className="flex items-center space-x-1 text-xs xl:text-sm font-semibold text-gray-800 hover:text-blue-600 transition-all duration-300 ease-in-out"
            >
              <span>Giving to Minimalistic Clinic</span>
              <FaChevronDown className={`text-xs transition-transform duration-300 ease-in-out ${isGivingDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isGivingDropdownOpen && (
              <div className="fixed left-0 top-[60px] bg-gradient-to-b from-white to-blue-50 bg-opacity-95 backdrop-blur-lg text-gray-800 shadow-2xl border border-blue-100 rounded-xl z-40 w-full animate-slide-down">
                <div className="max-w-7xl mx-auto py-6 px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col space-y-3">
                    <span className="text-base font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif', textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      Support Us
                    </span>
                    {[
                      ['Give Now', '#'],
                      ['Giving to Minimalistic Clinic', '#'],
                      ['Frequently Asked Questions', '#'],
                      ['Contact Us to Give', '#'],
                    ].map(([text, href]) => (
                      <Link
                        key={href}
                        href={href}
                        className="block py-2 px-4 text-sm text-gray-700 transition-all duration-200 ease-in-out"
                        onClick={() => setIsGivingDropdownOpen(false)}
                      >
                        <span className="inline-block hover:bg-blue-100 hover:text-blue-600 hover:scale-105 hover:shadow-blue-200 rounded-lg transition-all duration-200 ease-in-out px-2 py-1">
                          {text}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Login + Profile (Desktop and Tablet) */}
      <div className="hidden md:flex items-center gap-3 flex-shrink-0">
        <Link
          href="/reqappointment"
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-full hover:scale-105 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 ease-in-out whitespace-nowrap"
        >
          Request Appointment
        </Link>
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 text-xs text-gray-800 hover:text-blue-600 transition-all duration-300 ease-in-out"
            >
              <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-blue-400 shadow-sm">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="hidden lg:block font-semibold">Hi, {username}</span>
              <FaChevronDown className={`text-xs transition-transform duration-300 ease-in-out ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gradient-to-b from-white to-blue-50 bg-opacity-95 backdrop-blur-lg text-gray-800 shadow-2xl border border-blue-100 rounded-xl z-40 animate-slide-down">
                <div className="py-4 px-4">
                  <p className="text-xs font-semibold text-gray-900">Username: {username}</p>
                  <p className="text-xs text-gray-600 mt-1">Email: {email}</p>
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full bg-gradient-to-r from-red-700 to-red-800 text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:scale-105 hover:shadow-lg hover:shadow-red-200 transition-all duration-300 ease-in-out"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center space-x-1 text-xs font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300 ease-in-out whitespace-nowrap"
          >
            <FaUser className="text-xs transition-transform duration-300 ease-in-out" />
            <span>Log in</span>
          </Link>
        )}
        <Link href="/search" className="text-gray-800 hover:text-blue-600 transition-colors duration-300 ease-in-out">
          <FaSearch className="text-xs hover:rotate-90 transition-transform duration-300 ease-in-out" />
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMobileMenu} className="text-gray-800 hover:text-blue-600 transition-colors duration-300 ease-in-out">
          {isMobileMenuOpen ? (
            <FaTimes className="text-lg hover:rotate-90 transition-transform duration-300 ease-in-out" />
          ) : (
            <FaBars className="text-lg hover:rotate-90 transition-transform duration-300 ease-in-out" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-[52px] left-0 w-full h-[calc(100vh-52px)] bg-black bg-opacity-60 z-40">
          <div className="md:hidden fixed top-[52px] right-0 w-full sm:w-3/4 max-w-sm bg-gradient-to-b from-white to-blue-50 bg-opacity-95 backdrop-blur-lg text-gray-800 shadow-2xl border-l border-blue-100 h-[calc(100vh-52px)] z-50 transform transition-transform duration-300 ease-in-out rounded-l-xl overflow-y-auto">
            <div className="flex flex-col py-5 px-5 space-y-4">
              {/* Care Section */}
              <div>
                <button
                  onClick={() => setIsCareDropdownOpen(!isCareDropdownOpen)}
                  className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 ease-in-out px-2 py-1 rounded-lg"
                >
                  <span>Care at Minimalistic Clinic</span>
                  <FaChevronDown className={`text-sm transition-transform duration-300 ease-in-out ${isCareDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCareDropdownOpen && (
                  <div className="flex flex-col space-y-2 mt-2 pl-4 border-l-2 border-blue-200 bg-gradient-to-b from-white to-blue-50 bg-opacity-95 rounded-lg animate-slide-down">
                    {[
                      ['Request Appointment', '/request-appointment'],
                      ['Find a Doctor', '/find-a-doctor'],
                      ['Locations', '/locations'],
                      ['Patient & Visitor Guide', '/pat-vis'],
                      ['Contact Us', '/contact'],
                    ].map(([text, href]) => (
                      <Link
                        key={href}
                        href={href}
                        className="block py-2 text-sm text-gray-700 transition-all duration-200 ease-in-out"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsCareDropdownOpen(false);
                        }}
                      >
                        <span className="inline-block hover:bg-blue-100 hover:text-blue-600 hover:scale-105 hover:shadow-blue-200 rounded-lg transition-all duration-200 ease-in-out px-2 py-1">
                          {text}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Health Section */}
              <div className="border-t border-blue-200 pt-3">
                <button
                  onClick={() => setIsHealthDropdownOpen(!isHealthDropdownOpen)}
                  className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 ease-in-out px-2 py-1 rounded-lg"
                >
                  <span>Health Library</span>
                  <FaChevronDown className={`text-sm transition-transform duration-300 ease-in-out ${isHealthDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isHealthDropdownOpen && (
                  <div className="flex flex-col space-y-2 mt-2 pl-4 border-l-2 border-blue-200 bg-gradient-to-b from-white to-blue-50 bg-opacity-95 rounded-lg animate-slide-down">
                    {[
                      ['Diseases & Conditions', '/conditions-diseases'],
                      ['Symptoms', '/symptoms'],
                      ['Tests & Procedures', '/test-pro'],
                    ].map(([text, href]) => (
                      <Link
                        key={href}
                        href={href}
                        className="block py-2 text-sm text-gray-700 transition-all duration-200 ease-in-out"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsHealthDropdownOpen(false);
                        }}
                      >
                        <span className="inline-block hover:bg-blue-100 hover:text-blue-600 hover:scale-105 hover:shadow-blue-200 rounded-lg transition-all duration-200 ease-in-out px-2 py-1">
                          {text}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Medical Professionals Section */}
              <div className="border-t border-blue-200 pt-3">
                <button
                  onClick={() => setIsMedicalDropdownOpen(!isMedicalDropdownOpen)}
                  className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 ease-in-out px-2 py-1 rounded-lg"
                >
                  <span>For Medical Professionals</span>
                  <FaChevronDown className={`text-sm transition-transform duration-300 ease-in-out ${isMedicalDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMedicalDropdownOpen && (
                  <div className="flex flex-col space-y-2 mt-2 pl-4 border-l-2 border-blue-200 bg-gradient-to-b from-white to-blue-50 bg-opacity-95 rounded-lg animate-slide-down">
                    {[
                      ['Medical Professional Resources', '/medical-professional-resources'],
                      ['Refer a Patient', '/refer-patient'],
                      ['Continuing Medical Education', '/continuing-medical-education'],
                      ['AskMinimalisticExpert', '/ask-Minimalistic'],
                      ['Minimalistic Clinic Laboratories', '/Minimalistic-clinic-laboratories'],
                      ['Video Center', '/video-center'],
                      ['Journals & Publications', '/journals-publications'],
                      ['Minimalistic Clinic Alumni Association', '/Minimalistic-clinic-alumni'],
                    ].map(([text, href]) => (
                      <Link
                        key={href}
                        href={href}
                        className="block py-2 text-sm text-gray-700 transition-all duration-200 ease-in-out"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMedicalDropdownOpen(false);
                        }}
                      >
                        <span className="inline-block hover:bg-blue-100 hover:text-blue-600 hover:scale-105 hover:shadow-blue-200 rounded-lg transition-all duration-200 ease-in-out px-2 py-1">
                          {text}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Research & Education Section */}
              <div className="border-t border-blue-200 pt-3">
                <button
                  onClick={() => setIsResearchDropdownOpen(!isResearchDropdownOpen)}
                  className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 ease-in-out px-2 py-1 rounded-lg"
                >
                  <span>Research & Education</span>
                  <FaChevronDown className={`text-sm transition-transform duration-300 ease-in-out ${isResearchDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isResearchDropdownOpen && (
                  <div className="flex flex-col space-y-2 mt-2 pl-4 border-l-2 border-blue-200 bg-gradient-to-b from-white to-blue-50 bg-opacity-95 rounded-lg animate-slide-down">
                    {[
                      ['Research at Minimalistic Clinic', '/research-at-Minimalistic-clinic'],
                      ['Research Faculty', '/research-faculty'],
                      ['Laboratories', '/laboratories'],
                      ['Core Facilities', '/core-facilities'],
                      ['Centers & Programs', '/centers-programs'],
                      ['Departments & Divisions', '/departments-divisions'],
                      ['Clinical Trials', '/clinical-trials'],
                      ['Institutional Review Board', '/irb'],
                      ['Postdoctoral Fellowships', '/postdoctoral-fellowships'],
                      ['Training Grant Programs', '/training-grants'],
                      ['Minimalistic Clinic College of Medicine and Science', '#'],
                      ['Minimalistic Clinic Graduate School of Biomedical Sciences', '#'],
                      ['Minimalistic Clinic Alix School of Medicine', '#'],
                      ['Minimalistic Clinic School of Graduate Medical Education', '#'],
                      ['Minimalistic Clinic School of Health Sciences', '#'],
                      ['Minimalistic Clinic School of Professional Development', '#'],
                    ].map(([text, href]) => (
                      <Link
                        key={href}
                        href={href}
                        className="block py-2 text-sm text-gray-700 transition-all duration-200 ease-in-out"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsResearchDropdownOpen(false);
                        }}
                      >
                        <span className="inline-block hover:bg-blue-100 hover:text-blue-600 hover:scale-105 hover:shadow-blue-200 rounded-lg transition-all duration-200 ease-in-out px-2 py-1">
                          {text}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Giving Section */}
              <div className="border-t border-blue-200 pt-3">
                <button
                  onClick={() => setIsGivingDropdownOpen(!isGivingDropdownOpen)}
                  className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 ease-in-out px-2 py-1 rounded-lg"
                >
                  <span>Giving to Minimalistic Clinic</span>
                  <FaChevronDown className={`text-sm transition-transform duration-300 ease-in-out ${isGivingDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isGivingDropdownOpen && (
                  <div className="flex flex-col space-y-2 mt-2 pl-4 border-l-2 border-blue-200 bg-gradient-to-b from-white to-blue-50 bg-opacity-95 rounded-lg animate-slide-down">
                    {[
                      ['Give Now', '#'],
                      ['Giving to Minimalistic Clinic', '#'],
                      ['Frequently Asked Questions', '#'],
                      ['Contact Us to Give', '#'],
                    ].map(([text, href]) => (
                      <Link
                        key={href}
                        href={href}
                        className="block py-2 text-sm text-gray-700 transition-all duration-200 ease-in-out"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsGivingDropdownOpen(false);
                        }}
                      >
                        <span className="inline-block hover:bg-blue-100 hover:text-blue-600 hover:scale-105 hover:shadow-blue-200 rounded-lg transition-all duration-200 ease-in-out px-2 py-1">
                          {text}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile/Login Section */}
              <div className="border-t border-blue-200 pt-4">
                <Link
                  href="/reqappointment"
                  className="block py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 ease-in-out px-2 py-1 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Request Appointment
                </Link>
                {isLoggedIn ? (
                  <div className="flex flex-col space-y-2 mt-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-blue-400 shadow-sm">
                        {username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-800">Hi, {username}</span>
                    </div>
                    <p className="text-xs text-gray-600">Email: {email}</p>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-red-700 to-red-800 text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:scale-105 hover:shadow-lg hover:shadow-red-200 transition-all duration-300 ease-in-out"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center space-x-1 py-2 text-sm font-semibold text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 ease-in-out px-2 py-1 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaUser className="text-sm transition-transform duration-300 ease-in-out" />
                    <span>Log in</span>
                  </Link>
                )}
                <Link
                  href="/search"
                  className="flex items-center space-x-1 py-2 text-sm font-semibold text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 ease-in-out px-2 py-1 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaSearch className="text-sm hover:rotate-90 transition-transform duration-300 ease-in-out" />
                  <span>Search</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;