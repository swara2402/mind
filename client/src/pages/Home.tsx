import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import ChatInterface from '@/components/ChatInterface';
import ResourceCards from '@/components/ResourceCards';
import CrisisHelp from '@/components/CrisisHelp';
import NavigationHeader from '@/components/NavigationHeader';
import ThreeBackground from '@/components/ThreeBackground';
import { pageTransitionVariants, gentleEntranceVariants, useReducedMotion } from '@/utils/motionVariants';
import { useAuth } from '@/components/AuthProvider';

// Import new components (to be created)
import MoodTracker from '@/components/MoodTracker';
import Journal from '@/components/Journal';
import MindfulnessTools from '@/components/MindfulnessTools';
import Community from '@/components/Community';

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const reduceMotion = useReducedMotion();
  const { user } = useAuth();

  const handleStartChat = () => {
    setActiveSection('chat');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'chat':
        return (
          <motion.div 
            className="container mx-auto px-4 py-8 max-w-4xl"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
          >
            <motion.div 
              className="mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.h2 
                className="text-2xl font-medium text-foreground mb-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring", bounce: 0.3 }}
              >
                Your Safe Conversation Space
              </motion.h2>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Share your thoughts freely - this conversation is completely confidential
              </motion.p>
            </motion.div>
            <ChatInterface userId={user?.id || 'anonymous'} />
          </motion.div>
        );
      
      case 'resources':
        return (
          <motion.div 
            className="container mx-auto px-4 py-8 max-w-6xl"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
          >
            <ResourceCards />
          </motion.div>
        );
      
      case 'crisis':
        return (
          <motion.div
            className="container mx-auto px-4 py-8 max-w-4xl"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
          >
            <motion.div
              className="mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.h2
                className="text-2xl font-medium text-foreground mb-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring", bounce: 0.3 }}
              >
                Crisis Support Resources
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Professional help is available when you need it most
              </motion.p>
            </motion.div>
            <CrisisHelp />
          </motion.div>
        );

      case 'mood':
        return (
          <motion.div
            className="container mx-auto px-4 py-8 max-w-4xl"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
          >
            <motion.div
              className="mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.h2
                className="text-2xl font-medium text-foreground mb-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring", bounce: 0.3 }}
              >
                Mood Tracker
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Track your daily mood and see patterns over time
              </motion.p>
            </motion.div>
            <MoodTracker userId={user?.id || 'anonymous'} />
          </motion.div>
        );

      case 'journal':
        return (
          <motion.div
            className="container mx-auto px-4 py-8 max-w-4xl"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
          >
            <motion.div
              className="mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.h2
                className="text-2xl font-medium text-foreground mb-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring", bounce: 0.3 }}
              >
                Personal Journal
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Express your thoughts and feelings in a safe space
              </motion.p>
            </motion.div>
            <Journal />
          </motion.div>
        );

      case 'mindfulness':
        return (
          <motion.div
            className="container mx-auto px-4 py-8 max-w-4xl"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
          >
            <motion.div
              className="mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.h2
                className="text-2xl font-medium text-foreground mb-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring", bounce: 0.3 }}
              >
                Mindfulness Tools
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Practice mindfulness and breathing exercises
              </motion.p>
            </motion.div>
            <MindfulnessTools />
          </motion.div>
        );

      case 'community':
        return (
          <motion.div
            className="container mx-auto px-4 py-8 max-w-4xl"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
          >
            <motion.div
              className="mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.h2
                className="text-2xl font-medium text-foreground mb-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring", bounce: 0.3 }}
              >
                Community Support
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Connect with others who understand your journey
              </motion.p>
            </motion.div>
            <Community />
          </motion.div>
        );
      
      default:
        return (
          <motion.div 
            className="space-y-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="container mx-auto px-4 pt-8">
              <HeroSection onStartChat={handleStartChat} />
            </div>
            
            <div className="container mx-auto px-4 pb-8 max-w-6xl">
              <ResourceCards />
            </div>
            
            <motion.div 
              className="container mx-auto px-4 pb-16 max-w-4xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              <motion.div 
                className="mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <motion.h2 
                  className="text-2xl font-medium text-foreground mb-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8, type: "spring", bounce: 0.3 }}
                >
                  Crisis Support Available
                </motion.h2>
                <motion.p 
                  className="text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  If you need immediate help, professional support is just a call away
                </motion.p>
              </motion.div>
              <CrisisHelp />
            </motion.div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <ThreeBackground />
      <NavigationHeader 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <div key={activeSection}>
            {renderContent()}
          </div>
        </AnimatePresence>
      </main>
      
      <motion.footer 
        className="border-t py-8 mt-16 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.p 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            Your mental health matters. This platform provides support but is not a replacement for professional medical care.
          </motion.p>
          <motion.p 
            className="text-xs text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            All conversations are confidential and not stored on our servers.
          </motion.p>
        </div>
      </motion.footer>
    </div>
  );
}