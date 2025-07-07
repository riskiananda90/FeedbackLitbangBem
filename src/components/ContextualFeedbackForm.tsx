
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
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-600" />
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
              className="bg-white border-gray-200"
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
              className="bg-white border-gray-200 resize-none"
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
            className="w-full bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
