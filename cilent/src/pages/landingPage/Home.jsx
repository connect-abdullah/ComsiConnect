import React from 'react'
import { motion } from 'framer-motion' // Animation library
import { FaUserFriends, FaComments, FaGraduationCap } from 'react-icons/fa' 
import Aurora from '../../components/Aurora';

import Navbar from '../../components/LandingPage/Navbar'
import Footer from '../../components/LandingPage/Footer'

const Home = () => {
  return (
    <div className="relative bg-zinc-900 text-white min-h-screen">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Aurora
          colorStops={["#3A29FF", "#4F46E5", "#FF3232"]}
          blend={0.8}
          amplitude={1.3}
          speed={0.9}
        />
      </div>
      
      {/* Content with relative positioning to appear above Aurora */}
      <div className="relative z-10">
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
              Connect with the community
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-zinc-300 text-lg md:text-xl"
            >
              The exclusive social platform designed for students, faculty, and alumni. 
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
            className="flex-1 w-full"
          >
            <div className="relative h-80 w-full md:h-96">
              {/* Enhanced app mockup with depth and realism */}
              <div className="absolute top-0 right-0 w-full md:w-4/5 h-full bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl overflow-hidden border border-zinc-700 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
                {/* Browser-style header with realistic controls */}
                <div className="h-8 bg-zinc-700 flex items-center px-3 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"></div>
                  <div className="ml-4 bg-zinc-600 rounded-md h-4 w-40 flex items-center justify-center">
                    <div className="w-3/4 h-2 bg-zinc-500 rounded-full"></div>
                  </div>
                </div>
                {/* App content with interactive elements */}
                <div className="p-4 space-y-4">
                  {/* Header with avatar and username */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold shadow-lg">CS</div>
                    <div className="space-y-1">
                      <div className="h-4 w-24 bg-zinc-700 rounded-md"></div>
                      <div className="h-2 w-16 bg-zinc-700/70 rounded-md"></div>
                    </div>
                    <div className="ml-auto h-6 w-6 rounded-full bg-zinc-700 flex items-center justify-center">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                  {/* Post with engagement icons and shimmer effect */}
                  <div className="space-y-2 relative overflow-hidden">
                    <div className="h-4 w-3/4 bg-zinc-700 rounded-md"></div>
                    <div className="h-32 bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-700 rounded-md relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-500/10 to-transparent shimmer"></div>
                    </div>
                    <div className="flex gap-4 pt-2">
                      <div className="h-6 w-6 rounded-full bg-zinc-600 hover:bg-indigo-600 transition-colors flex items-center justify-center">
                        <div className="w-3 h-3 bg-zinc-400"></div>
                      </div>
                      <div className="h-6 w-6 rounded-full bg-zinc-600 hover:bg-indigo-600 transition-colors flex items-center justify-center">
                        <div className="w-3 h-3 bg-zinc-400"></div>
                      </div>
                      <div className="h-6 w-6 rounded-full bg-zinc-600 hover:bg-indigo-600 transition-colors flex items-center justify-center">
                        <div className="w-3 h-3 bg-zinc-400"></div>
                      </div>
                    </div>
                  </div>
                  {/* Comment section with hover effects */}
                  <div className="pl-4 border-l-2 border-indigo-600/50 space-y-2 hover:border-indigo-500 transition-colors">
                    <div className="h-4 w-2/3 bg-zinc-700 rounded-md"></div>
                    <div className="h-4 w-1/2 bg-zinc-700 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 md:px-20 bg-zinc-800/70 backdrop-blur-sm">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ComsiConnect?</h2>
            <p className="text-zinc-300 max-w-2xl mx-auto">Discover all the ways our platform helps you stay connected with the community.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-zinc-700/80 p-6 rounded-xl border border-zinc-600 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center mb-4">
                <FaUserFriends className="text-indigo-400 text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Connect with Peers</h3>
              <p className="text-zinc-300">Find and connect with classmates, seniors, and alumni to build your professional network.</p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-zinc-700/80 p-6 rounded-xl border border-zinc-600 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center mb-4">
                <FaComments className="text-indigo-400 text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Exclusive Forums</h3>
              <p className="text-zinc-300">Participate in department-specific discussions, events, and knowledge sharing sessions.</p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-zinc-700/80 p-6 rounded-xl border border-zinc-600 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center mb-4">
                <FaGraduationCap className="text-indigo-400 text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Academic Resources</h3>
              <p className="text-zinc-300">Access study materials, past papers, and collaborative project opportunities.</p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 md:px-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to join the ComsiConnect community?</h2>
            <p className="text-zinc-300 text-lg mb-8">Sign up now and connect with thousands of students and alumni.</p>
            <a href="/signup" className="px-8 py-4 rounded-md bg-indigo-600 hover:bg-indigo-700 transition duration-300 font-medium text-lg">
              Create Your Account
            </a>
          </div>
        </section>

        {/* Footer */}
        <Footer/>
      </div>
    </div>
  )
}

export default Home
