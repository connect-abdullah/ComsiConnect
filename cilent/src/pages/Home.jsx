import React from 'react'
import { motion } from 'framer-motion' // Animation library
import { FaUserFriends, FaComments, FaGraduationCap } from 'react-icons/fa' 

import Navbar from '../components/LandingPage/Navbar'
import Footer from '../components/LandingPage/Footer'

const Home = () => {
  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      {/* Navbar */}
      <Navbar/>

      {/* Hero Section */}
      <section className="py-20 px-6 md:px-20 flex flex-col md:flex-row items-center gap-12">
        {/* Left side content */}
        <div className="flex-1 space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold leading-tight"
          >
            Connect with the <span className="text-indigo-500">COMSATS</span> community
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-lg md:text-xl"
          >
            The exclusive social platform designed for COMSATS students, faculty, and alumni. 
            Share ideas, collaborate on projects, and stay connected.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-4 pt-4"
          >
            <a href="/about" className="px-6 py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 transition duration-300 font-medium">
              Learn More
            </a>
          </motion.div>
        </div>
        
        {/* Right side image/graphic */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <div className="relative h-80 w-full md:h-96">
            {/* Enhanced app mockup */}
            <div className="absolute top-0 right-0 w-4/5 h-full bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl overflow-hidden border border-zinc-700 shadow-xl">
              {/* Browser-style header */}
              <div className="h-8 bg-zinc-700 flex items-center px-3 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 bg-zinc-600 rounded-md h-4 w-40"></div>
              </div>
              {/* App content with more realistic elements */}
              <div className="p-4 space-y-4">
                {/* Header with avatar */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">CS</div>
                  <div className="h-6 w-1/3 bg-zinc-700 rounded-md"></div>
                </div>
                {/* Post with engagement icons */}
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-zinc-700 rounded-md"></div>
                  <div className="h-20 bg-zinc-700 rounded-md"></div>
                  <div className="flex gap-4 pt-2">
                    <div className="h-6 w-6 rounded-full bg-zinc-600"></div>
                    <div className="h-6 w-6 rounded-full bg-zinc-600"></div>
                    <div className="h-6 w-6 rounded-full bg-zinc-600"></div>
                  </div>
                </div>
                {/* Comment section */}
                <div className="pl-4 border-l-2 border-zinc-700 space-y-2">
                  <div className="h-4 w-2/3 bg-zinc-700 rounded-md"></div>
                  <div className="h-4 w-1/2 bg-zinc-700 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-20 bg-zinc-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose COMSATS Connect?</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">Discover all the ways our platform helps you stay connected with the COMSATS community.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div 
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="bg-zinc-700 p-6 rounded-xl border border-zinc-600"
          >
            <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center mb-4">
              <FaUserFriends className="text-indigo-400 text-xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">Connect with Peers</h3>
            <p className="text-zinc-400">Find and connect with classmates, seniors, and alumni to build your professional network.</p>
          </motion.div>
          
          {/* Feature 2 */}
          <motion.div 
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="bg-zinc-700 p-6 rounded-xl border border-zinc-600"
          >
            <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center mb-4">
              <FaComments className="text-indigo-400 text-xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">Exclusive Forums</h3>
            <p className="text-zinc-400">Participate in department-specific discussions, events, and knowledge sharing sessions.</p>
          </motion.div>
          
          {/* Feature 3 */}
          <motion.div 
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="bg-zinc-700 p-6 rounded-xl border border-zinc-600"
          >
            <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center mb-4">
              <FaGraduationCap className="text-indigo-400 text-xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">Academic Resources</h3>
            <p className="text-zinc-400">Access study materials, past papers, and collaborative project opportunities.</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to join the COMSATS community?</h2>
          <p className="text-zinc-400 text-lg mb-8">Sign up now and connect with thousands of COMSATS students and alumni.</p>
          <a href="/signup" className="px-8 py-4 rounded-md bg-indigo-600 hover:bg-indigo-700 transition duration-300 font-medium text-lg">
            Create Your Account
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  )
}

export default Home
