import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bell } from 'lucide-react';

// Mock function to generate a daily tip
const generateDailyTip = () => {
  const tips = [
    "Prioritize Heart-Healthy Diet: Focus on a diet rich in vegetables, fruits, whole grains, lean proteins, and healthy fats. Limit salt, sugar, and saturated fats to maintain optimal heart health and support recovery.",
    "Incorporate Regular Physical Activity: Engage in moderate-intensity exercises like brisk walking or swimming for 30 minutes most days. Consult your doctor before starting or adjusting your fitness routine post-heart attack.",
    "Manage Stress Effectively: Practice stress-relief techniques like meditation, yoga, or deep breathing exercises. Chronic stress can strain your heart, so prioritize activities that promote mental and emotional well-being. ",
    "Adhere to Medication and Follow-Ups: Take prescribed medications consistently and attend regular medical checkups to monitor heart health. Discuss any symptoms or concerns with your healthcare provider promptly.",
    "Quit Smoking and Limit Alcohol: If you smoke, seek support to quit, as smoking is a major heart disease risk. Limit alcohol intake to moderate levels or avoid it altogether to reduce cardiovascular strain."
  ];
  return tips[Math.floor(Math.random() * tips.length)];
  // return tips;
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

