import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageSquare, ExternalLink, AlertTriangle } from 'lucide-react';

interface HelplineInfo {
  name: string;
  number: string;
  description: string;
  availability: string;
  type: 'call' | 'text' | 'chat';
}

const helplines: HelplineInfo[] = [
  {
    name: 'AASRA',
    number: '91-22-27546669',
    description: 'Suicide prevention helpline providing emotional support',
    availability: '24/7',
    type: 'call',
  },
  {
    name: 'Snehi',
    number: '91-11-65978181',
    description: 'Crisis intervention and suicide prevention',
    availability: '24/7',
    type: 'call',
  },
  {
    name: 'Vandrevala Foundation',
    number: '1860-2662-345',
    description: 'Mental health support and crisis intervention',
    availability: '24/7',
    type: 'call',
  },
  {
    name: 'iCall',
    number: '9152987821',
    description: 'Counseling helpline by TISS',
    availability: 'Mon-Sat, 8 AM-10 PM',
    type: 'call',
  },
];

export default function CrisisHelp() {
  const callHelpline = (number: string) => {
    console.log(`Calling helpline: ${number}`);
    // In a real app, this would trigger a phone call
  };

  return (
    <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <CardTitle className="text-orange-800 dark:text-orange-200">
              Need Immediate Help?
            </CardTitle>
            <CardDescription className="text-orange-600 dark:text-orange-400">
              Professional crisis support is available 24/7
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-sm text-orange-700 dark:text-orange-300 bg-orange-100/50 dark:bg-orange-900/50 p-4 rounded-lg">
          <p className="font-medium mb-2">If you're having thoughts of self-harm:</p>
          <p>You're not alone. Professional counselors are ready to listen and help. Your life matters, and support is available.</p>
        </div>

        <div className="space-y-3">
          {helplines.map((helpline, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-orange-200 dark:border-orange-800"
              data-testid={`helpline-${index}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground">{helpline.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {helpline.availability}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {helpline.description}
                </p>
                <p className="text-sm font-mono text-primary">
                  {helpline.number}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => callHelpline(helpline.number)}
                className="ml-4 border-orange-300 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-950"
                data-testid={`button-call-${index}`}
              >
                <Phone className="w-4 h-4 mr-1" />
                Call
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-orange-200 dark:border-orange-800">
          <Button
            variant="outline"
            className="w-full border-orange-300 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-950"
            data-testid="button-more-resources"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Find More Professional Resources
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}