import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Heart, Brain, Users, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import selfCareImage from '@assets/generated_images/Self-care_heart_illustration_31a781e9.png';
import mindfulnessImage from '@assets/generated_images/Mindfulness_meditation_illustration_26b96358.png';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  helpful: boolean;
  image?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Managing Academic Stress',
    description: 'Practical strategies to handle exam pressure, assignment deadlines, and academic expectations in the Indian education system.',
    category: 'Academic',
    readTime: '5 min read',
    helpful: false,
    icon: BookOpen,
  },
  {
    id: '2',
    title: 'Self-Care Practices for Students',
    description: 'Simple daily habits and routines that can help you maintain emotional balance during challenging times.',
    category: 'Self-Care',
    readTime: '3 min read',
    helpful: true,
    image: selfCareImage,
    icon: Heart,
  },
  {
    id: '3',
    title: 'Mindfulness & Breathing Exercises',
    description: 'Easy-to-follow meditation and breathing techniques to reduce anxiety and improve focus.',
    category: 'Mindfulness',
    readTime: '7 min read',
    helpful: false,
    image: mindfulnessImage,
    icon: Brain,
  },
  {
    id: '4',
    title: 'Building Support Networks',
    description: 'How to connect with friends, family, and mentors while maintaining healthy boundaries.',
    category: 'Social',
    readTime: '4 min read',
    helpful: true,
    icon: Users,
  },
];

export default function ResourceCards() {
  const [resources, setResources] = useState(mockResources);

  const toggleHelpful = (id: string) => {
    setResources(prev => 
      prev.map(resource => 
        resource.id === id 
          ? { ...resource, helpful: !resource.helpful }
          : resource
      )
    );
  };

  return (
    <motion.section 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <motion.h2 
          className="text-3xl font-medium text-foreground"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring", bounce: 0.3 }}
        >
          Mental Wellness Resources
        </motion.h2>
        <motion.p 
          className="text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          Curated content designed specifically for Indian youth facing academic, 
          social, and personal challenges.
        </motion.p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {resources.map((resource, index) => {
          const IconComponent = resource.icon;
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.6 + (index * 0.1), 
                type: "spring", 
                bounce: 0.4 
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { type: "spring", stiffness: 300, damping: 15 }
              }}
            >
              <Card 
                className="hover-elevate transition-all duration-200 group h-full"
                data-testid={`card-resource-${resource.id}`}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {resource.image ? (
                        <motion.div 
                          className="w-12 h-12 rounded-lg overflow-hidden bg-primary/5 flex-shrink-0"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <img 
                            src={resource.image} 
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ) : (
                        <motion.div 
                          className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <IconComponent className="w-6 h-6 text-primary" />
                        </motion.div>
                      )}
                      <div className="min-w-0">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Badge variant="secondary" className="text-xs mb-2">
                            {resource.category}
                          </Badge>
                        </motion.div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {resource.title}
                        </CardTitle>
                      </div>
                    </div>
                  </div>
                
                <CardDescription className="text-sm leading-relaxed">
                  {resource.description}
                </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {resource.readTime}
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleHelpful(resource.id)}
                        className={resource.helpful ? 'text-primary' : ''}
                        data-testid={`button-helpful-${resource.id}`}
                      >
                        <motion.div
                          animate={resource.helpful ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.3, type: "spring", bounce: 0.5 }}
                        >
                          <Heart className={`w-4 h-4 mr-1 ${resource.helpful ? 'fill-current' : ''}`} />
                        </motion.div>
                        {resource.helpful ? 'Helpful' : 'Mark as helpful'}
                      </Button>
                    </motion.div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button 
                      className="w-full" 
                      variant="outline"
                      data-testid={`button-read-resource-${resource.id}`}
                    >
                      Read Resource
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
      >
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button variant="outline" size="lg" data-testid="button-view-all-resources">
            View All Resources
          </Button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

