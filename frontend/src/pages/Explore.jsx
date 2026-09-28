import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, MapPin, Filter, AlertCircle, TrendingUp, ShieldCheck } from 'lucide-react';

export default function Explore() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoading(true);
        const res = await api.getSites();
        setSites(res.data);
      } catch (err) {
        setError('Failed to load heritage sites. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSites();
  }, []);

  const getStatusConfig = (status) => {
    switch(status) {
      case 'Critical': return { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
      case 'At Risk': return { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' };
      case 'Under Restoration': return { icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' };
      case 'Restored': return { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' };
      default: return { icon: Info, color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30' };
    }
  };

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          site.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || site.preservationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header & Filters */}
        <div className="mb-12">
          <h1 className="section-heading mb-4 animate-slide-in-left">Explore Heritage Sites</h1>
          <p className="text-gray-400 max-w-3xl mb-8 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            Discover endangered historical monuments from around the world. Experience them virtually and contribute to their physical preservation.
          </p>

          <div className="flex flex-col md:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by name or location..." 
                className="input-field pl-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative w-full md:w-64">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select 
                className="input-field pl-12 appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Critical">Critical</option>
                <option value="At Risk">At Risk</option>
                <option value="Under Restoration">Under Restoration</option>
                <option value="Restored">Restored</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center text-red-400">
            {error}
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="glass-card p-12 text-center text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-medium text-white mb-2">No sites found</h3>
            <p>Try adjusting your search or filters.</p>
            <button 
              onClick={() => { setSearchTerm(''); setStatusFilter(''); }}
              className="mt-4 text-heritage-cyan hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredSites.map((site, index) => {
              const statusConfig = getStatusConfig(site.preservationStatus);
              const StatusIcon = statusConfig.icon;
              const fundingPercent = Math.min(100, (site.fundingRaised / site.fundingGoal) * 100).toFixed(0);
              
              return (
                <div 
                  key={site.id} 
                  className="glass-card-hover flex flex-col animate-slide-up"
                  style={{ animationDelay: `${(index % 3) * 0.1 + 0.3}s`, animationFillMode: 'both' }}
                >
                  {/* Image Header */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={site.heroImage || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800'} 
                      alt={site.name} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-heritage-navy via-heritage-navy/20 to-transparent"></div>
                    
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold flex items-center border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} backdrop-blur-md`}>
                      <StatusIcon className="w-3 h-3 mr-1.5" />
                      {site.preservationStatus}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold font-display text-white mb-2 line-clamp-1">{site.name}</h3>
                      <div className="flex items-center text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-1 text-heritage-gold" />
                        {site.location}
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                      {site.description}
                    </p>
                    
                    {/* Funding Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Preservation Fund</span>
                        <span className="text-heritage-cyan font-medium">{fundingPercent}%</span>
                      </div>
                      <div className="progress-bar mb-2">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${fundingPercent}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>₹{(site.fundingRaised / 100000).toFixed(1)}L raised</span>
                        <span>Goal: ₹{(site.fundingGoal / 100000).toFixed(1)}L</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <Link to={`/site/${site.id}`} className="btn-outline py-2.5 text-sm">
                        View Details
                      </Link>
                      <Link to={`/vr/${site.id}`} className="btn-cyan py-2.5 text-sm">
                        Explore VR
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
