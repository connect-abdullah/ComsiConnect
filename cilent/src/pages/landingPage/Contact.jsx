import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaUser, FaPhone, FaPaperPlane, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import Navbar from '../../components/LandingPage/Navbar'
import Footer from '../../components/LandingPage/Footer'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData)
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    }, 1500)
  }

  return (
    <div className="bg-zinc-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 px-6 md:px-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-20 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Get in <span className="text-indigo-500">Touch</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-zinc-300 text-lg md:text-xl mb-10"
            >
              Have questions or feedback? We'd love to hear from you.
            </motion.p>
          </div>
        </section>

        {/* Contact Form and Info Section */}
        <section className="py-12 px-6 md:px-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-zinc-800 rounded-xl border border-zinc-700 shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">Your Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-zinc-500" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-zinc-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                
                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-zinc-300 mb-2">Subject</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-zinc-500" />
                    </div>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      placeholder="How can we help you?"
                    />
                  </div>
                </div>
                
                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="block w-full p-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition duration-300 ${
                      isSubmitting ? 'bg-indigo-700 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Success Message */}
                {submitSuccess && (
                  <div className="mt-4 p-3 bg-green-600/20 border border-green-500 rounded-md text-green-200">
                    Your message has been sent successfully! We'll get back to you soon.
                  </div>
                )}
              </form>
            </motion.div>
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <p className="text-zinc-300 mb-8">
                  Have questions or need assistance? Reach out to us using the contact information below or fill out the form.
                </p>
              </div>
              
              {/* Contact Cards */}
              <div className="space-y-6">
                {/* Location */}
                <div className="flex items-start gap-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                  <div className="bg-indigo-600/20 p-3 rounded-lg">
                    <FaMapMarkerAlt className="text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Our Location</h3>
                    <p className="text-zinc-400">COMSATS University Islamabad, Park Road, Tarlai Kalan, Islamabad</p>
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex items-start gap-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                  <div className="bg-indigo-600/20 p-3 rounded-lg">
                    <FaEnvelope className="text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Email Us</h3>
                    <p className="text-zinc-400">support@comsatsconnect.edu.pk</p>
                    <p className="text-zinc-400">info@comsatsconnect.edu.pk</p>
                  </div>
                </div>
                
                {/* Hours */}
                <div className="flex items-start gap-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                  <div className="bg-indigo-600/20 p-3 rounded-lg">
                    <FaClock className="text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Working Hours</h3>
                    <p className="text-zinc-400">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-zinc-400">Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </div>
              
              {/* Map or Image */}
              <div className="mt-8 rounded-xl overflow-hidden border border-zinc-700 h-64 bg-zinc-800 flex items-center justify-center">
                <p className="text-zinc-400">Campus Map Placeholder</p>
                {/* In a real implementation, you would add a map here */}
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Contact
