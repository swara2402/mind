import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cardEntranceVariants, gentleEntranceVariants, createButtonVariants, useReducedMotion } from '@/utils/motionVariants';
import { PenTool, Lightbulb } from 'lucide-react';

interface JournalEntry {
  id: number;
  date: string;
  title: string;
  content: string;
  prompt?: string;
}

interface JournalProps {
  userId: string;
}

const journalPrompts = [
  "What made you smile today?",
  "What's something you're grateful for?",
  "Describe a challenge you faced and how you handled it.",
  "What are you looking forward to tomorrow?",
  "How have you grown in the past week?",
  "What's a memory that brings you comfort?",
  "What would you tell your younger self?",
  "What's something new you learned today?",
  "How do you want to feel tomorrow?",
  "What's a small win from today?"
];

export default function Journal({ userId }: JournalProps) {
  return (
    <div className="min-h-screen" style={{ backgroundImage: `url('/attached_assets/generated_images/Diverse_Indian_youth_support_group_23098eaa.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <InnerJournal userId={userId} />
    </div>
  );
}

function InnerJournal({ userId }: JournalProps) {
  const reduceMotion = useReducedMotion();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);

  // Load journal entries on component mount only if user is authenticated
  useEffect(() => {
    if (userId && userId !== 'anonymous') {
      loadJournalEntries();
    }
  }, []);

  const loadJournalEntries = async () => {
    try {
      const response = await fetch(`/api/journals/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setJournalEntries(data);
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const submitEntry = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/journals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          title: title.trim() || 'Untitled Entry',
          content: content.trim(),
          prompt: selectedPrompt,
        }),
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        setSelectedPrompt('');
        await loadJournalEntries();
      }
    } catch (error) {
      console.error('Error submitting journal entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setTitle(prompt);
    setShowPrompts(false);
  };

  // Show authentication required message for anonymous users
  if (userId === 'anonymous') {
    return (
      <motion.div
        variants={cardEntranceVariants}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="w-5 h-5" />
              Personal Journal
            </CardTitle>
            <CardDescription>
              Express your thoughts and feelings in a safe space
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-medium mb-2">Sign in to start journaling</h3>
              <p className="text-muted-foreground mb-4">
                Create an account to start writing in your personal journal and track your thoughts over time.
              </p>
              <Button>
                Sign In to Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardEntranceVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Journal Entry Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            Write Your Thoughts
          </CardTitle>
          <CardDescription>
            Express yourself freely. Your journal is a safe, private space.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your entry a title..."
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your thoughts</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind today?"
              rows={8}
            />
          </div>

          {/* Selected Prompt */}
          {selectedPrompt && (
            <motion.div
              className="p-3 bg-primary/10 rounded-lg"
              variants={gentleEntranceVariants}
              initial="initial"
              animate="animate"
            >
              <div className="flex items-center gap-2 text-sm text-primary">
                <Lightbulb className="w-4 h-4" />
                Prompt: {selectedPrompt}
              </div>
            </motion.div>
          )}

          {/* Prompt Button */}
          <motion.div {...createButtonVariants(reduceMotion)}>
            <Button
              variant="outline"
              onClick={() => setShowPrompts(!showPrompts)}
              className="w-full"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showPrompts ? 'Hide Prompts' : 'Need Inspiration?'}
            </Button>
          </motion.div>

          {/* Prompts */}
          {showPrompts && (
            <motion.div
              className="space-y-2"
              variants={gentleEntranceVariants}
              initial="initial"
              animate="animate"
            >
              <h4 className="text-sm font-medium">Choose a prompt to get started:</h4>
              <div className="grid gap-2">
                {journalPrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    onClick={() => selectPrompt(prompt)}
                    className="p-3 text-left bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-primary" />
                      <span className="text-sm">{prompt}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div {...createButtonVariants(reduceMotion)}>
            <Button
              onClick={submitEntry}
              disabled={!content.trim() || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Saving...' : 'Save Entry'}
            </Button>
          </motion.div>
        </CardContent>
      </Card>

      {/* Journal Entries */}
      {journalEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Journal Entries</CardTitle>
            <CardDescription>
              Revisit your thoughts and track your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {journalEntries.slice(-10).reverse().map((entry) => (
                <motion.div
                  key={entry.id}
                  className="p-4 border rounded-lg"
                  variants={gentleEntranceVariants}
                  initial="initial"
                  animate="animate"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{entry.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    {entry.prompt && (
                      <Badge variant="secondary" className="text-xs">
                        Prompt
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
