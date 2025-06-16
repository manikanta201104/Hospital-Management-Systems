'use client';

import React, { useState, useEffect } from 'react';
import HomepageHeader from '../components/Homepage/page';
import Footer from '../components/Footer/page';

interface Symptom {
  _id: string;
  name: string;
  description: string;
}

const SymptomsPage = () => {
  const [alphabets, setAlphabets] = useState<string[]>([]);
  const [disabledLetters, setDisabledLetters] = useState<string[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loadingAlphabets, setLoadingAlphabets] = useState<boolean>(true);
  const [loadingSymptoms, setLoadingSymptoms] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch alphabets on component mount
  useEffect(() => {
    const fetchAlphabets = async () => {
      try {
        setLoadingAlphabets(true);
        setError(null);
        const response = await fetch('http://localhost:5000/api/hospital/symptoms/alphabets', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch alphabets');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Alphabets API did not return an array');
        }
        setAlphabets(data);

        // Determine disabled letters (all letters from A-Z and # that are not in the API response)
        const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
        const disabled = allLetters.filter((letter) => !data.includes(letter));
        setDisabledLetters(disabled);

        setLoadingAlphabets(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load alphabets. Please try again later.');
        setLoadingAlphabets(false);
      }
    };
    fetchAlphabets();
  }, []);

  // Fetch symptoms when a letter is selected
  useEffect(() => {
    if (!selectedLetter) return;

    const fetchSymptoms = async () => {
      try {
        setLoadingSymptoms(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/api/hospital/symptoms/${selectedLetter}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch symptoms for letter ${selectedLetter}`);
        }
        const data = await response.json();
        // Ensure data is an array
        const symptomsArray = Array.isArray(data) ? data : [];
        // Validate that each item matches the Symptom interface
        const validSymptoms = symptomsArray.filter(
          (item: any): item is Symptom =>
            item &&
            typeof item === 'object' &&
            '_id' in item &&
            'name' in item &&
            typeof item.name === 'string' &&
            'description' in item &&
            typeof item.description === 'string'
        );
        setSymptoms(validSymptoms);
        if (symptomsArray.length > 0 && validSymptoms.length === 0) {
          setError(`No valid symptoms found for letter ${selectedLetter}. Data format is incorrect.`);
        }
        setLoadingSymptoms(false);
      } catch (err: any) {
        setError(err.message || `Failed to load symptoms for letter ${selectedLetter}. Please try again later.`);
        setSymptoms([]);
        setLoadingSymptoms(false);
      }
    };
    fetchSymptoms();
  }, [selectedLetter]);

  const handleLetterClick = (letter: string) => {
    if (!disabledLetters.includes(letter)) {
      setSelectedLetter(letter);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <HomepageHeader />

      {/* Subheading */}
      <div className="mt-6 sm:mt-8 text-center px-4 sm:px-6">
        <h2
          className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900"
          style={{ fontFamily: '"mayo-display", Georgia, serif' }}
        >
          Find a symptom by its first letter
        </h2>
      </div>

      {/* Main Content: Alphabet and Advertisement */}
      <div className="flex flex-col md:flex-row justify-center mt-6 sm:mt-8 gap-6 sm:gap-8 px-4 sm:px-6 md:px-8 lg:px-10 max-w-7xl mx-auto w-full">
        {/* Alphabet Grid */}
        <div className="flex-1">
          {loadingAlphabets ? (
            <p className="text-gray-600 text-sm sm:text-base animate-pulse">Loading alphabets...</p>
          ) : error ? (
            <p className="text-red-600 text-sm sm:text-base font-medium">{error}</p>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-14 gap-2 sm:gap-3">
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('').map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  disabled={disabledLetters.includes(letter)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 border border-blue-500 font-bold rounded-md text-blue-800 text-sm sm:text-base transition-all duration-300 ease-in-out ${
                    disabledLetters.includes(letter)
                      ? 'cursor-not-allowed opacity-40'
                      : 'hover:bg-blue-100 hover:shadow-md'
                  } ${selectedLetter === letter && !disabledLetters.includes(letter) ? 'bg-blue-200 shadow-md' : ''}`}
                >
                  {letter}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Advertisement Sidebar */}
        <div className="w-full md:w-80 bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 shrink-0">
          <h4
            className="text-gray-600 font-semibold text-xs sm:text-sm mb-2"
            style={{ fontFamily: '"mayo-sans", Times, sans-serif' }}
          >
            Advertisement
          </h4>
          <div className="text-xs sm:text-sm text-blue-700 space-y-2">
            <p>
              Check out these best-sellers and special offers from{' '}
              <a href="#" className="underline hover:text-blue-900">
                Minimalistic Clinic Press
              </a>
              .
            </p>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline hover:text-blue-900">
                  NEW: Minimalistic Clinic Guide to Better Sleep
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-blue-900">
                  Listen to Health Matters Podcast
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-blue-900">
                  Minimalistic Clinic on Incontinence
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-blue-900">
                  The Essential Diabetes Book
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-blue-900">
                  FREE Minimalistic Clinic Diet Assessment
                </a>
              </li>
              <li>
                <a href="#" className="underline hover:text-blue-900 font-semibold">
                  Minimalistic Clinic Health Letter - FREE book
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Symptoms List */}
      {selectedLetter && (
        <div className="mt-8 sm:mt-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <h3
            className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900"
            style={{ fontFamily: '"mayo-display", Georgia, serif' }}
          >
            Symptoms starting with "{selectedLetter}"
          </h3>
          {loadingSymptoms ? (
            <p className="text-gray-600 text-sm sm:text-base animate-pulse">Loading symptoms...</p>
          ) : error ? (
            <p className="text-red-600 text-sm sm:text-base font-medium">{error}</p>
          ) : symptoms.length === 0 ? (
            <p className="text-gray-600 text-sm sm:text-base">No symptoms found for letter "{selectedLetter}".</p>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <ul className="space-y-3 sm:space-y-4">
                {symptoms.map((symptom) => (
                  <li key={symptom._id} className="border-b border-gray-200 pb-2 sm:pb-3">
                    <h4
                      className="text-base sm:text-lg font-medium text-blue-800"
                      style={{ fontFamily: '"mayo-sans", Times, sans-serif' }}
                    >
                      {symptom.name}
                    </h4>
                    <p
                      className="text-sm sm:text-base text-gray-600"
                      style={{ fontFamily: '"mayo-sans", Times, sans-serif' }}
                    >
                      {symptom.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Margin above footer */}
      <div className="mt-8 sm:mt-12" />

      <div className="bg-white shadow-lg">
        <Footer />
      </div>
    </div>
  );
};

export default SymptomsPage;