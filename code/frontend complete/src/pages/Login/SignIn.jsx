import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ArrowLeft } from 'lucide-react';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendCount, setResendCount] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    // Simulate API call to backend
    setShowOTP(true);
  };

  const handleVerifyOTP = async () => {
    // Simulate API call to verify OTP
    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      const data = await response.json();
      navigate(data.redirectUrl);
    } else if (response.status === 400) {
      setOtpError('OOPS! Wrong OTP.');
    }
  };

  const handleResendOTP = () => {
    if (resendCount >= 3) {
      navigate('/', { state: { message: 'You must retry!' } });
      return;
    }

    setResendCount(resendCount + 1);
    setResendDisabled(true);
    setTimeout(() => setResendDisabled(false), 120000); // 2 minutes
    // Simulate resending OTP
    console.log('Resending OTP...');
  };

  const handleVerifyOTPt = () => {
    setTimeout(() => {
      navigate('/patient')
    }, 20);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center relative">
          <Button 
            variant="ghost" 
            className="absolute left-4 top-4 z-10"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <CardTitle className="text-2xl font-bold text-blue-800">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {!showOTP && (
              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Sign In
              </Button>
            )}
          </form>
          {showOTP && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP *</Label>
                <Input 
                  id="otp" 
                  type="text" 
                  placeholder="Enter OTP sent to your email" 
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  required
                />
              </div>
              {otpError && <p className="text-red-500">{otpError}</p>}
              <Button onClick={handleVerifyOTPt} className="w-full bg-green-500 hover:bg-green-600 text-white">
                Verify OTP
              </Button>
              <Button 
                onClick={handleResendOTP} 
                disabled={resendDisabled}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Resend OTP
              </Button>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4">* Required fields</p>
        </CardContent>
      </Card>
    </div>
  );
}

