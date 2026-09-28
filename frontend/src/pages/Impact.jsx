import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
import { Target, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default function Impact() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        const res = await api.getFundOverview();
        setData(res.data);
      } catch (err) {
        console.error('Error fetching impact data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchImpactData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-heritage-navy pt-20"><div className="spinner"></div></div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center bg-heritage-navy text-white pt-20">Failed to load impact data.</div>;

  const pieData = [
    { name: 'Under Restoration', value: data.underRestoration },
    { name: 'Completed', value: data.completedProjects },
    { name: 'At Risk', value: data.sites.length - data.underRestoration - data.completedProjects },
  ];
  const COLORS = ['#00d4ff', '#10b981', '#f59e0b'];

  return (
    <div className="pt-28 pb-20 min-h-screen bg-heritage-navy">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="section-heading mb-4 animate-slide-up">Transparent Impact Tracker</h1>
          <p className="text-gray-400 text-lg animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            We believe in 100% transparency. Track how your contributions are being allocated towards digital preservation and physical restoration.
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <div className="glass-card p-6 border-t-4 border-t-heritage-gold">
            <Target className="w-8 h-8 text-heritage-gold mb-4" />
            <p className="text-gray-400 text-sm mb-1">Total Funds Raised</p>
            <h3 className="text-3xl font-bold text-white">₹{(data.totalRaised / 100000).toFixed(2)}L</h3>
          </div>
          <div className="glass-card p-6 border-t-4 border-t-heritage-cyan">
            <TrendingUp className="w-8 h-8 text-heritage-cyan mb-4" />
            <p className="text-gray-400 text-sm mb-1">Funds Allocated</p>
            <h3 className="text-3xl font-bold text-white">₹{(data.totalAllocated / 100000).toFixed(2)}L</h3>
          </div>
          <div className="glass-card p-6 border-t-4 border-t-emerald-500">
            <CheckCircle className="w-8 h-8 text-emerald-500 mb-4" />
            <p className="text-gray-400 text-sm mb-1">Active Projects</p>
            <h3 className="text-3xl font-bold text-white">{data.underRestoration}</h3>
          </div>
          <div className="glass-card p-6 border-t-4 border-t-purple-500">
            <Users className="w-8 h-8 text-purple-500 mb-4" />
            <p className="text-gray-400 text-sm mb-1">Total Supporters</p>
            <h3 className="text-3xl font-bold text-white">{data.totalDonors}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Chart */}
          <div className="lg:col-span-2 glass-card p-6 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <h3 className="text-xl font-bold text-white mb-6 font-display">Project Status Distribution</h3>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1f3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col space-y-4 ml-64">
                {pieData.map((entry, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-gray-300 text-sm">{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Feed */}
          <div className="glass-card p-6 flex flex-col animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <h3 className="text-xl font-bold text-white mb-6 font-display">Recent Activity Timeline</h3>
            <div className="flex-grow overflow-y-auto pr-2 space-y-6 custom-scrollbar max-h-[300px]">
              {data.transactions.map((tx, i) => (
                <div key={tx.id} className="relative pl-6 border-l border-white/10 last:border-0 pb-6 last:pb-0">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-heritage-cyan shadow-[0_0_10px_rgba(0,212,255,0.5)]"></div>
                  <p className="text-sm text-gray-400 mb-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {new Date(tx.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-white font-medium mb-1">{tx.site.name}</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{tx.description}</p>
                  {tx.amount > 0 && (
                    <span className="inline-block mt-2 px-2 py-1 rounded bg-heritage-gold/20 text-heritage-gold text-xs font-mono font-bold">
                      ₹{tx.amount.toLocaleString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Need to import Users icon, missing from previous imports
import { Users } from 'lucide-react';
