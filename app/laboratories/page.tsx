'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Homepage/page';
import Footer from '@/app/components/Footer/page';

// Define interfaces for TypeScript
interface Lab {
  id: string;
  name: string;
}

const LaboratoriesPage: React.FC = () => {
  const [alphabets, setAlphabets] = useState<string[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>('A');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch alphabets on component mount
  useEffect(() => {
    const fetchAlphabets = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/hospital/labs/alphabets', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch alphabets');
        }
        const data: string[] = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Alphabets API did not return an array');
        }
        setAlphabets(data);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching alphabets');
      } finally {
        setLoading(false);
      }
    };
    fetchAlphabets();
  }, []);

  // Fetch labs when a letter is selected
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/hospital/labs/alphabets/${selectedLetter}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch labs for letter ${selectedLetter}`);
        }
        const data: Lab[] = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Labs API did not return an array');
        }
        // Validate lab objects
        const validLabs = data.filter(
          (item): item is Lab =>
            item &&
            typeof item === 'object' &&
            'id' in item &&
            'name' in item &&
            typeof item.name === 'string'
        );
        setLabs(validLabs);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching labs');
        setLabs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, [selectedLetter]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <Header />
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-100 to-gray-200 py-8 sm:py-12 md:py-16 text-center">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-4"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Explore Our Laboratories
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl sm:max-w-2xl mx-auto">
          Discover cutting-edge research labs driving innovation in medical science.
        </p>
      </section>

      {/* Main Content */}
      <main className="flex flex-col md:flex-row flex-1 py-6 sm:py-8 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 gap-6 md:gap-8 lg:gap-12">
        {/* Alphabet Grid */}
        <aside className="w-full md:w-1/4">
          <h3
            className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Browse Labs
          </h3>
          {loading && !selectedLetter && (
            <p className="text-gray-500 text-sm sm:text-base animate-pulse">
              Loading alphabets...
            </p>
          )}
          {error && (
            <p className="text-red-500 text-sm font-medium mb-4">{error}</p>
          )}
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-2 sm:gap-3">
            {alphabets.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`border border-gray-300 text-xs sm:text-sm font-semibold w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg transition-all duration-300 ${
                  selectedLetter === letter
                    ? 'bg-red-700 text-white shadow-md'
                    : 'text-blue-600 hover:bg-blue-50 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none'
                }`}
                aria-pressed={selectedLetter === letter}
                disabled={loading}
              >
                {letter}
              </button>
            ))}
          </div>
        </aside>

        {/* Labs List */}
        <div className="flex-1 w-full">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8 text-center"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Laboratories
          </h2>
          {loading && selectedLetter ? (
            <div className="space-y-3 sm:space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="h-12 sm:h-16 bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : labs.length > 0 ? (
            <ul className="space-y-3 sm:space-y-4 animate-fade-in">
              {labs.map((lab) => (
                <li
                  key={lab.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Link
                    href={`/labs/${lab.id}`}
                    className="text-red-700 hover:text-red-800 text-sm sm:text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {lab.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm sm:text-base text-gray-500 italic text-center">
              No labs found for the letter {selectedLetter}.
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <div className="bg-white shadow-lg">
        <Footer />
      </div>
    </div>
  );
};

export default LaboratoriesPage;