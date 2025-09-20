import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cardEntranceVariants, gentleEntranceVariants, createButtonVariants, useReducedMotion } from '@/utils/motionVariants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MoodEntry {
  id: number;
  date: string;
  moodLevel: number;
  notes: string;
}

interface MoodTrackerProps {
  userId: string;
}

const moodEmojis = [
  { level: 1, emoji: '😢', label: 'Very Sad' },
  { level: 2, emoji: '😔', label: 'Sad' },
  { level: 3, emoji: '😐', label: 'Neutral' },
  { level: 4, emoji: '🙂', label: 'Good' },
  { level: 5, emoji: '😊', label: 'Very Happy' },
];

export default function MoodTracker({ userId }: MoodTrackerProps) {
  return (
    <div className="min-h-screen" style={{ backgroundImage: `url('/attached_assets/generated_images/Diverse_Indian_youth_support_group_23098eaa.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <InnerMoodTracker userId={userId} />
    </div>
  );
}

function InnerMoodTracker({ userId }: MoodTrackerProps) {
  const reduceMotion = useReducedMotion();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load mood history on component mount
  useEffect(() => {
    loadMoodHistory();
  }, []);

  const loadMoodHistory = async () => {
    try {
      const response = await fetch(`/api/moods/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMoodHistory(data);
      }
    } catch (error) {
      console.error('Error loading mood history:', error);
    }
  };

  const submitMood = async () => {
    if (selectedMood === null) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/moods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          moodLevel: selectedMood,
          notes: notes.trim(),
        }),
      });

      if (response.ok) {
        setSelectedMood(null);
        setNotes('');
        await loadMoodHistory();
      }
    } catch (error) {
      console.error('Error submitting mood:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare data for chart
  const chartData = moodHistory.slice(-14).map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: entry.moodLevel,
  }));

  return (
    <motion.div
      variants={cardEntranceVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Mood Input Card */}
      <Card>
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
          <CardDescription>
            Select your current mood and add any notes about your day
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mood Selection */}
          <div className="flex justify-center gap-4 flex-wrap">
            {moodEmojis.map((mood) => (
              <motion.button
                key={mood.level}
                onClick={() => setSelectedMood(mood.level)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedMood === mood.level
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-primary/50'
                }`}
                variants={gentleEntranceVariants}
                initial="initial"
                animate="animate"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-3xl mb-2">{mood.emoji}</div>
                <div className="text-sm text-muted-foreground">{mood.label}</div>
              </motion.button>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How was your day? What made you feel this way?"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <motion.div {...createButtonVariants(reduceMotion)}>
            <Button
              onClick={submitMood}
              disabled={selectedMood === null || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Saving...' : 'Save Mood'}
            </Button>
          </motion.div>
        </CardContent>
      </Card>

      {/* Mood History Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Mood Trends</CardTitle>
            <CardDescription>
              Track your mood patterns over the last 14 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                  <Tooltip
                    formatter={(value: number) => [
                      moodEmojis.find(m => m.level === value)?.label || value,
                      'Mood'
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      {moodHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {moodHistory.slice(-5).reverse().map((entry) => (
                <motion.div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  variants={gentleEntranceVariants}
                  initial="initial"
                  animate="animate"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {moodEmojis.find(m => m.level === entry.moodLevel)?.emoji}
                    </span>
                    <div>
                      <div className="font-medium">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                      {entry.notes && (
                        <div className="text-sm text-muted-foreground">
                          {entry.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {moodEmojis.find(m => m.level === entry.moodLevel)?.label}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
