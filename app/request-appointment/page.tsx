"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "@/app/components/Footer/page"; // ✅ Added Footer

const AppointmentRequestPage = () => {
  return (
    <div
      className="min-h-screen bg-[#e3effb] text-gray-900 flex flex-col justify-between"
      style={{ fontFamily: "mayo-sans, Times, sans-serif" }}
    >
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row p-6 lg:p-20">
        {/* Left Panel */}
        <div className="lg:w-1/2 mb-12 lg:mb-0">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <Image
              src="/images/logo.png"
              alt="Minimalistic Clinic Logo"
              width={40}
              height={50}
              priority
            />
            <span className="sr-only">Go to homepage</span>
          </Link>

          <h1
            className="text-4xl font-bold leading-snug text-black"
            style={{ fontFamily: "mayo-display, Georgia, serif" }}
          >
            Start your appointment request <br /> here.
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            This is the easiest way to reach us.
          </p>
        </div>

        {/* Right Panel */}
        <div className="lg:w-1/2 space-y-8">
          {[
            {
              title: "New Patients",
              desc: "Provide your info and set a follow-up time.",
            },
            {
              title: "Returning patients",
              desc: "Request using your patient account.",
            },
            {
              title: "Referring physicians",
              desc: "Get consults and refer your patients.",
              icon: true,
            },
          ].map((item, i) => (
            <Link
              key={i}
              href="#"
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h2
                className="text-xl font-semibold text-blue-800 flex items-center gap-2"
                style={{ fontFamily: "mayo-display, Georgia, serif" }}
              >
                {item.icon && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 inline"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM4 14s1-1 6-1 6 1 6 1v1H4v-1z" />
                  </svg>
                )}
                {item.title}
              </h2>
              <p className="mt-1 text-gray-700">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Phone and Location Section */}
      <div
        className="bg-white px-6 lg:px-20 pt-10 pb-16 border-t text-[16px]"
        style={{ fontFamily: "mayo-sans, Times, sans-serif" }}
      >
        <div className="lg:flex lg:space-x-20">
          {/* Left: Only heading */}
          <div className="lg:w-1/2 mb-6 lg:mb-0">
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: "mayo-display, Georgia, serif" }}
            >
              Still want to schedule by phone?
            </h2>
          </div>

          {/* Right: All content */}
          <div className="lg:w-1/2">
            <h3 className="text-blue-800 font-semibold mb-1">U.S. patients</h3>
            <p className="text-gray-800 mb-4">
              Call during local business hours to speak with an appointment
              coordinator. Because hold times vary, you can also use our online
              request above to tell us when to call you. If this is an
              emergency, call 911 or your local emergency services.
            </p>

            {[
              {
                title: "Rochester, Minnesota",
                subtitle: "Central Appointment Office",
                phone: "507-538-3270",
                time: "7 a.m. to 6 p.m. Central time",
              },
              {
                title: "Children's Center",
                phone: "855-629-6543",
                time: "7 a.m. to 6 p.m. Central time",
              },
              {
                title: "Phoenix/Scottsdale, Arizona",
                subtitle: "Central Appointment Office",
                phone: "480-301-8484",
                time: "8 a.m. to 5 p.m. Mountain time",
              },
              {
                title: "Jacksonville, Florida",
                subtitle: "Central Appointment Office",
                phone: "904-953-0853",
                time: "8 a.m. to 5 p.m. Eastern time",
              },
            ].map((loc, idx) => (
              <div key={idx} className="mb-4">
                <p className="font-bold">{loc.title}</p>
                {loc.subtitle && <p className="font-medium">{loc.subtitle}</p>}
                <Link
                  href={`tel:${loc.phone.replace(/-/g, "")}`}
                  className="text-blue-600 underline"
                >
                  {loc.phone}
                </Link>
                <p>
                  {loc.time}
                  <br />
                  Monday through Friday
                </p>
              </div>
            ))}

            <div className="mb-4">
              <p className="font-bold">Minimalistic Clinic Health System</p>
              <p>
                Our regional network of care providers serving communities in
                Iowa, Minnesota and Wisconsin.
              </p>
            </div>

            <Link href="#" className="text-blue-800 underline">
              Find a provider or location
            </Link>

            <hr className="my-6 border-gray-300" />

            <h3 className="text-blue-800 font-semibold mb-3">
              International patients
            </h3>

            <h2
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: "mayo-display, Georgia, serif" }}
            >
              Locations outside of the U.S.
            </h2>
            <p className="mb-6">
              Please make your appointment request directly through the
              location’s website.
            </p>

            <Link
              href="#"
              className="block border-t pt-4 hover:bg-gray-50 transition"
            >
              <h4 className="text-blue-800 font-semibold">
                Minimalistic Clinic Healthcare
              </h4>
              <p className="text-gray-600">London, United Kingdom</p>
            </Link>
          </div>
        </div>
      </div>
      {/* Questions Section (Before Footer) */}
      <div className="bg-[#1c56b0] text-white px-6 lg:px-40 py-16">
        <div className="lg:flex lg:items-start lg:justify-between max-w-screen-xl mx-auto">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h2 className="text-3xl lg:text-3xl mt-40 font-bold leading-snug">
              Questions about appointments?
            </h2>
          </div>
          <div className="lg:w-1/2 space-y-8 text-sm sm:text-base">
            {[
              {
                title: "Appointment FAQs",
                desc: "Find answers to questions about our appointment process, scheduling, referrals, traveling to Minimalistic Clinic and more.",
                link: "#",
              },
              {
                title: "Insurance resources",
                desc: "Discover the hundreds of insurance providers we work with, self-pay options, funding and financial assistance programs.",
                link: "#",
              },
              {
                title: "International patient resources",
                desc: "Learn about our international medical centers, free language services, financial and travel resources.",
                link: "#",
              },
            ].map((item, i) => (
              <Link
                href={item.link}
                key={i}
                className="block border-t border-white/30 pt-5 group"
              >
                <h3 className="text-lg font-semibold group-hover:underline">
                  {item.title}
                </h3>
                <p className="mt-1 text-white/90">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AppointmentRequestPage;
