'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import Wrapper from '@/layouts/Wrapper';
import HeaderOne from '@/layouts/headers/HeaderOne';
import FooterOne from '@/layouts/footers/FooterOne';
import { toast } from '@/components/ui/use-toast';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { userDataService, UserData } from '@/app/api/profile/userDataService';

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  React.useEffect(() => {
    if (!auth) {
      console.error('Firebase Auth is not initialized.');
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = await userDataService.getUser(user.uid);
          setCurrentUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast({
            title: 'Error',
            description: 'Failed to load user data for feedback.',
            variant: 'destructive',
          });
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() === '' || rating === 0) {
      toast({
        title: 'Incomplete Feedback',
        description: 'Please provide a comment and a rating.',
        variant: 'destructive',
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to submit feedback.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!db) {
        toast({
          title: 'Database Error',
          description: 'Firebase database is not initialized.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      await addDoc(collection(db, 'feedback'), {
        rating,
        comment,
        username: `${currentUser.firstName} ${currentUser.surname}`,
        userId: currentUser.uid,
        timestamp: serverTimestamp(),
      });

      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for your feedback!',
      });

      setComment('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <HeaderOne />
      <Wrapper>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/90 rounded-xl shadow-lg p-6 mb-6 border border-[#5B21B6]/20 text-center">
              <h1 className="text-3xl font-bold mb-2 text-[#2E1065]">Share Your Feedback</h1>
              <p className="text-gray-600 mb-2">
                We value your opinion. Let us know how we can improve.
              </p>
            </div>

            <Card className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                    Rate our website
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-8 h-8 cursor-pointer transition-colors ${
                          rating >= star ? 'text-[#FFD23F] fill-current' : 'text-gray-300'
                        }`}
                        onClick={() => handleRating(star)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Your comments
                  </label>
                  <Textarea
                    id="comment"
                    name="comment"
                    rows={4}
                    className="w-full rounded-md border border-gray-300 focus:ring-[#5B21B6] focus:border-[#5B21B6]"
                    placeholder="Tell us what you think..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#5B21B6] to-[#9D4EDD] text-white hover:from-[#4A1A94] hover:to-[#8C3DBB]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Wrapper>
      <FooterOne />
    </>
  );
}