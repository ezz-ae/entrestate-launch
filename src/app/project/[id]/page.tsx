import React from 'react';

// This is a placeholder for a more sophisticated map component
const LocationMap = ({ lat, lng, projectName }) => (
  <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-600 italic rounded-lg shadow-inner border border-gray-200">
    [Interactive Map for {projectName} at Lat: {lat}, Lng: {lng}]
    {/* In a real app, this would be an actual map component like Google Maps, Mapbox, etc. */}
  </div>
);

const ProjectProfilePublicPage = ({ params }: { params: { id: string } }) => {
  // Placeholder data for demonstration. In a real app, 'id' would be used to fetch project data.
  const project = {
    id: params.id,
    title: "Skyline Residences - Unit 1402",
    keyDetails: "3 Bed, 4 Bath, 2,500 sqft. | Downtown Dubai | AED 3.2M",
    summary: "A meticulously designed unit offering panoramic city views and premium amenities. Ideal for discerning buyers. Experience luxury living in the heart of Downtown Dubai, with world-class facilities and unparalleled access to the city's finest attractions. Every detail has been crafted to perfection, ensuring a lifestyle of comfort and elegance.",
    location: "Business Bay, Dubai",
    propertyType: "Apartment - High-Rise",
    bedrooms: 3,
    bathrooms: 4,
    areaSqft: 2500,
    areaSqm: 232,
    salePrice: "AED 3,200,000",
    serviceCharges: "AED 25,000 / year",
    paymentPlan: "25% Down, 75% Post-Handover (3 years)",
    completionStatus: "Ready for Occupancy",
    amenities: [
      { icon: "🏊", text: "Infinity Pool & Fitness Center" },
      { icon: "🚗", text: "2 Dedicated Parking Spaces" },
      { icon: " vigilant", text: "24/7 Security & Concierge" },
      { icon: "🌆", text: "Panoramic City Views" },
      { icon: "🌳", text: "Landscaped Gardens" },
      { icon: "🍽️", text: "Gourmet Dining Options Nearby" }
    ],
    images: ["/path/to/img1.jpg", "/path/to/img2.jpg"], // Placeholder images
    documents: [
      { name: "Floor Plans (PDF)", link: "/path/to/floorplan.pdf" },
      { name: "e-Brochure (PDF)", link: "/path/to/brochure.pdf" },
      { name: "Payment Schedule (PDF)", link: "/path/to/payments.pdf" }
    ],
    performance: {
      pageViews: 1245,
      qualifiedInquiries: 28,
      meetingsBooked: 5,
      lastActivity: "Lead viewed property page 1 hour ago"
    },
    latitude: 25.1972, // Example latitude for Downtown Dubai
    longitude: 55.2794, // Example longitude for Downtown Dubai
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Above the fold: "Try it now" */}
      <section className="relative bg-gradient-to-br from-slate-50 to-stone-100 py-16 px-4 md:px-8 text-center overflow-hidden flex flex-col items-center justify-center min-h-screen-75vh">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-gray-900">
            {project.title}: Experience This Property. Instantly.
          </h1>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* A. Chat (Default) */}
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
            <h2 className="text-2xl font-bold text-navy-700 mb-4 text-center">Chat About This Property</h2>
            <div className="flex-grow flex flex-col bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
              <div className="text-sm text-gray-700 bg-gray-100 p-3 rounded-xl rounded-bl-none self-start max-w-[85%] shadow-sm">
                I'm ready to answer any questions about {project.title}. Tell me what interests you.
              </div>
              {/* Simulate user typing */}
              <div className="flex-grow"></div>
              <input
                type="text"
                placeholder="Ask your Digital Consultant about this property..."
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-500"
              />
            </div>
            <button className="bg-navy-700 hover:bg-navy-800 text-white font-bold py-3 rounded-lg text-lg transition-colors duration-300 shadow-md">
              Start Chat
            </button>
          </div>

          {/* B. Cold Call (Add Your Number) */}
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
            <h2 className="text-2xl font-bold text-navy-700 mb-4 text-center">Request a Call About {project.title}</h2>
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
            <select
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="">Call me to discuss:</option>
              <option value="property-details">Property Details</option>
              <option value="viewing-schedule">Schedule a Viewing</option>
              <option value="payment-options">Payment Options</option>
            </select>
            <button className="bg-navy-700 hover:bg-navy-800 text-white font-bold py-3 rounded-lg text-lg transition-colors duration-300 shadow-md">
              Call me now
            </button>
            {/* Confirmation State Placeholder */}
            <p className="text-sm text-gray-600 mt-4 text-center italic opacity-0 transition-opacity duration-300" /* active state: opacity-100 */>
              You'll receive a call shortly from your assistant. Please be ready.
            </p>
          </div>

          {/* C. Receive Personalized Project Report */}
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
            <h2 className="text-2xl font-bold text-navy-700 mb-4 text-center">Receive a Personalized Project Report</h2>
            <p className="text-gray-700 mb-4 text-center">Enter your email to receive a detailed report for {project.title}.</p>
            <input
              type="email"
              placeholder="Your email address"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
            {/* Progress States */}
            <div className="text-sm text-gray-600 text-center space-y-1">
              <p>Compiling data...</p>
              <p>Generating report...</p>
            </div>
            <button className="bg-navy-700 hover:bg-navy-800 text-white font-bold py-3 rounded-lg text-lg transition-colors duration-300 shadow-md mt-4">
              Send Report
            </button>
            {/* Confirmation State Placeholder */}
            <p className="text-sm text-gray-600 mt-4 text-center italic opacity-0 transition-opacity duration-300" /* active state: opacity-100 */>
              Report sent to your inbox!
            </p>
          </div>
        </div>
      </section>

      {/* Project Overview (Hero-like Section - content moved from original hero) */}
      <section className="relative py-16 px-4 md:px-8 bg-white">
        <div className="relative z-10 max-w-6xl mx-auto md:flex md:items-center md:space-x-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-gray-900">
              {project.title}
            </h2>
            <p className="text-xl text-gray-700 mb-4">{project.keyDetails}</p>
            <p className="text-lg text-gray-600 mb-8">{project.summary}</p>
            {/* These buttons are now secondary and visually distinct from the "Above the fold" CTAs */}
            <div className="flex flex-col space-y-3">
              <button className="bg-navy-600 hover:bg-navy-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-md">
                Launch Dedicated Property Page
              </button>
              <button className="bg-stone-600 hover:bg-stone-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-md">
                Prepare Engaging Marketing Content
              </button>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-md">
                Activate Buyer Campaigns
              </button>
              <button className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-md">
                Share Project Details
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <LocationMap lat={project.latitude} lng={project.longitude} projectName={project.title} />
          </div>
        </div>
      </section>

      {/* Social Proof Section - adapted for Project Profile */}
      <section className="py-16 px-4 md:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Projects That Attract. Brokers Who Excel.</h2>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg flex items-start space-x-4 border border-gray-200">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">ZA</div>
            <div>
              <blockquote className="text-lg text-gray-700 italic mb-3">
                "Showcasing {project.title} with Entrestate’s tools elevated my entire presentation. Buyers are more engaged, and inquiries are more frequent and qualified."
              </blockquote>
              <p className="font-semibold text-gray-900">— Zahra A., Elite Realty Group</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg flex items-start space-x-4 border border-gray-200">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">HA</div>
            <div>
              <blockquote className="text-lg text-gray-700 italic mb-3">
                "The instant landing page and sales message features make promoting listings like {project.title} incredibly efficient. It's a true sales engine."
              </blockquote>
              <p className="font-semibold text-gray-900">— Hamad A., Property Visionaries</p>
            </div>
          </div>
        </div>
      </section>

      {/* "Project Details" (Data-Rich, but Human-Readable) */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Comprehensive Project Information.</h2>
          <p className="text-lg text-gray-700">All the essential details for you and your clients, presented with clarity.</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Core Information</h3>
            <ul className="space-y-2 text-lg text-gray-700">
              <li><span className="font-semibold">Location:</span> {project.location}</li>
              <li><span className="font-semibold">Property Type:</span> {project.propertyType}</li>
              <li><span className="font-semibold">Bedrooms:</span> {project.bedrooms}</li>
              <li><span className="font-semibold">Bathrooms:</span> {project.bathrooms}</li>
              <li><span className="font-semibold">Area:</span> {project.areaSqft} sqft / {project.areaSqm} sqm</li>
              <li><span className="font-semibold">Completion Status:</span> {project.completionStatus}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Financial Overview</h3>
            <ul className="space-y-2 text-lg text-gray-700">
              <li><span className="font-semibold">Sale Price:</span> {project.salePrice}</li>
              <li><span className="font-semibold">Service Charges:</span> {project.serviceCharges}</li>
              <li><span className="font-semibold">Payment Plan:</span> {project.paymentPlan}</li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Features & Amenities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg text-gray-700">
              {project.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-2xl mr-2">{amenity.icon}</span>{amenity.text}
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Documents & Media</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.images.map((image, index) => (
                <div key={index} className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-500 italic">
                  [Image {index + 1}]
                </div>
              ))}
              {project.documents.map((doc, index) => (
                <a key={index} href={doc.link} className="bg-navy-100 hover:bg-navy-200 text-navy-800 p-4 rounded-lg shadow-sm flex items-center justify-center text-center font-semibold transition-colors duration-200">
                  {doc.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* "Your Sales Toolkit for This Project" (Action-Oriented Sections, from old code) */}
      <section className="py-16 px-4 md:px-8 bg-stone-100">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Your Sales Toolkit for {project.title}.</h2>
          <p className="text-lg text-gray-700">Seamlessly create marketing assets and campaigns directly from this project profile.</p>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Toolkit Card 1 */}
          <div className="bg-white p-8 rounded-lg shadow-md flex flex-col justify-between border border-gray-200">
            <div>
              <div className="text-5xl text-gray-700 mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Dedicated Property Page</h3>
              <p className="text-gray-700 mb-4">Instantly create and customize a high-converting landing page for this specific project. Showcase unique features and capture leads directly.</p>
            </div>
            <button className="mt-4 bg-navy-600 hover:bg-navy-700 text-white font-bold py-2 rounded-lg transition-colors duration-300">
              Build Page
            </button>
          </div>
          {/* Toolkit Card 2 */}
          <div className="bg-white p-8 rounded-lg shadow-md flex flex-col justify-between border border-gray-200">
            <div>
              <div className="text-5xl text-gray-700 mb-4">✏️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Engaging Listing Descriptions</h3>
              <p className="text-gray-700 mb-4">Draft compelling, multi-language descriptions for property portals and marketing materials. Highlight key selling points effortlessly.</p>
            </div>
            <button className="mt-4 bg-navy-600 hover:bg-navy-700 text-white font-bold py-2 rounded-lg transition-colors duration-300">
              Draft Content
            </button>
          </div>
          {/* Toolkit Card 3 */}
          <div className="bg-white p-8 rounded-lg shadow-md flex flex-col justify-between border border-gray-200">
            <div>
              <div className="text-5xl text-gray-700 mb-4">📣</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Targeted Sales Messages</h3>
              <p className="text-gray-700 mb-4">Prepare personalized sales messages and outreach sequences for potential buyers interested in this property.</p>
            </div>
            <button className="mt-4 bg-navy-600 hover:bg-navy-700 text-white font-bold py-2 rounded-lg transition-colors duration-300">
              Prepare Messages
            </button>
          </div>
          {/* Toolkit Card 4 */}
          <div className="bg-white p-8 rounded-lg shadow-md flex flex-col justify-between border border-gray-200">
            <div>
              <div className="text-5xl text-gray-700 mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Teach Your Consultant This Project</h3>
              <p className="text-gray-700 mb-4">Ensure your Digital Consultant is fully equipped to answer all questions about this project, from amenities to payment plans.</p>
            </div>
            <button className="mt-4 bg-navy-600 hover:bg-navy-700 text-white font-bold py-2 rounded-lg transition-colors duration-300">
              Teach Consultant
            </button>
          </div>
          {/* Toolkit Card 5 */}
          <div className="bg-white p-8 rounded-lg shadow-md flex flex-col justify-between border border-gray-200">
            <div>
              <div className="text-5xl text-gray-700 mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Launch Focused Campaigns</h3>
              <p className="text-gray-700 mb-4">Seamlessly activate Google Ads or Instagram campaigns specifically for this project to attract high-intent buyers.</p>
            </div>
            <button className="mt-4 bg-navy-600 hover:bg-navy-700 text-white font-bold py-2 rounded-lg transition-colors duration-300">
              Launch Campaign
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Control: "Your Assets, Your Command." */}
      <section className="py-16 px-4 md:px-8 bg-stone-50">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Complete Control Over Your Project Assets.</h2>
          <p className="text-lg text-gray-700">Manage every aspect of this project's presentation and marketing with confidence and precision.</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-start bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl text-navy-600 mr-4">🔄</div>
            <div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900">Always Up-to-Date</h3>
              <p className="text-gray-700">Easily update any project detail, and it reflects instantly across all connected tools.</p>
            </div>
          </div>
          <div className="flex items-start bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl text-navy-600 mr-4">🔒</div>
            <div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900">Secure & Centralized</h3>
              <p className="text-gray-700">All project media and documents are securely stored and accessible from one place.</p>
            </div>
          </div>
          <div className="flex items-start bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl text-navy-600 mr-4">🌐</div>
            <div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900">Global Reach</h3>
              <p className="text-gray-700">Prepare project details and marketing materials in multiple languages to attract international buyers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Block */}
      <section className="bg-navy-700 py-16 px-4 md:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Turn This Project into a Sales Powerhouse?</h2>
          <p className="text-lg md:text-xl mb-8">
            Leverage Entrestate's comprehensive toolkit to showcase {project.title} and connect with high-intent buyers.
          </p>
          <button className="bg-white text-navy-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-xl transition-colors duration-300 shadow-lg">
            Explore Project Toolkit
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProjectProfilePublicPage;