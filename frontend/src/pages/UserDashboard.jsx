import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Heart, Landmark, CheckCircle, ArrowRight, User } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const paymentSuccess = location.state?.paymentSuccess;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getUserDashboard();
        setData(res.data);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="spinner"></div></div>;
  if (!data) return <div className="min-h-screen flex justify-center items-center text-white">Error loading dashboard.</div>;

  return (
    <div className="pt-28 pb-20 min-h-screen bg-heritage-navy">
      <div className="container mx-auto px-4 md:px-6">
        
        {paymentSuccess && (
          <div className="mb-8 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl flex items-center text-emerald-400 animate-slide-in-left">
            <CheckCircle className="w-6 h-6 mr-3" />
            <div>
              <p className="font-bold">Payment Successful!</p>
              <p className="text-sm">Thank you for your contribution to heritage preservation.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="text-gray-400">View your preservation impact and adopted stones.</p>
          </div>
          <Link to="/explore" className="btn-gold py-2 px-5 text-sm">
            Support Another Site
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="glass-card p-6 border-l-4 border-l-heritage-gold">
            <p className="text-gray-400 text-sm mb-1">Total Contributed</p>
            <h3 className="text-2xl font-bold text-white">₹{data.stats.totalDonated.toLocaleString()}</h3>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-heritage-cyan">
            <p className="text-gray-400 text-sm mb-1">Sites Supported</p>
            <h3 className="text-2xl font-bold text-white">{data.stats.sitesSupported}</h3>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-purple-500">
            <p className="text-gray-400 text-sm mb-1">Components Adopted</p>
            <h3 className="text-2xl font-bold text-white">{data.stats.componentsAdopted}</h3>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-emerald-500">
            <p className="text-gray-400 text-sm mb-1">Donation Records</p>
            <h3 className="text-2xl font-bold text-white">{data.stats.donationsCount}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* My Adoptions */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6 font-display flex items-center">
              <Heart className="w-5 h-5 text-heritage-gold mr-2" /> My Adopted Stones
            </h2>
            
            {data.adoptions.length === 0 ? (
              <div className="text-center py-10 bg-white/5 rounded-xl border border-white/10">
                <p className="text-gray-400 mb-4">You haven't adopted any specific architectural components yet.</p>
                <Link to="/adopt" className="text-heritage-cyan hover:underline">Explore the Adopt-a-Stone program</Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {data.adoptions.map(adoption => (
                  <div key={adoption.id} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-heritage-gold">{adoption.component.name}</h4>
                      <span className="text-xs bg-heritage-cyan/20 text-heritage-cyan px-2 py-1 rounded font-mono">₹{adoption.amount.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-1 flex items-center">
                      <Landmark className="w-3 h-3 mr-1 text-gray-500" /> {adoption.site.name}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(adoption.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Donations */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6 font-display flex items-center">
              <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" /> Transaction History
            </h2>
            
            {data.donations.length === 0 ? (
              <div className="text-center py-10 text-gray-400">No donation history found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="text-xs text-gray-500 uppercase bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Date</th>
                      <th className="px-4 py-3">Site</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3 rounded-tr-lg">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.donations.map((tx) => (
                      <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">{new Date(tx.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-medium text-white line-clamp-1 max-w-[150px]">{tx.site.name}</td>
                        <td className="px-4 py-3 capitalize">{tx.donationType}</td>
                        <td className="px-4 py-3 text-heritage-cyan">₹{tx.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
