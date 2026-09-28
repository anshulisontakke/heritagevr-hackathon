import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Redirect back to where they were, or default to dashboard
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (type) => {
    if (type === 'admin') {
      setEmail('admin@heritagevr.com');
      setPassword('Admin@123');
    } else {
      setEmail('user@heritagevr.com');
      setPassword('User@123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 bg-heritage-navy px-4">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2000" alt="Background" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-heritage-navy via-heritage-navy/90 to-heritage-navy/50"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-heritage-gold/20 text-heritage-gold mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to track your preservation impact.</p>
        </div>

        <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10" 
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold flex justify-center items-center transition-all ${
                loading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'btn-gold shadow-lg shadow-heritage-gold/20'
              }`}
            >
              {loading ? <div className="spinner !w-5 !h-5 !border-2 border-t-heritage-navy mr-2"></div> : null}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account? <Link to="/register" className="text-heritage-cyan hover:underline font-medium">Register here</Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-500 mb-3 text-center uppercase tracking-wider font-mono">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleDemoFill('user')} className="text-xs py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors text-gray-300">
                Demo User
              </button>
              <button onClick={() => handleDemoFill('admin')} className="text-xs py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors text-gray-300">
                Demo Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
