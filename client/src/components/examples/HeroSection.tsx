import HeroSection from '../HeroSection';

export default function HeroSectionExample() {
  const handleStartChat = () => {
    console.log('Start chat clicked');
  };

  return <HeroSection onStartChat={handleStartChat} />;
}