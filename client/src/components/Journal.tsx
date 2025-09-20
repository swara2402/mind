import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion } from 'framer-motion';
import { cardEntranceVariants, gentleEntranceVariants, createButtonVariants, useReducedMotion } from '@/utils/motionVariants';
import { PenTool, Lightbulb, Trash2, Edit, Share, Search, Heart, Calendar, MoreHorizontal } from 'lucide-react';

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
  { text: "What made you smile today?", category: "Positive", difficulty: "Easy" },
  { text: "What's something you're grateful for?", category: "Gratitude", difficulty: "Easy" },
  { text: "Describe a challenge you faced and how you handled it.", category: "Growth", difficulty: "Medium" },
  { text: "What are you looking forward to tomorrow?", category: "Hope", difficulty: "Easy" },
  { text: "How have you grown in the past week?", category: "Reflection", difficulty: "Medium" },
  { text: "What's a memory that brings you comfort?", category: "Comfort", difficulty: "Easy" },
  { text: "What would you tell your younger self?", category: "Wisdom", difficulty: "Hard" },
  { text: "What's something new you learned today?", category: "Learning", difficulty: "Easy" },
  { text: "How do you want to feel tomorrow?", category: "Intention", difficulty: "Medium" },
  { text: "What's a small win from today?", category: "Achievement", difficulty: "Easy" }
];

export default function Journal({ userId }: JournalProps) {
  return (
    <TooltipProvider>
      <div className="min-h-screen" style={{ backgroundImage: `url('/attached_assets/generated_images/Diverse_Indian_youth_support_group_23098eaa.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <InnerJournal userId={userId} />
      </div>
    </TooltipProvider>
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
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Load journal entries on component mount
  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/journals/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setJournalEntries(data);
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setIsLoading(false);
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
          userId: 'anonymous', // In real app, use actual user ID
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

  const deleteEntry = async (entryId: number) => {
    try {
      const response = await fetch(`/api/journals/${entryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadJournalEntries();
      }
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  };

  const toggleFavorite = (entryId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(entryId)) {
        newFavorites.delete(entryId);
      } else {
        newFavorites.add(entryId);
      }
      return newFavorites;
    });
  };

  const selectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setTitle(prompt);
    setShowPrompts(false);
  };

  const filteredEntries = journalEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteEntries = journalEntries.filter(entry => favorites.has(entry.id));

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
            <Popover open={showPrompts} onOpenChange={setShowPrompts}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Need Inspiration?
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Choose a prompt to get started:</h4>
                  <div className="grid gap-2 max-h-60 overflow-y-auto">
                    {journalPrompts.map((prompt, index) => (
                      <motion.button
                        key={index}
                        onClick={() => selectPrompt(prompt.text)}
                        className="p-3 text-left bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-sm">{prompt.text}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {prompt.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {prompt.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </motion.div>

          {/* Submit Button */}
          <motion.div {...createButtonVariants(reduceMotion)}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={submitEntry}
                  disabled={!content.trim() || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Saving...' : 'Save Entry'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save your journal entry securely</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        </CardContent>
      </Card>

      {/* Journal Entries Tabs */}
      {journalEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Journal Entries</CardTitle>
            <CardDescription>
              Revisit your thoughts and track your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  All Entries
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="search" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2 mb-2" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {journalEntries.slice(-10).reverse().map((entry) => (
                      <JournalEntryCard
                        key={entry.id}
                        entry={entry}
                        onDelete={deleteEntry}
                        onToggleFavorite={toggleFavorite}
                        isFavorite={favorites.has(entry.id)}
                        reduceMotion={reduceMotion}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="favorites" className="space-y-4 mt-4">
                {favoriteEntries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No favorite entries yet</p>
                    <p className="text-sm">Star entries you want to revisit</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {favoriteEntries.map((entry) => (
                      <JournalEntryCard
                        key={entry.id}
                        entry={entry}
                        onDelete={deleteEntry}
                        onToggleFavorite={toggleFavorite}
                        isFavorite={true}
                        reduceMotion={reduceMotion}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="search" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Search your journal entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                {filteredEntries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No entries found</p>
                    <p className="text-sm">Try adjusting your search terms</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEntries.map((entry) => (
                      <JournalEntryCard
                        key={entry.id}
                        entry={entry}
                        onDelete={deleteEntry}
                        onToggleFavorite={toggleFavorite}
                        isFavorite={favorites.has(entry.id)}
                        reduceMotion={reduceMotion}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

function JournalEntryCard({
  entry,
  onDelete,
  onToggleFavorite,
  isFavorite,
  reduceMotion
}: {
  entry: JournalEntry;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  isFavorite: boolean;
  reduceMotion: boolean;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <motion.div
          className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          variants={gentleEntranceVariants}
          initial="initial"
          animate="animate"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{entry.title}</h4>
                {isFavorite && <Heart className="w-4 h-4 text-red-500 fill-current" />}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="w-3 h-3" />
                {new Date(entry.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {entry.prompt && (
                <Badge variant="secondary" className="text-xs">
                  Prompt
                </Badge>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(entry.id);
                    }}
                  >
                    <Heart className={`w-3 h-3 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {entry.content.length > 200 ? `${entry.content.substring(0, 200)}...` : entry.content}
          </p>
        </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => onToggleFavorite(entry.id)}>
          <Heart className="w-4 h-4 mr-2" />
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </ContextMenuItem>
        <ContextMenuItem>
          <Edit className="w-4 h-4 mr-2" />
          Edit Entry
        </ContextMenuItem>
        <ContextMenuItem>
          <Share className="w-4 h-4 mr-2" />
          Share Entry
        </ContextMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <ContextMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Entry
            </ContextMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this journal entry? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(entry.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ContextMenuContent>
    </ContextMenu>
  );
}
