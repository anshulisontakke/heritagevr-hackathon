import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { MapPin, Calendar, Activity, Users, Check, ChevronRight, Play, Heart, ArrowRight } from 'lucide-react';

export default function SiteDetails() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const fetchSiteDetails = async () => {
      try {
        setLoading(true);
        const res = await api.getSite(id);
        setSite(res.data);
      } catch (err) {
        setError('Failed to load site details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSiteDetails();
  }, [id]);

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging.current || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percent = (x / rect.width) * 100;
      setSliderPosition(percent);
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
      const percent = (x / rect.width) * 100;
      setSliderPosition(percent);
    };

    const stopDragging = () => { isDragging.current = false; };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', stopDragging);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-heritage-navy pt-20">
      <div className="spinner"></div>
    </div>
  );

  if (error || !site) return (
    <div className="min-h-screen flex items-center justify-center bg-heritage-navy pt-20">
      <div className="text-red-400 text-center glass-card p-8">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <p>{error || 'Site not found'}</p>
        <Link to="/explore" className="text-heritage-cyan mt-4 inline-block hover:underline">Return to Explore</Link>
      </div>
    </div>
  );

  const fundingPercent = Math.min(100, (site.fundingRaised / site.fundingGoal) * 100).toFixed(1);

  return (
    <div className="bg-heritage-navy min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <img src={site.heroImage} alt={site.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-heritage-navy via-heritage-navy/60 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 pb-12">
          <div className="max-w-4xl animate-slide-up">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/20 text-white">
                {site.preservationStatus}
              </span>
              <span className="bg-heritage-cyan/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-heritage-cyan/30 text-heritage-cyan">
                {site.period}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 leading-tight shadow-black drop-shadow-2xl">{site.name}</h1>
            <div className="flex items-center text-gray-200 text-lg mb-8">
              <MapPin className="w-5 h-5 mr-2 text-heritage-gold" />
              {site.location}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link to={`/vr/${site.id}`} className="btn-cyan py-3 px-8 text-base">
                <Play className="w-5 h-5 mr-2" fill="currentColor" />
                Enter Virtual Experience
              </Link>
              <Link to="/adopt" className="btn-gold py-3 px-8 text-base">
                <Heart className="w-5 h-5 mr-2" />
                Support Preservation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column (Content) */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* About */}
              <div className="scroll-reveal visible">
                <h2 className="text-3xl font-display font-bold text-white mb-6 border-b border-white/10 pb-4">About this Site</h2>
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-4">
                  <p>{site.description}</p>
                </div>
              </div>

              {/* Then vs Now Comparison */}
              {site.thenImage && site.nowImage && (
                <div className="scroll-reveal visible">
                  <h2 className="text-3xl font-display font-bold text-white mb-6 border-b border-white/10 pb-4">Historical Evolution</h2>
                  <p className="text-gray-400 mb-6">Drag the slider to compare the historical/restored vision with the current deteriorating condition.</p>
                  
                  <div 
                    ref={sliderRef}
                    className="relative w-full aspect-video md:aspect-[16/7] rounded-2xl overflow-hidden glass-card cursor-ew-resize select-none"
                    onMouseDown={() => isDragging.current = true}
                    onTouchStart={() => isDragging.current = true}
                  >
                    {/* Now Image (Background) */}
                    <img src={site.nowImage} alt="Current condition" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                    
                    {/* Then Image (Foreground/Clipped) */}
                    <div 
                      className="absolute inset-0 overflow-hidden pointer-events-none"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      <img src={site.thenImage} alt="Historical view" className="absolute top-0 left-0 h-full object-cover" style={{ width: `${100 * (100 / sliderPosition)}%`, maxWidth: 'none' }} />
                    </div>

                    {/* Slider Handle */}
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-heritage-cyan z-20"
                      style={{ left: `calc(${sliderPosition}% - 2px)` }}
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg pointer-events-none">
                        <div className="w-6 h-6 flex justify-between items-center text-heritage-navy">
                          <ChevronRight className="w-4 h-4 transform rotate-180 -mr-1" />
                          <ChevronRight className="w-4 h-4 -ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Labels */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-xs font-bold tracking-wider text-white z-20 pointer-events-none">HISTORICAL</div>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-xs font-bold tracking-wider text-white z-20 pointer-events-none">CURRENT</div>
                  </div>
                </div>
              )}

              {/* Historical Context */}
              <div className="scroll-reveal visible">
                <h2 className="text-3xl font-display font-bold text-white mb-6 border-b border-white/10 pb-4">Historical Significance</h2>
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed bg-white/5 rounded-2xl p-6 border border-white/10">
                  <p>{site.historicalInfo}</p>
                </div>
              </div>
              
            </div>

            {/* Right Column (Sidebar/Funding) */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* Funding Card */}
              <div className="glass-card p-6 md:p-8 sticky top-24">
                <h3 className="text-xl font-bold text-white mb-6 font-display">Preservation Campaign</h3>
                
                <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <div className="text-3xl font-bold text-heritage-gold">₹{(site.fundingRaised).toLocaleString('en-IN')}</div>
                      <div className="text-sm text-gray-400">raised of ₹{(site.fundingGoal).toLocaleString('en-IN')} goal</div>
                    </div>
                    <div className="text-xl font-bold text-heritage-cyan">{fundingPercent}%</div>
                  </div>
                  <div className="progress-bar h-4 mb-4">
                    <div className="progress-bar-fill" style={{ width: `${fundingPercent}%` }}></div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-white font-medium mr-1">{site.supporters}</span> people have contributed
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-heritage-cyan mr-3 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300">Funds go directly to verified restoration teams and heritage trusts.</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-heritage-cyan mr-3 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300">100% transparent tracking on blockchain ledger.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link to="/adopt" className="btn-gold w-full flex justify-center py-4 text-base">
                    Donate Now
                  </Link>
                  <Link to={`/vr/${site.id}`} className="btn-outline w-full flex justify-center py-4 text-base">
                    View Digital Twin
                  </Link>
                </div>
              </div>

              {/* Status Info */}
              <div className="glass-card p-6">
                <h3 className="font-bold text-white mb-4">Current Condition</h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  {site.currentCondition}
                </p>
                <Link to="/impact" className="text-sm text-heritage-cyan hover:underline flex items-center">
                  View restoration roadmap <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
