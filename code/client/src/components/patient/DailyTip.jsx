import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bell } from 'lucide-react';

// Mock function to generate a daily tip
const generateDailyTip = () => {
  const tips = [
    "Try to get at least 30 minutes of moderate exercise today.",
    "Remember to stay hydrated! Aim for 8 glasses of water.",
    "Include more leafy greens in your diet for better nutrition.",
    "Take short breaks every hour to reduce eye strain and improve posture.",
    "Practice deep breathing exercises to reduce stress and improve focus."
  ];
//   return tips[Math.floor(Math.random() * tips.length)];
  return tips;
};

export default function DailyTip() {
  const [tip, setTip] = useState('');
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    // In a real app, you'd fetch the tip from an API
    setTip(generateDailyTip());
    // Check if the tip has been seen (e.g., from local storage)
    const tipSeen = localStorage.getItem('dailyTipSeen') === 'true';
    setSeen(tipSeen);
  }, []);

  const handleTipClick = () => {
    setSeen(true);
    localStorage.setItem('dailyTipSeen', 'true');
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 ${
        seen ? 'bg-muted' : 'bg-primary text-primary-foreground shadow-lg'
      }`}
      onClick={handleTipClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Your Daily Tip
        </CardTitle>
        {!seen && <Bell className="h-4 w-4 animate-bounce" />}
      </CardHeader>
      <CardContent>
        <p className="text-sm">{tip}</p>
      </CardContent>
    </Card>
  );
}

