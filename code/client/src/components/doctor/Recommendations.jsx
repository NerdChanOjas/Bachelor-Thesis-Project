import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export default function Recommendations({ patient }) {
  const [recommendation, setRecommendation] = useState('');

  const handleSendRecommendation = () => {
    // Here you would typically send the recommendation to your backend
    console.log(`Sending recommendation for ${patient.name}: ${recommendation}`);
    // Clear the textarea after sending
    setRecommendation('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Enter your recommendations here..."
          value={recommendation}
          onChange={(e) => setRecommendation(e.target.value)}
          className="mb-4"
          rows={4}
        />
        <Button onClick={handleSendRecommendation}>Send Recommendation</Button>
      </CardContent>
    </Card>
  );
}

