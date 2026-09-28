import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Heart, Search, ChevronRight, Shield, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function AdoptAStone() {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [donationAmount, setDonationAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await api.getSites();
        setSites(res.data);
        
        // If coming from a specific site, pre-select it
        const searchParams = new URLSearchParams(location.search);
        const siteIdParam = searchParams.get('site');
        
        if (siteIdParam) {
          const site = res.data.find(s => s.id === siteIdParam);
          if (site) {
            setSelectedSite(site);
            fetchComponents(site.id);
          }
        } else if (res.data.length > 0) {
          setSelectedSite(res.data[0]);
          fetchComponents(res.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching sites:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSites();
  }, [location]);

  const fetchComponents = async (siteId) => {
    try {
      const res = await api.getComponents(siteId);
      setComponents(res.data);
      setSelectedComponent(null);
    } catch (err) {
      console.error('Error fetching components:', err);
    }
  };

  const handleSiteChange = (e) => {
    const site = sites.find(s => s.id === e.target.value);
    setSelectedSite(site);
    if (site) fetchComponents(site.id);
  };

  const handleComponentSelect = (component) => {
    setSelectedComponent(component);
    // Auto-suggest an amount based on remaining need, up to 1000
    const remaining = component.restorationCost - component.amountFunded;
    const suggested = Math.min(remaining > 0 ? remaining : 100, 1000);
    setDonationAmount(suggested);
    setCustomAmount('');
  };

  const handlePayment = async () => {
    if (!user) {
      // Save state and redirect to login
      localStorage.setItem('redirectAfterLogin', '/adopt');
      navigate('/login');
      return;
    }

    const amountToPay = customAmount ? parseFloat(customAmount) : donationAmount;
    if (!amountToPay || amountToPay < 1) return;

    try {
      setPaymentLoading(true);
      
      const orderRes = await api.createOrder({
        siteId: selectedSite.id,
        componentId: selectedComponent?.id,
        amount: amountToPay,
        donationType: selectedComponent ? 'adoption' : 'general',
        message: message || undefined,
        anonymous,
      });

      const { orderId, amount, currency, donationId, keyId, demoMode } = orderRes.data;

      if (demoMode) {
        // Trigger demo payment
        await api.demoPayment({ donationId });
        navigate('/dashboard', { state: { paymentSuccess: true } });
        return;
      }

      // Real Razorpay integration
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'HeritageVR',
        description: selectedComponent ? `Adopting ${selectedComponent.name}` : `Donation for ${selectedSite.name}`,
        image: '/vite.svg',
        order_id: orderId,
        handler: async function (response) {
          try {
            await api.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              donationId: donationId,
            });
            navigate('/dashboard', { state: { paymentSuccess: true } });
          } catch (err) {
            console.error('Payment verification failed:', err);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#c9a54e',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert('Payment failed. Please try again.');
      });
      rzp.open();
      
    } catch (err) {
      console.error('Payment initiation failed:', err);
      alert('Failed to initiate payment. Please try again later.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const getConditionIcon = (condition) => {
    switch (condition) {
      case 'Critical': return <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />;
      case 'Deteriorating': return <Shield className="w-4 h-4 text-amber-500 mr-2" />;
      case 'Fair': return <ShieldCheck className="w-4 h-4 text-blue-500 mr-2" />;
      default: return <ShieldCheck className="w-4 h-4 text-emerald-500 mr-2" />;
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-heritage-navy">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-heritage-gold/20 text-heritage-gold mb-6">
            <Heart className="w-8 h-8" fill="currentColor" />
          </div>
          <h1 className="section-heading mb-4">Adopt a Stone</h1>
          <p className="text-gray-400 text-lg">
            Directly fund the physical restoration of specific architectural components. Your contribution preserves history stone by stone.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center h-64 items-center"><div className="spinner"></div></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Selection */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Site Selection */}
              <div className="glass-card p-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Heritage Site</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select 
                    className="input-field pl-12 appearance-none cursor-pointer text-lg font-display"
                    value={selectedSite?.id || ''}
                    onChange={handleSiteChange}
                  >
                    {sites.map(site => (
                      <option key={site.id} value={site.id}>{site.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Interactive Component Map (Simplified List View for Demo) */}
              <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white font-display">Select a Component</h3>
                  <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                    {components.length} components need support
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {components.length === 0 ? (
                    <div className="col-span-2 text-center text-gray-500 py-8">No components available for this site yet.</div>
                  ) : (
                    components.map(comp => {
                      const percent = Math.min(100, (comp.amountFunded / comp.restorationCost) * 100).toFixed(0);
                      const isSelected = selectedComponent?.id === comp.id;
                      
                      return (
                        <div 
                          key={comp.id}
                          onClick={() => handleComponentSelect(comp)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                            isSelected 
                              ? 'bg-heritage-gold/10 border-heritage-gold shadow-[0_0_15px_rgba(201,165,78,0.2)]' 
                              : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className={`font-bold ${isSelected ? 'text-heritage-gold' : 'text-white'}`}>{comp.name}</h4>
                            <span className="text-xs uppercase tracking-wider text-gray-500 font-mono">{comp.type}</span>
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-400 mb-4">
                            {getConditionIcon(comp.condition)} {comp.condition}
                          </div>
                          
                          <div className="progress-bar h-1.5 mb-2">
                            <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
                          </div>
                          
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">₹{comp.amountFunded.toLocaleString()} raised</span>
                            <span className="text-heritage-cyan font-medium">{percent}%</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Donation Form */}
            <div className="lg:col-span-5">
              <div className="glass-card p-6 md:p-8 sticky top-24">
                <h3 className="text-2xl font-display font-bold text-white mb-6 border-b border-white/10 pb-4">
                  Contribution Details
                </h3>

                {selectedComponent ? (
                  <div className="mb-6 p-4 rounded-xl bg-heritage-navy/50 border border-heritage-cyan/20">
                    <h4 className="text-sm text-gray-400 mb-1">Adopting Component:</h4>
                    <p className="text-lg font-bold text-heritage-cyan mb-2">{selectedComponent.name}</p>
                    <p className="text-sm text-gray-300 mb-4">{selectedComponent.description}</p>
                    
                    <div className="flex justify-between text-sm bg-black/30 p-3 rounded-lg border border-white/5">
                      <span className="text-gray-400">Target: ₹{selectedComponent.restorationCost.toLocaleString()}</span>
                      <span className="text-heritage-gold font-medium">Remaining: ₹{Math.max(0, selectedComponent.restorationCost - selectedComponent.amountFunded).toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-gray-400 mb-2">No component selected.</p>
                    <p className="text-sm text-gray-500">Your donation will go to the general preservation fund for {selectedSite?.name}.</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Select Amount (INR)</label>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {[500, 1000, 2500, 5000, 10000].map(amount => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => { setDonationAmount(amount); setCustomAmount(''); }}
                          className={`py-2 px-1 rounded-lg text-sm font-medium transition-colors border ${
                            donationAmount === amount && !customAmount
                              ? 'bg-heritage-gold text-heritage-navy border-heritage-gold'
                              : 'bg-white/5 text-gray-300 border-white/10 hover:border-heritage-gold/50 hover:text-heritage-gold'
                          }`}
                        >
                          ₹{amount.toLocaleString()}
                        </button>
                      ))}
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                        <input
                          type="number"
                          placeholder="Custom"
                          value={customAmount}
                          onChange={(e) => { setCustomAmount(e.target.value); setDonationAmount(0); }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-7 pr-2 text-sm text-white focus:outline-none focus:border-heritage-gold transition-colors h-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Message of Support (Optional)</label>
                    <textarea 
                      rows="3" 
                      className="input-field resize-none text-sm"
                      placeholder="Leave a message for the preservation team..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="anonymous" 
                      className="w-4 h-4 rounded border-gray-600 text-heritage-cyan focus:ring-heritage-cyan/50 bg-white/5"
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                    />
                    <label htmlFor="anonymous" className="ml-2 text-sm text-gray-400 cursor-pointer">
                      Make my donation anonymous
                    </label>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    {!user && (
                      <div className="mb-4 text-xs text-amber-400 bg-amber-400/10 p-3 rounded-lg flex items-start">
                        <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                        <span>You will be prompted to log in or create an account before completing your payment to track your contribution.</span>
                      </div>
                    )}
                    
                    <button 
                      onClick={handlePayment}
                      disabled={paymentLoading || (!customAmount && !donationAmount)}
                      className={`w-full py-4 rounded-xl font-bold flex items-center justify-center text-lg transition-all ${
                        paymentLoading || (!customAmount && !donationAmount)
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'btn-gold shadow-lg'
                      }`}
                    >
                      {paymentLoading ? (
                        <><div className="spinner !w-5 !h-5 !border-2 mr-3 border-t-heritage-navy"></div> Processing...</>
                      ) : (
                        <>Proceed to Pay ₹{(customAmount ? parseFloat(customAmount) : donationAmount).toLocaleString()} <ChevronRight className="ml-2 w-5 h-5" /></>
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Secure payment powered by Razorpay
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
