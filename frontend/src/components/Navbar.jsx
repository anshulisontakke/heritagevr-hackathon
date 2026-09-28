import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Landmark, Compass, Eye, HandHeart, Info, LogIn, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Adopt a Stone', path: '/adopt', icon: HandHeart },
    { name: 'Impact', path: '/impact', icon: Eye },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-heritage-navy/90 backdrop-blur-md shadow-lg border-b border-white/10 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={closeMenu}>
            <Landmark className="w-8 h-8 text-heritage-gold transition-transform group-hover:scale-110" />
            <span className="text-2xl font-display font-bold text-white tracking-wide">
              Heritage<span className="text-heritage-gold">VR</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-heritage-gold ${
                  location.pathname === link.path ? 'text-heritage-gold' : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth/Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={logout}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 text-sm font-medium text-white hover:text-heritage-gold transition-colors">
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
            <Link to="/explore" className="btn-gold py-2 px-5 text-sm">
              Donate Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-heritage-navy/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 pt-2 pb-6 space-y-2 shadow-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  location.pathname === link.path ? 'bg-white/10 text-heritage-gold' : 'text-gray-300 hover:bg-white/5'
                }`}
                onClick={closeMenu}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
            
            <div className="h-px bg-white/10 my-4 mx-4"></div>
            
            {user ? (
              <>
                <Link
                  to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/5 rounded-xl transition-colors"
                  onClick={closeMenu}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <button
                  onClick={() => { logout(); closeMenu(); }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <LogIn className="w-5 h-5 transform rotate-180" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-white/5 rounded-xl transition-colors"
                onClick={closeMenu}
              >
                <LogIn className="w-5 h-5" />
                <span className="font-medium">Sign In / Register</span>
              </Link>
            )}
            
            <div className="pt-2 px-4">
              <Link to="/explore" className="btn-gold w-full flex justify-center py-3" onClick={closeMenu}>
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
