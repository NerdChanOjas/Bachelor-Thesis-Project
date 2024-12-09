import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { AlertCircle } from 'lucide-react';

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOTP] = useState('');
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [timer, setTimer] = useState(120);
  const [attempts, setAttempts] = useState(3);

  useEffect(() => {
    let interval;
    if (resendDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            setResendDisabled(false);
            clearInterval(interval);
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendDisabled]);

  const handleVerifyOTP = async () => {
    if (attempts === 0) {
      navigate('/', { state: { message: 'Maximum attempts reached. Please try again later.' } });
      return;
    }

    try {
      // Simulate API call to verify OTP
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: location.state.email, otp }),
      });

      if (response.status === 200) {
        const data = await response.json();
        navigate(data.redirectUrl);
      } else if (response.status === 400) {
        setError('OOPS! Wrong OTP.');
        setAttempts(prevAttempts => prevAttempts - 1);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const handleResendOTP = () => {
    if (resendCount >= 3) {
      navigate('/', { state: { message: 'You must retry!' } });
      return;
    }

    setResendCount(resendCount + 1);
    setResendDisabled(true);
    setTimer(120);
    // Simulate resending OTP
    console.log('Resending OTP...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-800">OTP Verification</CardTitle>
          <CardDescription>Enter the OTP sent to your email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>
                You have {attempts} attempts remaining to enter the correct OTP.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="otp">OTP *</Label>
              <Input 
                id="otp" 
                type="text" 
                placeholder="Enter OTP" 
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button onClick={handleVerifyOTP} className="w-full bg-green-500 hover:bg-green-600 text-white">
              Verify OTP
            </Button>
            <div className="flex items-center justify-between">
              <Button 
                onClick={handleResendOTP} 
                disabled={resendDisabled}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Resend OTP
              </Button>
              <span className="text-sm text-gray-500">
                {resendDisabled ? `Resend in ${timer}s` : 'Ready to resend'}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">* Required fields</p>
        </CardContent>
      </Card>
    </div>
  );
}

