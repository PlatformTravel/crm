import logoImage from 'figma:asset/267e639331ae5b3281b1b8f9c2903af5458190f3.png';

export function BTMTravelLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className="relative inline-block group">
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-blue-400/30 to-orange-500/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      
      {/* Glass container */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-white/40 shadow-2xl overflow-hidden">
        {/* Shine effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-50" />
        
        {/* Glass reflection effect */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl" />
        
        {/* Animated shine stripe */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-1000" />
        </div>
        
        {/* Logo image */}
        <div className="relative">
          <img 
            src={logoImage} 
            alt="BTM Travel Logo" 
            className={className}
            style={{ objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
          />
        </div>
      </div>
      
      {/* Bottom glow reflection */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-gradient-to-b from-orange-300/20 to-transparent blur-lg rounded-full" />
    </div>
  );
}
