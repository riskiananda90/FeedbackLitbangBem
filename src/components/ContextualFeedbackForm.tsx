
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Send, User, FileText } from 'lucide-react';
import { Article } from '@/types/article';

interface ContextualFeedbackFormProps {
  onSubmit: (feedback: { name: string; feedback: string }) => void;
  currentUser: string;
  article: Article;
}

export const ContextualFeedbackForm: React.FC<ContextualFeedbackFormProps> = ({
  onSubmit,
  currentUser,
  article
}) => {
  const [name, setName] = useState(currentUser);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(currentUser);
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !feedback.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit({ name: name.trim(), feedback: feedback.trim() });
    setFeedback('');
    setIsSubmitting(false);
  };

  const isValid = name.trim() && feedback.trim() && feedback.trim().length >= 10;

  return (
    <Card className="backdrop-blur-lg bg-white/50 border-gray-200 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          Berikan Feedback
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Nama Lengkap
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              className="bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Feedback Anda
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={`Berikan feedback Anda tentang "${article.title}". Minimal 10 karakter.`}
              rows={4}
              className="bg-white resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              required
              minLength={10}
            />
            <div className="text-xs text-gray-500 text-right">
              {feedback.length}/500 karakter
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Mengirim...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>Kirim Feedback</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
