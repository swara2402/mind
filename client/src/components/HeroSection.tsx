import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, Shield } from 'lucide-react';
import heroImage from '@assets/generated_images/Diverse_Indian_youth_support_group_23098eaa.png';

export default function HeroSection({ onStartChat }: { onStartChat: () => void }) {
  return (
    <section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-primary/5 to-accent/10 rounded-lg overflow-hidden">
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
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-medium text-foreground">
              Your Safe Space for
              <span className="text-primary block">Mental Wellness</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A confidential AI companion designed for Indian youth. Share your thoughts, 
              find support, and discover coping strategies in a judgment-free environment.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg"
              onClick={onStartChat}
              data-testid="button-start-chat"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Anonymous Chat
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg backdrop-blur-sm"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 pt-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm">100% Confidential</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-sm">Culturally Aware</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="text-sm">24/7 Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}