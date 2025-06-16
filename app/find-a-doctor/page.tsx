'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Homepage/page';
import Footer from '../components/Footer/page';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Define interfaces for TypeScript
interface Doctor {
  _id: string;
  name: string;
  specialist: string;
  location: string;
  photo: string;
}

const cities: string[] = [
  'All',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Hyderabad',
  'Kolkata',
  'Ahmedabad',
  'Pune',
  'Jaipur',
  'Surat',
  'Nagpur',
  'Indore',
  'Bhopal',
  'Visakhapatnam',
  'Patna',
  'Vadodara',
  'Coimbatore',
  'Madurai',
  'Agra',
  'Varanasi',
  'Lucknow',
];

const DOCTORS_PER_PAGE = 7;

const FindADocPage: React.FC = () => {
  const [location, setLocation] = useState<string>('Mumbai'); // Default to Mumbai
  const [specialist, setSpecialist] = useState<string>('All'); // Default to All
  const [specializations, setSpecializations] = useState<string[]>(['All']); // Include "All"
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch doctors from all alphabet endpoints (a-z) to extract specializations and populate data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const letters = Array.from('abcdefghijklmnopqrstuvwxyz'); // All letters a-z
        const doctorPromises = letters.map((letter) =>
          fetch(`http://localhost:5000/api/hospital/doctors/alphabets/${letter}`)
            .then((res) => {
              if (!res.ok) {
                console.warn(`Failed to fetch doctors for letter ${letter}: ${res.status}`);
                return []; // Return empty array for failed requests
              }
              return res.json();
            })
            .catch((err) => {
              console.warn(`Error fetching doctors for letter ${letter}: ${err.message}`);
              return []; // Return empty array for errors
            })
        );
        const doctorArrays: Doctor[][] = await Promise.all(doctorPromises);
        const allFetchedDoctors: Doctor[] = doctorArrays.flat();

        if (allFetchedDoctors.length === 0) {
          throw new Error('No doctor data could be fetched from any endpoint');
        }

        // Extract unique specializations
        const uniqueSpecializations = Array.from(
          new Set(allFetchedDoctors.map((doctor) => doctor.specialist))
        ).sort();
        setSpecializations(['All', ...uniqueSpecializations]); // Add "All" to specializations
        setAllDoctors(allFetchedDoctors);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching doctors');
        setSpecializations(['All']);
        setAllDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filter doctors based on selected location and specialist
  useEffect(() => {
    if (allDoctors.length > 0) {
      let filteredDoctors: Doctor[] = allDoctors;

      // Handle location filter
      if (location !== 'All') {
        filteredDoctors = filteredDoctors.filter((doctor) => doctor.location.includes(location));
      }

      // Handle specialization filter
      if (specialist !== 'All') {
        filteredDoctors = filteredDoctors.filter((doctor) => doctor.specialist === specialist);
      }

      setDoctors(filteredDoctors);
      setCurrentPage(1); // Reset to first page when filters change
    } else {
      setDoctors([]);
    }
  }, [location, specialist, allDoctors]);

  // Calculate pagination
  const totalPages = Math.ceil(doctors.length / DOCTORS_PER_PAGE);
  const startIndex = (currentPage - 1) * DOCTORS_PER_PAGE;
  const endIndex = startIndex + DOCTORS_PER_PAGE;
  const currentDoctors = doctors.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
  };

  // Generate pagination items (e.g., 1 2 ... 30 31)
  const getPaginationItems = () => {
    const items: (number | string)[] = [];
    const delta = 2; // Number of pages to show on each side of the current page

    // Always show first page
    items.push(1);

    // Add ellipsis if there's a gap between page 1 and the start of the current page range
    const start = Math.max(2, currentPage - delta);
    if (start > 2) {
      items.push('...');
    }

    // Add pages around the current page
    for (let i = start; i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      items.push(i);
    }

    // Add ellipsis if there's a gap between the end of the current page range and the last page
    if (currentPage + delta < totalPages - 1) {
      items.push('...');
    }

    // Always show last page if there are at least 2 pages
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      {/* Breadcrumb */}
      <div className="px-6 md:px-40 mt-6 text-sm text-muted-foreground">
        Medical Departments & Centers
      </div>

      {/* Title */}
      <h1
        className="px-6 md:px-40 text-3xl md:text-4xl font-semibold mt-2 mb-6"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Doctors and Medical Staff
      </h1>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-muted/80 to-muted/40 overflow-hidden shadow-lg">
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm opacity-30"
          style={{
            backgroundImage: `url('/find-a-doc-bg.png')`,
          }}
        />
        <div className="relative z-10 px-6 md:px-40 py-20 flex flex-col items-center text-center">
          <div className="text-primary text-6xl mb-8 animate-pulse">🔍</div>
          <h2
            className="text-4xl md:text-5xl font-semibold mb-8 text-foreground drop-shadow-md"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Find a Doctor
          </h2>

          {/* Filter form */}
          <Card className="w-full max-w-4xl p-6 bg-background/95 backdrop-blur-sm shadow-xl rounded-xl">
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Location
                  </label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="w-full border border-muted-foreground/20 shadow-sm">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Specialization
                  </label>
                  <Select value={specialist} onValueChange={setSpecialist}>
                    <SelectTrigger className="w-full border border-muted-foreground/20 shadow-sm">
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="px-6 md:px-40 py-12">
        <Card className="shadow-xl rounded-xl overflow-hidden max-w-4xl mx-auto">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-2xl font-semibold flex items-center gap-3">
              👨‍⚕️ Doctors
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center gap-4 p-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-destructive text-sm font-medium text-center">{error}</p>
            ) : currentDoctors.length > 0 ? (
              <ul className="space-y-4 animate-in fade-in duration-500">
                {currentDoctors.map((doctor) => (
                  <li
                    key={doctor._id}
                    className="border border-muted/20 rounded-lg p-4 flex items-center gap-4 bg-background hover:bg-muted/10 transition-all duration-300 transform hover:shadow-lg"
                  >
                    <img
                      src={doctor.photo || '/default-doctor.jpg'}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover border border-muted shadow-sm"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
                        (e.currentTarget.src = '/default-doctor.jpg')
                      }
                    />
                    <div>
                      <h5 className="text-base font-semibold text-foreground">{doctor.name}</h5>
                      <p className="text-sm text-muted-foreground">{doctor.specialist}</p>
                      <p className="text-sm text-muted-foreground">{doctor.location}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic text-center">
                No doctors found for the selected location and specialization.
              </p>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                >
                  Previous
                </Button>
                {getPaginationItems().map((item, index) =>
                  typeof item === 'string' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-sm text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={item}
                      variant={currentPage === item ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(item)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        currentPage === item
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-primary hover:text-primary-foreground'
                      }`}
                    >
                      {item}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default FindADocPage;