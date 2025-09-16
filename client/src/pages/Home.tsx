import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import ChatInterface from '@/components/ChatInterface';
import ResourceCards from '@/components/ResourceCards';
import CrisisHelp from '@/components/CrisisHelp';
import NavigationHeader from '@/components/NavigationHeader';

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>('home');

  const handleStartChat = () => {
    setActiveSection('chat');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'chat':
        return (
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-medium text-foreground mb-2">
                Your Safe Conversation Space
              </h2>
              <p className="text-muted-foreground">
                Share your thoughts freely - this conversation is completely confidential
              </p>
            </div>
            <ChatInterface />
          </div>
        );
      
      case 'resources':
        return (
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <ResourceCards />
          </div>
        );
      
      case 'crisis':
        return (
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-medium text-foreground mb-2">
                Crisis Support Resources
              </h2>
              <p className="text-muted-foreground">
                Professional help is available when you need it most
              </p>
            </div>
            <CrisisHelp />
          </div>
        );
      
      default:
        return (
          <div className="space-y-16">
            <div className="container mx-auto px-4 pt-8">
              <HeroSection onStartChat={handleStartChat} />
            </div>
            
            <div className="container mx-auto px-4 pb-8 max-w-6xl">
              <ResourceCards />
            </div>
            
            <div className="container mx-auto px-4 pb-16 max-w-4xl">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-medium text-foreground mb-2">
                  Crisis Support Available
                </h2>
                <p className="text-muted-foreground">
                  If you need immediate help, professional support is just a call away
                </p>
              </div>
              <CrisisHelp />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main>
        {renderContent()}
      </main>
      
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Your mental health matters. This platform provides support but is not a replacement for professional medical care.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            All conversations are confidential and not stored on our servers.
          </p>
        </div>
      </footer>
    </div>
  );
}