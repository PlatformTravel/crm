import logoImage from 'figma:asset/da4baf9e9e75fccb7e053a2cc52f5b251f4636a9.png';

export function BTMTravelLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <img 
      src={logoImage} 
      alt="BTM Travel Logo" 
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
