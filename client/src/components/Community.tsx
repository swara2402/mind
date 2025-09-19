import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cardEntranceVariants, gentleEntranceVariants, createButtonVariants, useReducedMotion } from '@/utils/motionVariants';
import { Users, Heart, MessageCircle, Share2 } from 'lucide-react';

interface CommunityPost {
  id: number;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  tags: string[];
}

const samplePosts: CommunityPost[] = [
  {
    id: 1,
    author: "Anonymous",
    content: "Today was tough, but I remembered to practice gratitude. Even on bad days, there's always something to be thankful for. How do you stay positive?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 12,
    comments: 5,
    tags: ["gratitude", "positivity"]
  },
  {
    id: 2,
    author: "Anonymous",
    content: "Just finished my first meditation session. It was harder than I thought to quiet my mind, but I feel more centered now. Anyone have tips for beginners?",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likes: 8,
    comments: 3,
    tags: ["meditation", "mindfulness", "beginners"]
  },
  {
    id: 3,
    author: "Anonymous",
    content: "Remember: your feelings are valid. It's okay to not be okay sometimes. You're not alone in this journey.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    likes: 24,
    comments: 7,
    tags: ["support", "validation", "community"]
  }
];

export default function Community() {
  const reduceMotion = useReducedMotion();
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<CommunityPost[]>(samplePosts);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPost = async () => {
    if (!newPost.trim()) return;

    setIsSubmitting(true);
    // In a real app, this would send to the server
    const post: CommunityPost = {
      id: posts.length + 1,
      author: "Anonymous",
      content: newPost.trim(),
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      tags: [] // Could extract hashtags from content
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setIsSubmitting(false);
  };

  const likePost = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      variants={cardEntranceVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Community Guidelines */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Safe Community Space
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p>• Share your experiences and support others</p>
            <p>• Be kind and respectful to everyone</p>
            <p>• Your posts are anonymous and confidential</p>
            <p>• If you're in crisis, please contact professional help</p>
          </div>
        </CardContent>
      </Card>

      {/* New Post */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Thoughts</CardTitle>
          <CardDescription>
            Connect with others who understand your journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind? How are you feeling today?"
            rows={4}
          />
          <motion.div {...createButtonVariants(reduceMotion)}>
            <Button
              onClick={submitPost}
              disabled={!newPost.trim() || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Sharing...' : 'Share Anonymously'}
            </Button>
          </motion.div>
        </CardContent>
      </Card>

      {/* Community Posts */}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            variants={gentleEntranceVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {/* Post Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{post.author}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimeAgo(post.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-sm leading-relaxed">{post.content}</p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <motion.button
                      onClick={() => likePost(post.id)}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </motion.button>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Crisis Resources Reminder */}
      <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
              Need Immediate Support?
            </h3>
            <p className="text-sm text-orange-600 dark:text-orange-400 mb-4">
              If you're experiencing a mental health crisis, professional help is available 24/7.
            </p>
            <Button variant="outline" className="border-orange-300 hover:bg-orange-50 dark:border-orange-700">
              View Crisis Resources
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
