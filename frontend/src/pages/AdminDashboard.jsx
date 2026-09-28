import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LayoutDashboard, Users, Landmark, CreditCard, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.getAdminDashboard();
        setData(res.data);
      } catch (err) {
        setError('Failed to load admin dashboard. Ensure you have admin privileges.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="spinner"></div></div>;
  if (error) return <div className="min-h-screen flex justify-center items-center text-red-400"><AlertCircle className="w-6 h-6 mr-2" /> {error}</div>;

  return (
    <div className="pt-28 pb-20 min-h-screen bg-heritage-navy">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Control Panel</h1>
            <p className="text-gray-400">Manage heritage sites, monitor funds, and oversee platform operations.</p>
          </div>
          <div className="bg-heritage-gold/20 text-heritage-gold px-4 py-2 rounded-lg font-mono text-sm border border-heritage-gold/30">
            Role: SUPER_ADMIN
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-8 bg-black/30 p-2 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'bg-heritage-cyan text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard className="w-4 h-4 inline mr-2" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('sites')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'sites' ? 'bg-heritage-cyan text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Landmark className="w-4 h-4 inline mr-2" /> Manage Sites
          </button>
          <button 
            onClick={() => setActiveTab('donations')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'donations' ? 'bg-heritage-cyan text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <CreditCard className="w-4 h-4 inline mr-2" /> Donations
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-6 bg-gradient-to-br from-white/5 to-heritage-gold/10">
                <p className="text-gray-400 text-sm mb-1">Total Funds Raised</p>
                <h3 className="text-3xl font-bold text-white mb-2">₹{(data.stats.totalRaised / 100000).toFixed(2)}L</h3>
                <p className="text-xs text-heritage-gold">Target: ₹{(data.stats.totalGoal / 100000).toFixed(2)}L</p>
              </div>
              <div className="glass-card p-6">
                <p className="text-gray-400 text-sm mb-1">Total Donors</p>
                <h3 className="text-3xl font-bold text-white mb-2">{data.stats.uniqueDonors}</h3>
                <p className="text-xs text-heritage-cyan">{data.stats.successfulDonations} successful transactions</p>
              </div>
              <div className="glass-card p-6">
                <p className="text-gray-400 text-sm mb-1">Heritage Sites</p>
                <h3 className="text-3xl font-bold text-white mb-2">{data.stats.totalSites}</h3>
                <p className="text-xs text-gray-500">Active monitoring</p>
              </div>
              <div className="glass-card p-6">
                <p className="text-gray-400 text-sm mb-1">Registered Users</p>
                <h3 className="text-3xl font-bold text-white mb-2">{data.stats.totalUsers}</h3>
                <p className="text-xs text-gray-500">Platform members</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Site Status Overview */}
              <div className="glass-card p-6 lg:col-span-1">
                <h3 className="text-lg font-bold text-white mb-6 font-display">Preservation Status</h3>
                <div className="space-y-4">
                  {Object.entries(data.statusCounts).map(([status, count]) => {
                    let color = 'bg-gray-500';
                    if (status === 'Critical') color = 'bg-red-500';
                    if (status === 'At Risk') color = 'bg-amber-500';
                    if (status === 'Under Restoration') color = 'bg-blue-500';
                    if (status === 'Restored') color = 'bg-emerald-500';
                    
                    const percent = (count / data.stats.totalSites) * 100;
                    
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{status}</span>
                          <span className="text-white font-medium">{count}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className={`${color} h-2 rounded-full`} style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Donations */}
              <div className="glass-card p-6 lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white font-display">Recent Donations</h3>
                  <button className="text-sm text-heritage-cyan hover:underline" onClick={() => setActiveTab('donations')}>View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead className="text-xs text-gray-500 uppercase border-b border-white/10">
                      <tr>
                        <th className="pb-3">User</th>
                        <th className="pb-3">Site</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {data.recentDonations.map((tx) => (
                        <tr key={tx.id} className="hover:bg-white/5">
                          <td className="py-3 font-medium text-white">{tx.anonymous ? 'Anonymous' : tx.user.name}</td>
                          <td className="py-3 line-clamp-1 max-w-[150px]">{tx.site.name}</td>
                          <td className="py-3 text-heritage-gold font-mono">₹{tx.amount.toLocaleString()}</td>
                          <td className="py-3 text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sites' && (
          <div className="glass-card p-6 animate-fade-in text-center py-20 text-gray-400">
            <Landmark className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>Site Management UI to be implemented.</p>
            <p className="text-sm mt-2">API endpoints exist for CRUD operations.</p>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="glass-card p-6 animate-fade-in text-center py-20 text-gray-400">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>Full Donation Ledger to be implemented.</p>
            <p className="text-sm mt-2">API endpoints exist for fetching and filtering all donations.</p>
          </div>
        )}

      </div>
    </div>
  );
}
