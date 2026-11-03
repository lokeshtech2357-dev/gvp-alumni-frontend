import { useState } from 'react';
import Head from 'next/head';

export default function AlumniChapters() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    graduationYear: '',
    department: '',
    chapterType: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Thank you for your interest! We will contact you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        state: '',
        country: '',
        graduationYear: '',
        department: '',
        chapterType: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>Alumni Chapters - Gayatri Grads Association</title>
        <meta name="description" content="Start an alumni chapter in your city and connect with fellow graduates" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-500 to-violet-700 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">Alumni Chapters</h1>
              <p className="text-lg md:text-2xl text-blue-100/90 max-w-3xl mx-auto">Connect, Network, and Grow with Fellow Graduates</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-12 md:h-16 bg-gradient-to-b from-transparent to-white pointer-events-none" />
        </div>

        {/* About Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What are Alumni Chapters?</h2>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p className="text-lg leading-relaxed">
                Alumni chapters generally begin with a small group of dedicated graduates with similar interests 
                and support from a campus department, program or region. An alumni chapter can do many different things.
              </p>
              <p className="text-lg leading-relaxed">
                It can provide networking and professional development opportunities for alumni and current students 
                in the field, raise funds and awareness in community or serve as a social outlet for fellow graduates.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Networking</h3>
                <p className="text-gray-600">Connect with fellow graduates in your area</p>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Development</h3>
                <p className="text-gray-600">Career growth and learning opportunities</p>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Impact</h3>
                <p className="text-gray-600">Make a difference in your local community</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Chapter Meets Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Recent Chapter Meets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Hyderabad Meet Image */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <img src="/images/logos/GVP-Hyd-Alumni-meet-June-2024-1024x912.webp" alt="Hyderabad Alumni Meet" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Hyderabad Chapter</h3>
                  <p className="text-gray-600">June 2024 Meet</p>
                </div>
              </div>

              {/* Bangalore Meet Image */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <img src="/images/logos/GVP-Blore-meet-June-2024-1024x828.webp" alt="Bangalore Alumni Meet" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Bangalore Chapter</h3>
                  <p className="text-gray-600">June 2024 Meet</p>
                </div>
              </div>

              {/* Video Highlights */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="relative h-64 bg-black">
                  <video src="/images/WhatsApp-Video-2024-07-06-at-19.07.12.mp4" controls className="w-full h-full object-contain" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Chapter Glimpses</h3>
                  <p className="text-gray-600">Event Highlights</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Are you interested to start one such in your city?
              </h2>
              <p className="text-xl mb-8 text-indigo-100">
                Please connect with us and be part of our growing alumni network
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-2xl font-bold mb-2">Contact Us</h3>
                  <a 
                    href="mailto:secgayatrigrads@gmail.com?subject=Starting%20an%20Alumni%20Chapter&body=Dear%20Gayatri%20Grads%20Association%2C%0D%0A%0D%0AI%20am%20interested%20in%20establishing%20a%20new%20alumni%20chapter.%20Please%20let%20me%20know%20how%20we%20can%20get%20started.%0D%0A%0D%0A-%20Full%20Name%3A%0D%0A-%20Graduation%20Year%20%2F%20Batch%3A%0D%0A-%20Department%2FBranch%3A%0D%0A-%20Proposed%20Chapter%20Location%20%2F%20City%3A%0D%0A-%20Proposed%20Chapter%20Type%20(Regional%2FDepartment%2FProfessional%2FInterest)%3A%0D%0A%0D%0AThank%20you%2C%0D%0A%5BYour%20Name%5D"
                    className="text-xl mb-4 block hover:underline hover:text-indigo-200 transition-colors font-semibold"
                  >
                    secgayatrigrads@gmail.com
                  </a>
                  <p className="text-lg text-indigo-100">
                    We&apos;ll help you establish and grow your alumni chapter
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Start a Chapter in Your City
            </h2>
            
            {submitMessage && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-700 text-center">
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Graduation Year *
                  </label>
                  <input
                    type="text"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2020"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Hyderabad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Telangana"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="India"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department/Program *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Computer Science"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter Type *
                  </label>
                  <select
                    name="chapterType"
                    value={formData.chapterType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Chapter Type</option>
                    <option value="regional">Regional Chapter</option>
                    <option value="department">Department Chapter</option>
                    <option value="professional">Professional Chapter</option>
                    <option value="interest">Interest-based Chapter</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to start a chapter? *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your vision for alumni chapter..."
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
