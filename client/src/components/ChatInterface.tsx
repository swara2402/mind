import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cardEntranceVariants, messageVariants, gentleEntranceVariants, createButtonVariants, typingDotVariants, useReducedMotion } from '@/utils/motionVariants';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  userId: string;
}

export default function ChatInterface({ userId }: ChatInterfaceProps) {
  const reduceMotion = useReducedMotion();
  const { toast } = useToast();

  return (
    <div className="min-h-screen" style={{ backgroundImage: `url('/attached_assets/generated_images/Diverse_Indian_youth_support_group_23098eaa.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <InnerChatInterface userId={userId} reduceMotion={reduceMotion} toast={toast} />
    </div>
  );
}

function InnerChatInterface({ userId, reduceMotion, toast }: { userId: string; reduceMotion: boolean; toast: any }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm here to listen and support you. This is a safe, confidential space where you can share anything that's on your mind. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = newMessage;
    setNewMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          userId: userId
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Show crisis alert if detected
      if (data.crisisDetected) {
        toast({
          title: "Crisis Support Alert",
          description: "I've detected that you might be in crisis. Please consider reaching out to professional help immediately.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or reach out to a crisis helpline if you need immediate support.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      variants={cardEntranceVariants}
      initial="initial"
      animate="animate"
    >
      <Card className="h-[600px] flex flex-col">
        <motion.div 
          className="p-4 border-b"
          variants={gentleEntranceVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
              {...(reduceMotion ? {} : {
                whileHover: { scale: 1.05 },
                transition: { type: "spring", stiffness: 400, damping: 25 }
              })}
            >
              <Bot className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h3 className="font-medium text-foreground">AI Wellness Companion</h3>
              <motion.p 
                className="text-sm text-muted-foreground"
                variants={gentleEntranceVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.3 }}
              >
                Always here to listen
              </motion.p>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ delay: index * 0.05 }}
                {...(reduceMotion ? {} : { whileHover: { scale: 1.02 } })}
              >
                {message.sender === 'ai' && (
                  <motion.div 
                    className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    {...(reduceMotion ? {} : {
                      whileHover: { scale: 1.1 },
                      transition: { type: "spring", stiffness: 400, damping: 17 }
                    })}
                  >
                    <Bot className="w-4 h-4 text-primary" />
                  </motion.div>
                )}
                <motion.div
                  className={`max-w-[80%] px-4 py-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  {...(reduceMotion ? {} : {
                    whileHover: { scale: 1.02 },
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  })}
                >
                  <motion.p 
                    className="text-sm leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {message.content}
                  </motion.p>
                  <motion.span 
                    className="text-xs opacity-70 mt-2 block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ duration: 0.2, delay: 0.4 }}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </motion.span>
                </motion.div>
                {message.sender === 'user' && (
                  <motion.div 
                    className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    {...(reduceMotion ? {} : {
                      whileHover: { scale: 1.1 },
                      transition: { type: "spring", stiffness: 400, damping: 17 }
                    })}
                  >
                    <User className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          <AnimatePresence>
            {isTyping && (
              <motion.div 
                className="flex gap-3 justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <motion.div 
                  className="bg-muted px-4 py-3 rounded-lg"
                  variants={gentleEntranceVariants}
                  initial="initial"
                  animate="animate"
                >
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div 
                        key={i}
                        className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                        variants={typingDotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div 
          className="p-4 border-t"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex gap-2">
            <motion.div
              className="flex-1"
              {...(reduceMotion ? {} : {
                whileFocus: { scale: 1.01 },
                transition: { type: "spring", stiffness: 400, damping: 17 }
              })}
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="flex-1"
                data-testid="input-message"
              />
            </motion.div>
            <motion.div {...createButtonVariants(reduceMotion)}>
              <Button 
                onClick={sendMessage} 
                disabled={!newMessage.trim() || isTyping}
                size="icon"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
          <motion.p 
            className="text-xs text-muted-foreground mt-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            This conversation is completely confidential and not stored.
          </motion.p>
        </motion.div>
      </Card>
    </motion.div>
  );
}