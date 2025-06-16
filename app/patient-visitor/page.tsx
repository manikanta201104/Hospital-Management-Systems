
// pat-vis/page.tsx
import React from "react";
import Header from "@/app/components/Homepage/page";
import Footer from "@/app/components/Footer/page";
import Link from "next/link";
import Image from "next/image";

const PatientVisitorGuidePage: React.FC = () => {
  const guideLinks = [
    { label: "Billing & insurance", href: "/patient-visitor/billing-insurance" },
    { label: "Cost estimator", href: "/patient-visitor/cost-estimator" },
    { label: "Charitable care & financial assistance", href: "/patient-visitor/charitable-care" },
    { label: "Medical images & records request", href: "/patient-visitor/medical-records" },
    { label: "What is it like to be a Mayo Clinic patient?", href: "/patient-visitor/patient-experience" },
    { label: "How the appointment process works", href: "/patient-visitor/appointment-process" },
  ];

  const locations = [
    {
      title: "MAYO CLINIC IN ARIZONA",
      subtitle: "Scottsdale & Phoenix",
      image: "/images/loc1.png",
      link: { label: "Learn about Mayo Clinic in Arizona", href: "/locations/arizona" },
    },
    {
      title: "MAYO CLINIC IN FLORIDA",
      subtitle: "Jacksonville",
      image: "/images/loc2.png",
      link: { label: "Learn about Mayo Clinic in Florida", href: "/locations/florida" },
    },
    {
      title: "MAYO CLINIC IN MINNESOTA",
      subtitle: "Rochester",
      image: "/images/loc3.png",
      link: { label: "Learn about Mayo Clinic in Minnesota", href: "/locations/minnesota" },
    },
  ];

  const additionalHelpLinks = [
    { label: "Travel help & guidance", href: "/patient-visitor/travel-help" },
    { label: "International patient services", href: "/patient-visitor/international-services" },
    { label: "How to make the most of your appointment", href: "/patient-visitor/make-most-appointment" },
    { label: "Your packing list", href: "/patient-visitor/packing-list" },
    { label: "Patient education", href: "/patient-visitor/patient-education" },
    { label: "Humanities in Medicine", href: "/patient-visitor/humanities-medicine" },
    { label: "COVID-19 info for transplant patients", href: "/patient-visitor/covid-transplant" },
    { label: "COVID-19 info for cancer patients", href: "/patient-visitor/covid-cancer" },
    { label: "Blood Donor Program", href: "/patient-visitor/blood-donor" },
  ];

  const onlineAccessLinks = [
    { label: "Patient portal", href: "/patient-visitor/patient-portal" },
    { label: "Online support community (Mayo Clinic Connect)", href: "/patient-visitor/mayo-connect" },
    { label: "Stories of hope at Mayo Clinic (News Network)", href: "/patient-visitor/stories-hope" },
  ];

  const confidentialityLinks = [
    { label: "Confidentiality at Mayo Clinic", href: "/patient-visitor/confidentiality" },
    { label: "Patient rights, responsibilities and privacy", href: "/patient-visitor/patient-rights" },
    { label: "Federal Civil Rights postings in multiple languages", href: "/patient-visitor/civil-rights" },
    { label: "Mayo Clinic authorization and service terms", href: "/patient-visitor/service-terms" },
  ];

  // Split additionalHelpLinks into two columns
  const midPoint = Math.ceil(additionalHelpLinks.length / 2);
  const firstColumnLinks = additionalHelpLinks.slice(0, midPoint);
  const secondColumnLinks = additionalHelpLinks.slice(midPoint);

  return (
    <div className="min-h-screen bg-white font-mayoSans" style={{ fontFamily: "'mayo-sans', 'Times', sans-serif" }}>
      {/* Header */}
      <Header />

      {/* Patient & Visitor Guide Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 font-mayoDisplay" style={{ fontFamily: "'mayo-display', 'Georgia', serif" }}>
            Patient & Visitor Guide
          </h1>
          <p className="text-gray-600 text-lg mb-12">
            Your guide to getting care at Mayo Clinic
          </p>

          <div className="mb-12">
            <Image
              src="/images/photo1.png"
              alt="Patient and Visitor Guide"
              width={1200}
              height={800}
              className="w-full h-126 object-cover rounded-lg shadow-md"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Content */}
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-mayoDisplay" style={{ fontFamily: "'mayo-display', 'Georgia', serif" }}>
                Everything you need to know before requesting an appointment
              </h2>
              <p className="text-gray-600 text-lg mb-12">
                We prioritize patient-centered care, making sure you get the personalized attention and expert care you need. Find everything you need to know before requesting your appointment with Mayo Clinic.
              </p>
            </div>

            {/* Links */}
            <div className="md:w-1/3">
              <div className="flex flex-col gap-4">
                {guideLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="flex items-center text-blue-900 hover:underline text-base"
                  >
                    <span className="mr-2">➔</span> {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Planning Your Trip Section */}
          <h1 className="text-5xl font-bold text-gray-900 mb-4 font-mayoDisplay mt-12" style={{ fontFamily: "'mayo-display', 'Georgia', serif" }}>
            Planning your trip to Mayo Clinic & after you arrive
          </h1>
          <p className="text-gray-600 text-lg mb-12">
            Getting here, getting around, campus maps, where to stay and eat, patient support, and more.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {locations.map((location, idx) => (
              <div key={idx} className="flex flex-col">
                <Image
                  src={location.image}
                  alt={location.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <h2 className="text-xl font-bold text-gray-900 mt-4 mb-2 font-mayoDisplay" style={{ fontFamily: "'mayo-display', 'Georgia', serif" }}>
                  {location.title}
                </h2>
                <p className="text-gray-600 text-base mb-4">{location.subtitle}</p>
                <Link
                  href={location.link.href}
                  className="flex items-center text-blue-900 hover:underline text-base"
                >
                  <span className="mr-2">➔</span> {location.link.label}
                </Link>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-mayoDisplay" style={{ fontFamily: "'mayo-display', 'Georgia', serif" }}>
            Additional help to make the most of your visit
          </h2>
          <p className="text-gray-600 text-lg mb-12">
            Your travel experience should be as comfortable as possible. We’re here to help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="flex flex-col gap-4">
              {firstColumnLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="flex items-center text-blue-900 hover:underline text-base"
                >
                  <span className="mr-2">➔</span> {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {secondColumnLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="flex items-center text-blue-900 hover:underline text-base"
                >
                  <span className="mr-2">➔</span> {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-mayoDisplay" style={{ fontFamily: "'mayo-display', 'Georgia', serif" }}>
                Online access, support groups, and patient stories
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                Create your online profile and connect with other Mayo Clinic patients and care teams for resources and support.
              </p>
              <div className="flex flex-col gap-4">
                {onlineAccessLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="flex items-center text-blue-900 hover:underline text-base"
                  >
                    <span className="mr-2">➔</span> {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-mayoDisplay" style={{ fontFamily: "'mayo-display', 'Georgia', serif" }}>
                Confidentiality, civil rights & service terms
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                We are dedicated to protecting your confidentiality and privacy
              </p>
              <div className="flex flex-col gap-4">
                {confidentialityLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="flex items-center text-blue-900 hover:underline text-base"
                  >
                    <span className="mr-2">➔</span> {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PatientVisitorGuidePage;