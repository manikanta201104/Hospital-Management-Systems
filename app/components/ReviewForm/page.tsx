
'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

// Define the type for the hospital review form data
interface ReviewFormData {
  patientName: string;
  reviewText: string;
  rating: number;
  department: string;
  consent: boolean;
}

// Define the type for hospital reviews fetched from the backend
interface HospitalReview {
  _id: string;
  nameOrInitials: string;
  department: string;
  review: string;
  rating: number;
  privacyAgreed: boolean;
  createdAt: string;
  type: 'hospital';
}

// Define the type for doctor review form data
interface DoctorReviewFormData {
  doctorName: string;
  reviewText: string;
  rating: number;
  consent: boolean;
}

// Define the type for doctor reviews
interface DoctorReview {
  _id: string;
  doctor: string;
  review: string;
  rating: number;
  privacyAgreed: boolean;
  createdAt: string;
  type: 'doctor';
}

// Define the type for doctors fetched from the API
interface Doctor {
  _id: string;
  name: string;
  specialist: string;
  location: string;
  photo: string;
}

// Union type for combined reviews
type CombinedReview = HospitalReview | DoctorReview;

const ReviewForm: React.FC = () => {
  // State for hospital review form
  const [hospitalFormData, setHospitalFormData] = useState<ReviewFormData>({
    patientName: '',
    reviewText: '',
    rating: 0,
    department: 'none',
    consent: false,
  });
  const [hospitalSubmitted, setHospitalSubmitted] = useState<boolean>(false);
  const [hospitalError, setHospitalError] = useState<string>('');
  const [hospitalLoading, setHospitalLoading] = useState<boolean>(false);
  const [hospitalReviews, setHospitalReviews] = useState<HospitalReview[]>([]);
  
  // State for doctor review form
  const [doctorFormData, setDoctorFormData] = useState<DoctorReviewFormData>({
    doctorName: '',
    reviewText: '',
    rating: 0,
    consent: false,
  });
  const [doctorSubmitted, setDoctorSubmitted] = useState<boolean>(false);
  const [doctorError, setDoctorError] = useState<string>('');
  const [doctorLoading, setDoctorLoading] = useState<boolean>(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDoctorDropdown, setShowDoctorDropdown] = useState<boolean>(false);

  // State for doctor reviews
  const [doctorReviews, setDoctorReviews] = useState<DoctorReview[]>([]);

  // Animation controls for the combined carousel
  const combinedControls = useAnimation();

  // Fetch doctors for the search box
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const letters = Array.from('abcdefghijklmnopqrstuvwxyz');
        const doctorPromises = letters.map((letter) =>
          fetch(`http://localhost:5000/api/hospital/doctors/alphabets/${letter}`)
            .then((res) => {
              if (!res.ok) {
                console.warn(`Failed to fetch doctors for letter ${letter}: ${res.status}`);
                return [];
              }
              return res.json();
            })
            .catch((err) => {
              console.warn(`Error fetching doctors for letter ${letter}: ${err.message}`);
              return [];
            })
        );
        const doctorArrays: Doctor[][] = await Promise.all(doctorPromises);
        const allFetchedDoctors: Doctor[] = doctorArrays.flat();
        setDoctors(allFetchedDoctors);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch hospital reviews
  const fetchHospitalReviews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/hospital/reviews', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch hospital reviews');
      }
      const data = await response.json();
      setHospitalReviews(data.map((review: HospitalReview) => ({ ...review, type: 'hospital' })));
    } catch (err) {
      console.error('Error fetching hospital reviews:', err);
      setHospitalError('Failed to load hospital reviews. Please try again later.');
    }
  };

  // Fetch doctor reviews
  const fetchDoctorReviews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctorreview/reviews', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch doctor reviews');
      }
      const data = await response.json();
      setDoctorReviews(data.map((review: DoctorReview) => ({ ...review, type: 'doctor', doctorName: review.doctor })));
    } catch (err) {
      console.error('Error fetching doctor reviews:', err);
      setDoctorError('Failed to load doctor reviews. Please try again later.');
    }
  };

  // Load reviews on component mount
  useEffect(() => {
    fetchHospitalReviews();
    fetchDoctorReviews();
  }, []);

  // Handle hospital form input changes
  const handleHospitalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setHospitalFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle hospital checkbox change
  const handleHospitalCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHospitalFormData((prev) => ({ ...prev, consent: e.target.checked }));
  };

  // Handle hospital rating selection
  const handleHospitalRating = (rating: number) => {
    setHospitalFormData((prev) => ({ ...prev, rating }));
  };

  // Handle hospital form submission
  const handleHospitalSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (
      !hospitalFormData.patientName ||
      !hospitalFormData.reviewText ||
      hospitalFormData.rating === 0 ||
      hospitalFormData.department === 'none' ||
      !hospitalFormData.consent
    ) {
      setHospitalError('Please fill out all fields, select a rating, select a department, and agree to the terms.');
      return;
    }
    setHospitalLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/hospital/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameOrInitials: hospitalFormData.patientName,
          review: hospitalFormData.reviewText,
          rating: hospitalFormData.rating,
          department: hospitalFormData.department,
          privacyAgreed: hospitalFormData.consent,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit hospital review');
      }
      setHospitalSubmitted(true);
      setHospitalError('');
      setHospitalFormData({ patientName: '', reviewText: '', rating: 0, department: 'none', consent: false });
      await fetchHospitalReviews();
    } catch (err) {
      setHospitalError('Failed to submit hospital review. Please try again.');
      console.error('Error submitting hospital review:', err);
    } finally {
      setHospitalLoading(false);
    }
  };

  // Handle submitting another hospital review
  const handleAnotherHospitalReview = () => {
    setHospitalSubmitted(false);
  };

  // Handle doctor form input changes
  const handleDoctorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDoctorFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle doctor checkbox change
  const handleDoctorCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoctorFormData((prev) => ({ ...prev, consent: e.target.checked }));
  };

  // Handle doctor rating selection
  const handleDoctorRating = (rating: number) => {
    setDoctorFormData((prev) => ({ ...prev, rating }));
  };

  // Handle doctor selection from search
  const handleDoctorSelect = (doctorName: string) => {
    setDoctorFormData((prev) => ({ ...prev, doctorName }));
    setSearchQuery(doctorName);
    setShowDoctorDropdown(false);
  };

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle doctor form submission
  const handleDoctorSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (
      !doctorFormData.doctorName ||
      !doctorFormData.reviewText ||
      doctorFormData.rating === 0 ||
      !doctorFormData.consent
    ) {
      setDoctorError('Please select a doctor, write a review, select a rating, and agree to the terms.');
      return;
    }
    setDoctorLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/doctorreview/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor: doctorFormData.doctorName,
          review: doctorFormData.reviewText,
          rating: doctorFormData.rating,
          privacyAgreed: doctorFormData.consent,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit doctor review');
      }
      setDoctorSubmitted(true);
      setDoctorError('');
      setDoctorFormData({ doctorName: '', reviewText: '', rating: 0, consent: false });
      setSearchQuery('');
      await fetchDoctorReviews();
    } catch (err) {
      setDoctorError('Failed to submit doctor review. Please try again.');
      console.error('Error submitting doctor review:', err);
    } finally {
      setDoctorLoading(false);
    }
  };

  // Handle submitting another doctor review
  const handleAnotherDoctorReview = () => {
    setDoctorSubmitted(false);
  };

  // Character counters
  const hospitalRemainingChars = 500 - hospitalFormData.reviewText.length;
  const doctorRemainingChars = 500 - doctorFormData.reviewText.length;

  // Animation variants for forms
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // Combine hospital and doctor reviews
  const combinedReviews: CombinedReview[] = [
    ...hospitalReviews,
    ...doctorReviews,
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Duplicate reviews for seamless looping
  const duplicatedCombinedReviews = combinedReviews.length > 0 
    ? [...combinedReviews, ...combinedReviews, ...combinedReviews] 
    : [
        { _id: 'placeholder-1', nameOrInitials: 'Loading...', department: '', review: '', rating: 0, privacyAgreed: false, createdAt: new Date().toISOString(), type: 'hospital' },
        { _id: 'placeholder-2', nameOrInitials: 'Loading...', department: '', review: '', rating: 0, privacyAgreed: false, createdAt: new Date().toISOString(), type: 'hospital' },
        { _id: 'placeholder-3', nameOrInitials: 'Loading...', department: '', review: '', rating: 0, privacyAgreed: false, createdAt: new Date().toISOString(), type: 'hospital' },
      ];

  // Animation for continuous right-to-left scrolling
  const carouselAnimation = {
    x: ['0%', '-100%'],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 20,
        ease: 'linear',
      },
    },
  };

  // Handle hover to pause/resume animation
  const handleHoverStart = (controls: any) => {
    controls.stop();
  };

  const handleHoverEnd = (controls: any) => {
    controls.start(carouselAnimation);
  };

  // Start animation immediately on mount
  useEffect(() => {
    combinedControls.start(carouselAnimation);
  }, [combinedControls]);

  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.h2
        className="text-4xl font-bold text-foreground text-center mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        Share Your Feedback
      </motion.h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Hospital Review Section (Left) */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Card className="shadow-xl rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-gray-100">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Hospital Review
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence>
                {hospitalSubmitted ? (
                  <motion.div
                    className="bg-green-100 p-6 rounded-xl text-center text-gray-800"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-lg font-semibold">Thank you for your review!</p>
                    <p className="mt-2">It will be posted after moderation.</p>
                    <Button
                      onClick={handleAnotherHospitalReview}
                      className="mt-4 bg-[#003366] text-white hover:bg-[#004080] transition-transform transform"
                    >
                      Submit Another Review
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    {hospitalError && (
                      <div className="bg-red-100 p-4 rounded-xl text-red-600 text-sm">
                        {hospitalError}
                      </div>
                    )}
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                      <Label htmlFor="patientName" className="text-base font-medium text-gray-800">
                        Name or Initials
                      </Label>
                      <Input
                        id="patientName"
                        name="patientName"
                        value={hospitalFormData.patientName}
                        onChange={handleHospitalChange}
                        placeholder="E.g., John D. or Anonymous"
                        className="mt-2 border-gray-300 shadow-sm focus:ring-[#003366] focus:border-[#003366] text-base text-gray-800 placeholder-gray-400 py-3 transition-all duration-300"
                        maxLength={50}
                        aria-required="true"
                      />
                    </motion.div>
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                      <Label htmlFor="department" className="text-base font-medium text-gray-800">
                        Department
                      </Label>
                      <Select
                        value={hospitalFormData.department}
                        onValueChange={(value) =>
                          setHospitalFormData((prev) => ({ ...prev, department: value }))
                        }
                      >
                        <SelectTrigger className="mt-2 border-gray-300 shadow-sm focus:ring-[#003366] focus:border-[#003366] text-base text-gray-800 py-3">
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="none">Select a department</SelectItem>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Neurology">Neurology</SelectItem>
                          <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="General Medicine">General Medicine</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                      <Label htmlFor="reviewText" className="text-base font-medium text-gray-800">
                        Your Review
                      </Label>
                      <Textarea
                        id="reviewText"
                        name="reviewText"
                        value={hospitalFormData.reviewText}
                        onChange={handleHospitalChange}
                        placeholder="Share your experience with our hospital..."
                        rows={5}
                        className="mt-2 border-gray-300 shadow-sm focus:ring-[#003366] focus:border-[#003366] text-base text-gray-800 placeholder-gray-400 transition-all duration-300"
                        maxLength={500}
                        aria-required="true"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        {hospitalRemainingChars} characters remaining
                      </p>
                    </motion.div>
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                      <Label className="text-base font-medium text-gray-800">Rating</Label>
                      <div className="flex mt-2 space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleHospitalRating(star)}
                            className={`w-8 h-8 focus:outline-none transition-transform transform hover:scale-110 ${
                              hospitalFormData.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            aria-label={`Rate ${star} stars`}
                          >
                            <svg fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hospital-consent"
                          name="consent"
                          checked={hospitalFormData.consent}
                          onCheckedChange={(checked) =>
                            setHospitalFormData((prev) => ({
                              ...prev,
                              consent: Boolean(checked),
                            }))
                          }
                          className="text-[#003366] border-gray-300 focus:ring-[#003366]"
                          aria-required="true"
                        />
                        <Label htmlFor="hospital-consent" className="text-base font-medium text-gray-800">
                          I agree to the{' '}
                          <a href="/privacy-policy" className="text-[#003366] hover:underline">
                            privacy policy
                          </a>{' '}
                          and allow my review to be published.
                        </Label>
                      </div>
                    </motion.div>
                    <motion.div
                      className="text-center"
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                    >
                      <Button
                        onClick={handleHospitalSubmit}
                        disabled={hospitalLoading}
                        className={`w-full bg-[#003366] text-white hover:bg-[#004080] transition-transform transform ${
                          hospitalLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {hospitalLoading ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </motion.div>
                    <motion.p
                      className="mt-4 text-sm text-gray-500 text-center"
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                    >
                      All reviews are moderated for authenticity and compliance with privacy regulations.
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Doctor Review Section (Right) */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Card className="shadow-xl rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-gray-100">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Doctor Review
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence>
                {doctorSubmitted ? (
                  <motion.div
                    className="bg-green-100 p-6 rounded-xl text-center text-gray-800"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-lg font-semibold">Thank you for your review!</p>
                    <p className="mt-2">It will be posted after moderation.</p>
                    <Button
                      onClick={handleAnotherDoctorReview}
                      className="mt-4 bg-[#003366] text-white hover:bg-[#004080] transition-transform transform"
                    >
                      Submit Another Review
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    {doctorError && (
                      <div className="bg-red-100 p-4 rounded-xl text-red-600 text-sm">
                        {doctorError}
                      </div>
                    )}
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                      <Label htmlFor="doctorSearch" className="text-base font-medium text-gray-800">
                        Select Doctor
                      </Label>
                      <div className="relative">
                        <Input
                          id="doctorSearch"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowDoctorDropdown(true);
                          }}
                          onFocus={() => setShowDoctorDropdown(true)}
                          placeholder="Search for a doctor..."
                          className="mt-2 border-gray-300 shadow-sm focus:ring-[#003366] focus:border-[#003366] text-base text-gray-800 placeholder-gray-400 py-3 transition-all duration-300"
                          aria-required="true"
                        />
                        {showDoctorDropdown && filteredDoctors.length > 0 && (
                          <motion.div
                            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            {filteredDoctors.map((doctor) => (
                              <div
                                key={doctor._id}
                                onClick={() => handleDoctorSelect(doctor.name)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                              >
                                {doctor.name} ({doctor.specialist}, {doctor.location})
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                      <Label htmlFor="doctorReviewText" className="text-base font-medium text-gray-800">
                        Your Review
                      </Label>
                      <Textarea
                        id="doctorReviewText"
                        name="reviewText"
                        value={doctorFormData.reviewText}
                        onChange={handleDoctorChange}
                        placeholder="Share your experience with this doctor..."
                        rows={5}
                        className="mt-2 border-gray-300 shadow-sm focus:ring-[#003366] focus:border-[#003366] text-base text-gray-800 placeholder-gray-400 transition-all duration-300"
                        maxLength={500}
                        aria-required="true"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        {doctorRemainingChars} characters remaining
                      </p>
                    </motion.div>
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                      <Label className="text-base font-medium text-gray-800">Rating</Label>
                      <div className="flex mt-2 space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleDoctorRating(star)}
                            className={`w-8 h-8 focus:outline-none transition-transform transform hover:scale-110 ${
                              doctorFormData.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            aria-label={`Rate ${star} stars`}
                          >
                            <svg fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="doctor-consent"
                          name="consent"
                          checked={doctorFormData.consent}
                          onCheckedChange={(checked) =>
                            setDoctorFormData((prev) => ({
                              ...prev,
                              consent: Boolean(checked),
                            }))
                          }
                          className="text-[#003366] border-gray-300 focus:ring-[#003366]"
                          aria-required="true"
                        />
                        <Label htmlFor="doctor-consent" className="text-base font-medium text-gray-800">
                          I agree to the{' '}
                          <a href="/privacy-policy" className="text-[#003366] hover:underline">
                            privacy policy
                          </a>{' '}
                          and allow my review to be published.
                        </Label>
                      </div>
                    </motion.div>
                    <motion.div
                      className="text-center"
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                    >
                      <Button
                        onClick={handleDoctorSubmit}
                        disabled={doctorLoading}
                        className={`w-full bg-[#003366] text-white hover:bg-[#004080] transition-transform transform ${
                          doctorLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {doctorLoading ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </motion.div>
                    <motion.p
                      className="mt-4 text-sm text-gray-500 text-center"
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                    >
                      All reviews are moderated for authenticity and compliance with privacy regulations.
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Combined Reviews Carousel (Full Width, No Card Wrapper) */}
      <div className="mt-12 w-full">
        <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          All Reviews
        </h3>
        <div className="overflow-hidden">
          <motion.div
            className="flex"
            animate={combinedControls}
            onHoverStart={() => handleHoverStart(combinedControls)}
            onHoverEnd={() => handleHoverEnd(combinedControls)}
          >
            {duplicatedCombinedReviews.map((review, index) => (
              <div
                key={`${review._id}-${index}`}
                className="flex-shrink-0 w-1/3 px-2"
              >
                <div className="p-4 bg-white rounded-xl shadow-md h-full">
                  <p className="text-lg font-semibold text-gray-800">
                    {review.type === 'hospital'
                      ? review.nameOrInitials
                      : 'doctor' in review
                        ? review.doctor
                        : ''}
                  </p>
                  <p className="text-sm text-gray-500">
                    {review.type === 'hospital' ? review.department : 'Doctor Review'}
                  </p>
                  <div className="flex mt-2 space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          review.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-2 text-gray-800 text-sm">{review.review}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      month: 'numeric',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReviewForm;
