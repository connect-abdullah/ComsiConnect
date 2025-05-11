import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaGraduationCap, FaUsers, FaLaptopCode, FaBriefcase, FaHandshake, FaUniversity } from 'react-icons/fa'
import Navbar from '../../components/LandingPage/Navbar'
import Footer from '../../components/LandingPage/Footer'

const About = () => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="relative py-20 px-6 md:px-20 overflow-hidden">
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
            About <span className="text-indigo-500">COMSATS Connect</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-zinc-300 text-lg md:text-xl mb-10"
          >
            Building bridges between students, faculty, and alumni to create a thriving academic community.
          </motion.p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-6 md:px-20 bg-gradient-to-b from-zinc-800/50 to-zinc-900">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-zinc-800/70 backdrop-blur-sm border border-zinc-700 rounded-2xl p-8 shadow-xl"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-indigo-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUniversity className="text-indigo-400 text-4xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-zinc-300">
                  COMSATS Connect is dedicated to fostering a vibrant digital ecosystem where the COMSATS University community can collaborate, share knowledge, and build lasting professional relationships. We aim to bridge the gap between academic learning and real-world application by connecting students with alumni, faculty, and industry professionals.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is COMSATS Connect */}
      <section className="py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-16 text-center"
          >
            What is <span className="text-indigo-500">COMSATS Connect</span>?
          </motion.h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Card 1 */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-zinc-800 to-zinc-800/70 rounded-xl border border-zinc-700 overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition duration-300 hover:-translate-y-1">
              <div className="h-2 bg-indigo-600"></div>
              <div className="p-6">
                <div className="w-14 h-14 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-6">
                  <FaUsers className="text-indigo-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-3">Community Platform</h3>
                <p className="text-zinc-400">
                  COMSATS Connect is an exclusive social network designed specifically for COMSATS University students, faculty, and alumni. It provides a safe and focused environment for academic and professional networking.
                </p>
              </div>
            </motion.div>
            
            {/* Card 2 */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-zinc-800 to-zinc-800/70 rounded-xl border border-zinc-700 overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition duration-300 hover:-translate-y-1">
              <div className="h-2 bg-indigo-600"></div>
              <div className="p-6">
                <div className="w-14 h-14 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-6">
                  <FaGraduationCap className="text-indigo-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-3">Knowledge Sharing</h3>
                <p className="text-zinc-400">
                  Our platform facilitates the exchange of academic resources, research papers, study materials, and course insights. Students can learn from their peers and seniors, making education more collaborative.
                </p>
              </div>
            </motion.div>
            
            {/* Card 3 */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-zinc-800 to-zinc-800/70 rounded-xl border border-zinc-700 overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition duration-300 hover:-translate-y-1">
              <div className="h-2 bg-indigo-600"></div>
              <div className="p-6">
                <div className="w-14 h-14 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-6">
                  <FaLaptopCode className="text-indigo-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-3">Project Collaboration</h3>
                <p className="text-zinc-400">
                  Find teammates for academic projects, hackathons, and research initiatives. COMSATS Connect makes it easy to discover peers with complementary skills and shared interests.
                </p>
              </div>
            </motion.div>
            
            {/* Card 4 */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-zinc-800 to-zinc-800/70 rounded-xl border border-zinc-700 overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition duration-300 hover:-translate-y-1">
              <div className="h-2 bg-indigo-600"></div>
              <div className="p-6">
                <div className="w-14 h-14 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-6">
                  <FaBriefcase className="text-indigo-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-3">Career Opportunities</h3>
                <p className="text-zinc-400">
                  Alumni and industry partners share job openings, internships, and career advice. Get mentorship from graduates who have successfully navigated the transition from academia to industry.
                </p>
              </div>
            </motion.div>
            
            {/* Card 5 */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-zinc-800 to-zinc-800/70 rounded-xl border border-zinc-700 overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition duration-300 hover:-translate-y-1">
              <div className="h-2 bg-indigo-600"></div>
              <div className="p-6">
                <div className="w-14 h-14 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-6">
                  <FaHandshake className="text-indigo-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-3">Mentorship Network</h3>
                <p className="text-zinc-400">
                  Connect with experienced seniors and alumni who can guide you through academic challenges, career decisions, and professional development. Build relationships that last beyond graduation.
                </p>
              </div>
            </motion.div>
            
            {/* Card 6 */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-zinc-800 to-zinc-800/70 rounded-xl border border-zinc-700 overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition duration-300 hover:-translate-y-1">
              <div className="h-2 bg-indigo-600"></div>
              <div className="p-6">
                <div className="w-14 h-14 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-6">
                  <FaUniversity className="text-indigo-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-3">Campus Life</h3>
                <p className="text-zinc-400">
                  Stay updated on university events, club activities, and campus news. Participate in discussions about campus life, share experiences, and make the most of your time at COMSATS.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      

      {/* Join Us CTA */}
      <section className="py-20 px-6 md:px-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-900/60 to-indigo-700/60 rounded-2xl p-10 border border-indigo-500/30 shadow-xl text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Connect?</h2>
          <p className="text-lg text-indigo-100 mb-8">
            Join thousands of COMSATS students and alumni already building their network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition duration-300">
              Create Account
            </Link>
            <Link to="/login" className="px-8 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-md font-medium transition duration-300">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}

export default About