import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Layers, Box, HeartHandshake, ChevronRight, Play } from 'lucide-react';

export default function Home() {
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2000&auto=format&fit=crop" 
            alt="Heritage Background" 
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-heritage-navy/80 via-heritage-navy/60 to-heritage-navy"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <span className="w-2 h-2 rounded-full bg-heritage-cyan animate-pulse"></span>
              <span className="text-sm font-medium tracking-wide uppercase text-gray-200">Preservation Hackathon Project</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-gold-light via-heritage-gold to-heritage-gold-dark">Today,</span><br />
              Preserve <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-cyan via-heritage-cyan-dark to-heritage-blue">Tomorrow</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              Step inside history through immersive virtual experiences and help preserve endangered heritage sites for future generations.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <Link to="/explore" className="btn-gold w-full sm:w-auto text-lg px-8 py-4">
                Explore Heritage
              </Link>
              <Link to="/adopt" className="btn-cyan w-full sm:w-auto text-lg px-8 py-4 group flex items-center justify-center">
                <Play className="w-5 h-5 mr-2 group-hover:text-heritage-gold transition-colors" fill="currentColor" />
                Experience VR
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce flex flex-col items-center text-gray-400">
          <span className="text-xs tracking-widest uppercase mb-2">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-heritage-gold to-transparent"></div>
        </div>
      </section>

      {/* Why HeritageVR Section */}
      <section className="py-24 relative z-10 bg-heritage-navy">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 scroll-reveal" ref={addToRefs}>
            <h2 className="section-heading mb-4">Why HeritageVR?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Bridging the gap between ancient history and modern technology to ensure our cultural legacy survives.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Feature Cards */}
            {[
              { title: "Digital Preservation", icon: Layers, desc: "Creating permanent digital twins of at-risk monuments before they deteriorate further.", color: "from-blue-500 to-cyan-500" },
              { title: "Virtual Access", icon: Box, desc: "Allowing anyone in the world to visit and experience historical sites immersively.", color: "from-purple-500 to-pink-500" },
              { title: "Education", icon: Camera, desc: "Providing interactive historical context and architectural insights for students.", color: "from-heritage-gold to-orange-500" },
              { title: "Real-World Impact", icon: HeartHandshake, desc: "Channeling funds directly to physical restoration and conservation efforts.", color: "from-emerald-500 to-teal-500" }
            ].map((feature, i) => (
              <div key={i} className="glass-card-hover p-8 scroll-reveal" ref={addToRefs} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 mb-6`}>
                  <div className="w-full h-full bg-heritage-navy rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-display">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative z-10 bg-heritage-charcoal border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="lg:w-1/2 scroll-reveal" ref={addToRefs}>
              <h2 className="section-heading mb-6">How It Works</h2>
              <p className="text-gray-300 text-lg mb-10 leading-relaxed">
                We use cutting-edge technology to digitize, reconstruct, and preserve cultural heritage while creating a sustainable funding model for physical restoration.
              </p>
              
              <div className="space-y-8">
                {[
                  { step: "01", title: "Capture", desc: "Digitally capture heritage sites using drone photography, LiDAR, 360° images and archival records." },
                  { step: "02", title: "Reconstruct", desc: "Create detailed digital twins using 3D reconstruction, NeRF / Gaussian Splatting and AI assistance." },
                  { step: "03", title: "Experience", desc: "Explore the site through WebXR, mobile or desktop browser with interactive storytelling." },
                  { step: "04", title: "Preserve", desc: "Virtual tickets, donations and Adopt-a-Stone campaigns support real-world physical preservation." }
                ].map((item, i) => (
                  <div key={i} className="flex relative">
                    {i !== 3 && <div className="absolute left-6 top-14 bottom-[-2rem] w-px bg-white/10"></div>}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border border-heritage-gold/30 bg-heritage-gold/10 flex items-center justify-center text-heritage-gold font-bold font-mono mr-6 z-10">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full scroll-reveal" ref={addToRefs} style={{ transitionDelay: '200ms' }}>
              <div className="relative rounded-2xl overflow-hidden glass-card p-2 aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-heritage-cyan-glow animate-pulse"></div>
                <img 
                  src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800" 
                  alt="3D Reconstruction Process" 
                  className="w-full h-full object-cover rounded-xl relative z-10"
                />
                
                {/* Overlay UI elements to simulate tech/VR */}
                <div className="absolute top-6 left-6 right-6 bottom-6 border border-heritage-cyan/30 rounded-lg z-20 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                  <div className="w-20 h-20 rounded-full border-2 border-heritage-cyan/50 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer hover:bg-heritage-cyan/20 transition-colors pointer-events-auto group">
                    <Play className="w-8 h-8 text-heritage-cyan group-hover:scale-110 transition-transform ml-1" />
                  </div>
                </div>
                
                <div className="absolute bottom-6 left-6 z-30 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 font-mono text-xs text-heritage-cyan">
                  PROCESSING: Point Cloud Generation... [94%]
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-heritage-gold/5"></div>
        <div className="absolute inset-0 heritage-pattern opacity-50"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center scroll-reveal" ref={addToRefs}>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Ready to make history?</h2>
            <p className="text-xl text-gray-300 mb-10">
              Join our mission. Explore ancient architectural marvels and contribute to their physical preservation through the Adopt-a-Stone program.
            </p>
            <Link to="/explore" className="btn-gold text-lg px-10 py-4 shadow-[0_0_30px_rgba(201,165,78,0.3)]">
              Start Exploring Now <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
