import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="circuit-bg py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
        <div className="hero-title text-6xl md:text-8xl font-display font-bold mb-6 text-white animate-pulse-slow">DIT</div>
        <div className="tricolor-bar h-1 w-32 mb-6"></div>
        <h2 className="text-xl md:text-2xl font-display text-light-text mb-2">Das InfoSec Toolkit</h2>
        <p className="text-lg text-muted-text max-w-2xl mb-8">Essential Cybersecurity toolkit for your digital safety.</p>
        <p className="text-sm text-muted-text mb-8">Powered by Das InfoSec | Developed by Sovan Das</p>
        <a href="#tools" className="glow-button bg-dark-card hover:bg-gray-800 text-cyber-blue font-medium py-3 px-8 rounded-md border border-[rgba(0,255,255,0.3)] transition-all">
          Explore Tools
        </a>
      </div>
      
      {/* Abstract cybersecurity pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 L100 50 M50 0 L50 100" stroke="#00FFFF" strokeWidth="0.5" fill="none"></path>
              <circle cx="50" cy="50" r="3" fill="#138808" opacity="0.5"></circle>
              <circle cx="0" cy="50" r="2" fill="#FF9933" opacity="0.5"></circle>
              <circle cx="100" cy="50" r="2" fill="#FF9933" opacity="0.5"></circle>
              <circle cx="50" cy="0" r="2" fill="#FF9933" opacity="0.5"></circle>
              <circle cx="50" cy="100" r="2" fill="#FF9933" opacity="0.5"></circle>
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit)"></rect>
        </svg>
      </div>
    </section>
  );
}
