import { Camera, Code, Database, Globe, Lightbulb, Box } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-heritage-navy">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 text-heritage-cyan mb-6">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h1 className="section-heading mb-6 animate-slide-up">About HeritageVR</h1>
          <p className="text-xl text-gray-300 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            We don't replace laboratory conservation assessment or professional heritage restoration with AI. HeritageVR creates a digital preservation layer and helps people access, understand, and financially support heritage conservation.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="glass-card p-8 animate-slide-in-left">
            <h3 className="text-2xl font-bold text-white mb-4 font-display text-heritage-gold">Our Mission</h3>
            <p className="text-gray-300 leading-relaxed">
              To democratize access to global cultural heritage while establishing a sustainable, transparent funding mechanism for physical preservation efforts. We believe that by allowing the world to step inside history virtually, we can inspire a global movement to protect it physically.
            </p>
          </div>
          <div className="glass-card p-8 animate-slide-in-left" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <h3 className="text-2xl font-bold text-white mb-4 font-display text-heritage-cyan">Our Vision</h3>
            <p className="text-gray-300 leading-relaxed">
              A future where no historical site is lost to time, climate change, or conflict without first being meticulously preserved in the digital realm, and where digital engagement directly fuels real-world conservation.
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16 text-center animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <h2 className="section-heading mb-4">The Technology Behind the Time Machine</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-12">Built during a hackathon using modern web, 3D, and backend technologies.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "React & Vite", icon: Code, color: "text-blue-400" },
              { name: "Node & Express", icon: Code, color: "text-green-500" },
              { name: "PostgreSQL", icon: Database, color: "text-blue-500" },
              { name: "Three.js / WebXR", icon: Box, color: "text-heritage-cyan" },
              { name: "Photogrammetry", icon: Camera, color: "text-heritage-gold" },
              { name: "NeRF / AI", icon: Globe, color: "text-purple-500" },
            ].map((tech, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                <tech.icon className={`w-8 h-8 ${tech.color} mb-3`} />
                <span className="text-sm font-medium text-white text-center">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hackathon Disclaimer */}
        <div className="glass-card border-heritage-gold/30 bg-heritage-gold/5 p-8 text-center max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <h3 className="text-xl font-bold text-heritage-gold mb-3 font-display">Hackathon Prototype Notice</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            HeritageVR is a functional prototype developed for a hackathon. The 3D models and payment gateways currently operate in demo/sandbox modes. The application demonstrates the full end-to-end architectural vision from digital exploration to transparent fund tracking.
          </p>
        </div>

      </div>
    </div>
  );
}
