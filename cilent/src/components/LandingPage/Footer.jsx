import React from 'react'

const Footer = () => {
  return (
    <div>
        <footer className="bg-zinc-800 py-8 px-6 border-t border-zinc-700">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 w-6 h-6 rounded-md flex items-center justify-center">
                <span className="font-bold text-sm">C</span>
              </div>
              <span className="font-bold">ComsiConnect Connect</span>
            </div>
            <p className="text-zinc-500 text-sm mt-1">© 2025 All rights reserved</p>
          </div>
          
          <div className="flex gap-6 text-zinc-400">
            <a href="/about" className="hover:text-white transition">About</a>
            <a href="/contact" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer;
