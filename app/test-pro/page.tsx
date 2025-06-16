'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/app/components/Homepage/page';
import Footer from '@/app/components/Footer/page';
import Link from 'next/link';

interface Test {
  _id: string;
  name: string;
  link?: string;
  seeAlso?: string;
  firstLetter: string;
  __v: number;
}

const TestsProceduresPage = () => {
  const [alphabet, setAlphabet] = useState<string[]>([]);
  const [disabledLetters, setDisabledLetters] = useState<string[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [loadingAlphabet, setLoadingAlphabet] = useState<boolean>(true);
  const [loadingTests, setLoadingTests] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Fetch alphabet letters on component mount
  useEffect(() => {
    const fetchAlphabet = async () => {
      try {
        setLoadingAlphabet(true);
        setError('');
        const response = await fetch('http://localhost:5000/api/hospital/tests/alphabets', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch alphabet letters');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Alphabet API did not return an array');
        }
        setAlphabet(data);

        // Check which letters have no tests (to disable them)
        const disabled: string[] = [];
        for (const letter of data) {
          try {
            const testResponse = await fetch(`http://localhost:5000/api/hospital/tests/${letter}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            });
            if (testResponse.ok) {
              const testsData = await testResponse.json();
              if (!Array.isArray(testsData) || testsData.length === 0) {
                disabled.push(letter);
              }
            } else {
              disabled.push(letter); // Disable letter if fetch fails
            }
          } catch {
            disabled.push(letter); // Disable letter on error
          }
        }
        setDisabledLetters(disabled);
      } catch (err) {
        console.error('Error fetching alphabet:', err);
        setError('Failed to load alphabet letters. Please try again later.');
        setAlphabet([]);
      } finally {
        setLoadingAlphabet(false);
      }
    };

    fetchAlphabet();
  }, []);

  // Fetch tests/procedures when a letter is clicked
  const handleLetterClick = async (letter: string) => {
    if (disabledLetters.includes(letter)) return;

    setSelectedLetter(letter);
    setLoadingTests(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/hospital/tests/${letter}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch tests for letter ${letter}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Tests API did not return an array');
      }
      // Validate test objects
      const validTests = data.filter(
        (item): item is Test =>
          item &&
          typeof item === 'object' &&
          '_id' in item &&
          'name' in item &&
          typeof item.name === 'string' &&
          'firstLetter' in item &&
          '__v' in item
      );
      setTests(validTests);
      if (data.length > 0 && validTests.length === 0) {
        setError(`No valid tests found for letter ${letter}. Data format is incorrect.`);
      }
    } catch (err) {
      console.error(`Error fetching tests for letter ${letter}:`, err);
      setError(`Failed to load tests for letter ${letter}. Please try again.`);
      setTests([]);
    } finally {
      setLoadingTests(false);
    }
  };

  const advertisementLinks = [
    { label: 'NEW: Mayo Clinic Guide to Better Sleep', href: '#' },
    { label: 'Listen to Health Matters Podcast', href: '#' },
    { label: 'Mayo Clinic on Incontinence', href: '#' },
    { label: 'The Essential Diabetes Book', href: '#' },
    { label: 'FREE Mayo Clinic Diet Assessment', href: '#' },
    { label: 'Mayo Clinic Health Letter - FREE book', href: '#', bold: true },
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 text-gray-900 font-mayoSans"
      style={{ fontFamily: "'mayo-sans', 'Times', sans-serif'" }}
    >
      {/* Header */}
      <div className="bg-white shadow-lg">
        <Header />
      </div>

      {/* Tests and Procedures Section */}
      <section className="flex-grow px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 max-w-7xl mx-auto w-full">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 font-mayoDisplay"
          style={{ fontFamily: "'mayo-display', 'Georgia', serif'" }}
        >
          Tests and Procedures
        </h1>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-8 sm:mb-12">
          What it is, how it’s done, how to prepare, risks and results.
        </p>

        {/* Main Content: Alphabet Left, Advertisement Right */}
        <div className="flex flex-col md:flex-row justify-center gap-6 sm:gap-8 w-full">
          {/* Alphabet Grid and Sections */}
          <div className="flex-1">
            <h2
              className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 font-mayoDisplay"
              style={{ fontFamily: "'mayo-display', 'Georgia', serif'" }}
            >
              Find a test or procedure by its first letter
            </h2>
            {error && <p className="text-red-600 text-sm sm:text-base mb-4">{error}</p>}
            {loadingAlphabet ? (
              <p className="text-gray-600 text-sm sm:text-base mb-8 sm:mb-12 animate-pulse">Loading alphabet...</p>
            ) : alphabet.length > 0 ? (
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-14 gap-2 sm:gap-3 mb-8 sm:mb-12">
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleLetterClick(letter)}
                    disabled={disabledLetters.includes(letter)}
                    aria-disabled={disabledLetters.includes(letter)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 border border-blue-500 font-bold rounded-md text-blue-800 text-sm sm:text-base transition-all duration-300 ease-in-out ${
                      disabledLetters.includes(letter)
                        ? 'cursor-not-allowed opacity-40'
                        : 'hover:bg-blue-100 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    } ${selectedLetter === letter && !disabledLetters.includes(letter) ? 'bg-blue-200 shadow-md' : ''}`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm sm:text-base mb-8 sm:mb-12">No alphabet letters available.</p>
            )}

            {/* Display Tests/Procedures */}
            {selectedLetter && (
              <div className="mb-8 sm:mb-12">
                <h3
                  className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 font-mayoDisplay"
                  style={{ fontFamily: "'mayo-display', 'Georgia', serif'" }}
                >
                  Tests and Procedures starting with {selectedLetter}
                </h3>
                {loadingTests ? (
                  <p className="text-gray-600 text-sm sm:text-base animate-pulse">Loading tests...</p>
                ) : tests.length > 0 ? (
                  <ul className="space-y-2 sm:space-y-3">
                    {tests.map((test) => (
                      <li key={test._id} className="border-b border-gray-200 py-2">
                        {test.link ? (
                          <Link
                            href={test.link}
                            className="text-blue-900 hover:underline text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {test.name}
                          </Link>
                        ) : (
                          <span className="text-gray-900 text-sm sm:text-base">{test.name}</span>
                        )}
                        {test.seeAlso && (
                          <p className="text-xs sm:text-sm text-gray-600">See also: {test.seeAlso}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 text-sm sm:text-base">No tests found for letter {selectedLetter}.</p>
                )}
              </div>
            )}

            {/* Appointments and Clinical Trials Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5">
                <h3
                  className="text-base sm:text-lg font-semibold text-gray-900 mb-2 font-mayoDisplay"
                  style={{ fontFamily: "'mayo-display', 'Georgia', serif'" }}
                >
                  Appointments
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">
                  Mayo Clinic accepts appointments in Arizona, Florida and Minnesota and at Mayo Clinic Health System sites.
                </p>
                <Link
                  href="/request-appointment"
                  className="text-blue-900 hover:underline text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Request an Appointment
                </Link>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5">
                <h3
                  className="text-base sm:text-lg font-semibold text-gray-900 mb-2 font-mayoDisplay"
                  style={{ fontFamily: "'mayo-display', 'Georgia', serif'" }}
                >
                  Clinical trials at Mayo Clinic
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">
                  Mayo Clinic conducts thousands of clinical trials and research studies each year.
                </p>
                <Link
                  href="/clinical-trials"
                  className="text-blue-900 hover:underline text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Find active clinical trials
                </Link>
              </div>
            </div>
          </div>

          {/* Advertisement Sidebar */}
          <div className="w-full md:w-80 bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 shrink-0">
            <h4
              className="text-gray-600 font-semibold text-xs sm:text-sm mb-2"
              style={{ fontFamily: "'mayo-sans', 'Times', sans-serif'" }}
            >
              Advertisement
            </h4>
            <h5
              className="text-gray-900 font-semibold text-sm sm:text-base mb-2"
              style={{ fontFamily: "'mayo-sans', 'Times', sans-serif'" }}
            >
              Mayo Clinic Press
            </h5>
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              Check out these best-sellers and special offers on books and newsletters from Mayo Clinic Press.
            </p>
            <ul className="space-y-1">
              {advertisementLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className={`text-blue-700 hover:underline text-xs sm:text-sm ${
                      link.bold ? 'font-semibold' : ''
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Margin above footer */}
        <div className="mt-8 sm:mt-12" />
      </section>

      {/* Footer */}
      <div className="bg-white shadow-lg">
        <Footer />
      </div>
    </div>
  );
};

export default TestsProceduresPage;