import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '@assets/generated_images/Diverse_Indian_youth_support_group_23098eaa.png';

export default function HeroSection({ onStartChat }: { onStartChat: () => void }) {
  return (
    <motion.section
      id="hero-section"
      className="relative min-h-screen flex items-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Background Image with Gradient Overlay */}
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -2,
        }}
      />

      {/* Hero Content Container with Glassmorphism */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <motion.div
          className="text-center space-y-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 shadow-2xl"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          {/* Hero Text */}
          <div className="space-y-6">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white leading-tight"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              Your Safe Space for
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 block mt-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8, type: "spring", bounce: 0.3 }}
              >
                Mental Wellness
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
            >
              A confidential AI companion designed for Indian youth. Share your thoughts,
              find support, and discover coping strategies in a judgment-free environment.
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                size="lg"
                className="px-10 py-6 text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl rounded-full border-0 transition-all duration-300"
                onClick={onStartChat}
                data-testid="button-start-chat"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Start Anonymous Chat
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-6 text-xl font-semibold bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 shadow-xl rounded-full transition-all duration-300"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
          >
            {[
              { icon: Shield, text: '100% Confidential', color: 'text-green-400' },
              { icon: Heart, text: 'Culturally Aware', color: 'text-pink-400' },
              { icon: MessageCircle, text: '24/7 Available', color: 'text-blue-400' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.text}
                  className="flex items-center gap-3 text-white/90 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 1.6 + (index * 0.1),
                    ease: "easeOut"
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: 'rgba(255,255,255,0.15)'
                  }}
                >
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements for Visual Interest */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-32 right-16 w-16 h-16 bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
        animate={{
          y: [0, 15, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </motion.section>
  );
}
