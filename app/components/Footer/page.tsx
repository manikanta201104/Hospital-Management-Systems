import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <>
      <footer
        className="w-full bg-gradient-to-b from-[#0D0D33] to-[#1A1A4D] py-12 text-white"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          {/* Grid of Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* First Column: Top Buttons + About Mayo Clinic + Businesses */}
            <div className="space-y-8">
              {/* Top Buttons */}
              <div className="flex flex-col gap-4">
                {[
                  { href: "/find-a-doctor", text: "Find a doctor", icon: "🩺" },
                  { href: "/explore-careers", text: "Explore careers", icon: "💼" },
                  { href: "/e-news", text: "Sign up for free e-newsletters", icon: "📰" },
                ].map((button, idx) => (
                  <Link
                    key={idx}
                    href={button.href}
                    className="flex items-center justify-between px-5 py-3 border border-gray-300/30 rounded-lg text-white hover:bg-white hover:text-black hover:bg-opacity-15 hover:scale-[1.02] transition-all duration-300 shadow-sm"
                  >
                    <span className="flex items-center text-sm font-medium">
                      <span className="mr-3 text-lg">{button.icon}</span> {button.text}
                    </span>
                    <span className="ml-4 text-lg">→</span>
                  </Link>
                ))}
              </div>

              {/* About Mayo Clinic */}
              <div>
                <h3 className="text-xl font-semibold uppercase mb-5 flex items-center tracking-wide">
                  About Minimalistic Clinic
                  <span className="ml-3 text-blue-400">→</span>
                </h3>
                <div className="flex flex-col space-y-3">
                  {[
                    { title: "About this Site", href: "/about-this-site" },
                    { title: "Contact Us", href: "/contact-us" },
                    { title: "Locations", href: "/locations" },
                    { title: "Health Information Policy", href: "/health-information-policy" },
                    { title: "Medicare Accountable Care Organization (ACO)", href: "/medicare-aco" },
                    { title: "Media Requests", href: "/media-requests" },
                    { title: "News Network", href: "/news-network" },
                    { title: "Price Transparency", href: "/price-transparency" },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="text-gray-200 text-sm hover:text-blue-300 transition-colors duration-200"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Businesses */}
              <div>
                <h3 className="text-xl font-semibold uppercase mb-5 flex items-center tracking-wide">
                  Businesses
                  <span className="ml-3 text-blue-400">→</span>
                </h3>
                <div className="flex flex-col space-y-3">
                  {[
                    { title: "Executive Health Program", href: "/executive-health-program" },
                    { title: "International Business Collaborations", href: "/international-business" },
                    { title: "Facilities & Real Estate", href: "/facilities-real-estate" },
                    { title: "Supplier Information", href: "/supplier-information" },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="text-gray-200 text-sm hover:text-blue-300 transition-colors duration-200"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Second Column: Medical Professionals + Research + International Patients + Students */}
            <div className="space-y-8">
              {/* Medical Professionals */}
              <div>
                <h3 className="text-xl font-semibold uppercase mb-5 flex items-center tracking-wide">
                  Medical Professionals
                  <span className="ml-3 text-blue-400">→</span>
                </h3>
                <div className="flex flex-col space-y-3">
                  {[
                    { title: "AskMayoExpert", href: "/ask-mayo-expert" },
                    { title: "Clinical Trials", href: "/clinical-trials" },
                    { title: "Mayo Clinic Alumni Association", href: "/alumni-association" },
                    { title: "Refer a Patient", href: "/refer-a-patient" },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="text-gray-200 text-sm hover:text-blue-300 transition-colors duration-200"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Research */}
              <div>
                <h3 className="text-xl font-semibold uppercase mb-5 flex items-center tracking-wide">
                  Research
                  <span className="ml-3 text-blue-400">→</span>
                </h3>
                <div className="flex flex-col space-y-3">
                  {[
                    { title: "Research Faculty", href: "/research-faculty" },
                    { title: "Laboratories", href: "/laboratories" },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="text-gray-200 text-sm hover:text-blue-300 transition-colors duration-200"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* International Patients */}
              <div>
                <h3 className="text-xl font-semibold uppercase mb-5 flex items-center tracking-wide">
                  International Patients
                  <span className="ml-3 text-blue-400">→</span>
                </h3>
                <div className="flex flex-col space-y-3">
                  {[
                    { title: "Appointments", href: "/appointments" },
                    { title: "International Services", href: "/international-services" },
                    { title: "International Locations & Offices", href: "/international-locations" },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="text-gray-200 text-sm hover:text-blue-300 transition-colors duration-200"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Students */}
              <div>
                <h3 className="text-xl font-semibold uppercase mb-5 flex items-center tracking-wide">
                  Students
                  <span className="ml-3 text-blue-400">→</span>
                </h3>
                <div className="flex flex-col space-y-3">
                  {[
                    { title: "Admissions Requirements", href: "/admissions-requirements" },
                    { title: "Degree Programs", href: "/degree-programs" },
                    { title: "Student & Faculty Portal", href: "/student-faculty-portal" },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="text-gray-200 text-sm hover:text-blue-300 transition-colors duration-200"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Third Column: Charitable Care & Financial Assistance */}
            <div>
              <h3 className="text-xl font-semibold uppercase mb-5 flex items-center tracking-wide">
                Charitable Care & Financial Assistance
                <span className="ml-3 text-blue-400">→</span>
              </h3>
              <div className="flex flex-col space-y-3">
                {[
                  { title: "Community Health Needs Assessment", href: "/community-health-needs" },
                  { title: "Financial Assistance Documents – Arizona", href: "/financial-assistance-arizona" },
                  { title: "Financial Assistance Documents – Florida", href: "/financial-assistance-florida" },
                  { title: "Financial Assistance Documents – Minnesota", href: "/financial-assistance-minnesota" },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="text-gray-200 text-sm hover:text-blue-300 transition-colors duration-200"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Section: Social Media and App Links */}
            <div className="border-t border-gray-300/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              {/* Follow Mayo Clinic */}
              <div className="mb-8 md:mb-0">
                <h3 className="text-xl font-semibold uppercase mb-5 tracking-wide">
                  Follow Minimalistic Clinic
                </h3>
                <div className="flex space-x-4">
                  {[
                    { icon: "X", href: "https://twitter.com/mayoclinic" },
                    { icon: "YouTube", href: "https://youtube.com/mayoclinic" },
                    { icon: "Facebook", href: "https://facebook.com/mayoclinic" },
                    { icon: "LinkedIn", href: "https://linkedin.com/company/mayo-clinic" },
                    { icon: "Instagram", href: "https://instagram.com/mayoclinic" },
                  ].map((social, idx) => (
                    <Link
                      key={idx}
                      href={social.href}
                      className="text-white text-xl border border-gray-300/30 rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-500 hover:bg-opacity-20 hover:scale-110 transition-all duration-300"
                    >
                      {social.icon === "X" && "X"}
                      {social.icon === "YouTube" && "▶"}
                      {social.icon === "Facebook" && "f"}
                      {social.icon === "LinkedIn" && "in"}
                      {social.icon === "Instagram" && "📸"}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Get the Mayo Clinic app */}
              <div>
                <h3 className="text-xl font-semibold uppercase mb-5 text-right tracking-wide">
                  Get the Minimalistic Clinic app
                </h3>
                <div className="flex space-x-4 justify-end">
                  <Link href="https://play.google.com/store" className="hover:opacity-80 transition-opacity">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Get it on Google Play"
                      width={135}
                      height={40}
                    />
                  </Link>
                  <Link href="https://www.apple.com/app-store/" className="hover:opacity-80 transition-opacity">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                      alt="Download on the App Store"
                      width={120}
                      height={40}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Bottommost Section: Terms, Privacy, etc. */}
        <div
          className="w-full bg-gray-100 py-6"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
            <div className="flex flex-wrap gap-6 mb-6">
              {[
                { title: "Terms & Conditions", href: "/terms-conditions" },
                { title: "Privacy Policy", href: "/privacy-policy" },
                { title: "Notice of Privacy Practices", href: "/notice-privacy-practices" },
                { title: "Notice of Nondiscrimination", href: "/notice-nondiscrimination" },
                { title: "Accessibility Statement", href: "/accessibility-statement" },
                { title: "Advertising & Sponsorship Policy", href: "/advertising-sponsorship-policy" },
                { title: "Site Map", href: "/site-map" },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="text-gray-700 text-sm font-medium hover:text-blue-600 transition-colors duration-200"
                >
                  {item.title}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
              <span className="text-gray-700 text-sm mb-4 md:mb-0">
                © 1998-2025 Minimalistic Foundation for Medical Education and Research
                (MFMER). All rights reserved.
              </span>
              <div className="flex items-center">
                <span className="text-gray-700 text-sm mr-3 font-medium">Language:</span>
                <select className="border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Feedback Button on Right Side */}
        <div className="fixed bottom-10 right-0 z-50">
          <button className="relative w-20 h-12 bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all duration-300 shadow-lg -rotate-90 origin-bottom-right">
            <span className="absolute transform rotate-90 text-xs font-semibold tracking-wider">
              FEEDBACK
            </span>
          </button>
        </div>
      </>
    );
};

export default Footer;