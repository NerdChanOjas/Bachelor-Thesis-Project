import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

export default function SignInSignUp() {
  const navigate = useNavigate();
  const [choice, setChoice] = useState(null);

  const handleChoice = (selectedChoice) => {
    setChoice(selectedChoice);
    navigate(`/${selectedChoice}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-800">Welcome to HealthCare</CardTitle>
          <CardDescription>Sign in or create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div className="space-y-4">
            <Button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white" 
              onClick={() => handleChoice('signin')}
            >
              Sign In
            </Button>
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 text-white" 
              onClick={() => handleChoice('signup')}
            >
              Sign Up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
