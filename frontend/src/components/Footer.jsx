import { Link } from 'react-router-dom';
import { Landmark, Twitter, Instagram, Linkedin, Github, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-heritage-charcoal pt-16 pb-8 border-t border-white/5 z-10 overflow-hidden">
      {/* Decorative heritage pattern */}
      <div className="absolute inset-0 heritage-pattern opacity-30 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <Landmark className="w-8 h-8 text-heritage-gold" />
              <span className="text-2xl font-display font-bold text-white">
                Heritage<span className="text-heritage-gold">VR</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Explore Today, Preserve Tomorrow. Step inside history through immersive virtual experiences and help preserve endangered heritage sites for future generations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-heritage-gold hover:text-white transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-heritage-gold hover:text-white transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-heritage-gold hover:text-white transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-heritage-gold hover:text-white transition-all duration-300">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 font-display">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/explore" className="text-gray-400 hover:text-heritage-gold transition-colors text-sm">Explore Heritage Sites</Link>
              </li>
              <li>
                <Link to="/adopt" className="text-gray-400 hover:text-heritage-gold transition-colors text-sm">Adopt a Stone Program</Link>
              </li>
              <li>
                <Link to="/impact" className="text-gray-400 hover:text-heritage-gold transition-colors text-sm">Our Impact & Fund Tracking</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-heritage-gold transition-colors text-sm">About HeritageVR</Link>
              </li>
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 font-display">Powered By</h3>
            <ul className="space-y-4">
              <li className="text-gray-400 text-sm flex items-center">
                <span className="w-2 h-2 rounded-full bg-heritage-cyan mr-3"></span>
                WebXR & Three.js
              </li>
              <li className="text-gray-400 text-sm flex items-center">
                <span className="w-2 h-2 rounded-full bg-heritage-cyan mr-3"></span>
                Photogrammetry & NeRF
              </li>
              <li className="text-gray-400 text-sm flex items-center">
                <span className="w-2 h-2 rounded-full bg-heritage-cyan mr-3"></span>
                React & Node.js
              </li>
              <li className="text-gray-400 text-sm flex items-center">
                <span className="w-2 h-2 rounded-full bg-heritage-cyan mr-3"></span>
                PostgreSQL & Prisma
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 font-display">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Join our newsletter to receive updates on newly digitized sites and restoration progress.
            </p>
            <form className="mb-6 flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/5 border border-white/10 rounded-l-xl px-4 py-2 text-sm text-white w-full focus:outline-none focus:border-heritage-cyan/50"
              />
              <button className="bg-heritage-gold hover:bg-heritage-gold/90 text-heritage-navy font-bold px-4 py-2 rounded-r-xl transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center text-gray-400 text-sm">
              <Mail className="w-4 h-4 mr-2" />
              hello@heritagevr.com
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} HeritageVR. All rights reserved. Hackathon Prototype.
          </p>
          <div className="flex items-center text-gray-500 text-sm">
            Built with <Heart className="w-4 h-4 text-red-500 mx-1" /> for Heritage Preservation
          </div>
        </div>
      </div>
    </footer>
  );
}
