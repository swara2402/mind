import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '@assets/generated_images/Diverse_Indian_youth_support_group_23098eaa.png';

export default function HeroSection({ onStartChat }: { onStartChat: () => void }) {
  return (
    <motion.section 
      className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-primary/5 to-accent/10 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60"
      />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <motion.div 
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="space-y-4">
            <motion.h1 
              className="text-4xl md:text-6xl font-medium text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              Your Safe Space for
              <motion.span 
                className="text-primary block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6, type: "spring", bounce: 0.3 }}
              >
                Mental Wellness
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            >
              A confidential AI companion designed for Indian youth. Share your thoughts, 
              find support, and discover coping strategies in a judgment-free environment.
            </motion.p>
          </div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg"
                onClick={onStartChat}
                data-testid="button-start-chat"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Anonymous Chat
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-6 text-lg backdrop-blur-sm"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-8 pt-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
          >
            {[
              { icon: Shield, text: '100% Confidential' },
              { icon: Heart, text: 'Culturally Aware' },
              { icon: MessageCircle, text: '24/7 Available' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={item.text}
                  className="flex items-center gap-2 text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 1.4 + (index * 0.1), 
                    ease: "easeOut" 
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-sm">{item.text}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}