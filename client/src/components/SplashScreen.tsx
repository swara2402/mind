import { useEffect, useState } from "react";
import flashBg from "@assets/generated_images/flash_screen.png";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Show for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundImage: `url(${flashBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="text-center animate-fade-in" style={{ backdropFilter: 'blur(2px)', backgroundColor: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '10px' }}>
        <div className="mb-8">
          <img
            src="/attached_assets/generated_images/Diverse_Indian_youth_support_group_23098eaa.png"
            alt="Mind App"
            className="w-32 h-32 mx-auto rounded-full shadow-lg animate-pulse"
          />
        </div>
        <h1 className="text-6xl font-bold text-white mb-4 animate-bounce">
          Mind
        </h1>
        <p className="text-xl text-white animate-fade-in-delay">
          Your Mental Wellness Companion
        </p>
        <div className="mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
