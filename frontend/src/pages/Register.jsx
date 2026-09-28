import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.confirmPassword);
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        setError(err.errors.map(e => e.message).join('. '));
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 bg-heritage-navy px-4">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1590050752117-238cb4020696?q=80&w=2000" alt="Background" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-heritage-navy via-heritage-navy/90 to-heritage-navy/50"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-heritage-cyan/20 text-heritage-cyan mb-4 border border-heritage-cyan/30">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Create an Account</h1>
          <p className="text-gray-400">Join our community of heritage preservers.</p>
        </div>

        <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="text" name="name" required
                  value={formData.name} onChange={handleChange}
                  className="input-field pl-10" placeholder="Arjun Sharma"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="email" name="email" required
                  value={formData.email} onChange={handleChange}
                  className="input-field pl-10" placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="password" name="password" required
                  value={formData.password} onChange={handleChange}
                  className="input-field pl-10" placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Must contain 8+ chars, upper, lower, number, special.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="password" name="confirmPassword" required
                  value={formData.confirmPassword} onChange={handleChange}
                  className="input-field pl-10" placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className={`w-full py-3 mt-4 rounded-xl font-bold flex justify-center items-center transition-all ${
                loading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'btn-cyan shadow-lg shadow-heritage-cyan/20'
              }`}
            >
              {loading ? <div className="spinner !w-5 !h-5 !border-2 border-t-heritage-navy mr-2"></div> : null}
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-heritage-gold hover:underline font-medium">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
