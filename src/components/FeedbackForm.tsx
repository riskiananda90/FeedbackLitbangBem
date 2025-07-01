
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Send, Save, User, MessageSquare, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackFormProps {
  onSubmit: (feedback: { name: string; feedback: string }) => void;
  currentUser: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  currentUser
}) => {
  const [name, setName] = useState(currentUser || '');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [nameError, setNameError] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [draft, setDraft] = useLocalStorage('feedbackDraft', { name: '', feedback: '' });
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Auto-save draft every 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (name.trim() || feedback.trim()) {
        setDraft({ name, feedback });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [name, feedback, setDraft]);

  // Load draft on component mount
  useEffect(() => {
    if (draft.name && !currentUser) {
      setName(draft.name);
    }
    if (draft.feedback) {
      setFeedback(draft.feedback);
    }
  }, []);

  // Update counts
  useEffect(() => {
    setWordCount(feedback.trim().split(/\s+/).filter(word => word.length > 0).length);
    setCharCount(feedback.length);
  }, [feedback]);

  // Real-time validation
  const validateName = useCallback((value: string) => {
    if (value.length < 3) {
      setNameError('Nama minimal 3 karakter');
      return false;
    }
    setNameError('');
    return true;
  }, []);

  const validateFeedback = useCallback((value: string) => {
    if (value.length < 10) {
      setFeedbackError('Feedback minimal 10 karakter');
      return false;
    }
    if (value.length > 500) {
      setFeedbackError('Feedback maksimal 500 karakter');
      return false;
    }
    setFeedbackError('');
    return true;
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Auto-capitalize first letter of each word
    const capitalized = value.replace(/\b\w/g, l => l.toUpperCase());
    setName(capitalized);
    validateName(capitalized);
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setFeedback(value);
      validateFeedback(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isNameValid = validateName(name);
    const isFeedbackValid = validateFeedback(feedback);
    
    if (!isNameValid || !isFeedbackValid) {
      // Shake animation for form errors
      const form = e.target as HTMLFormElement;
      form.classList.add('animate-shake');
      setTimeout(() => {
        form.classList.remove('animate-shake');
      }, 500);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      onSubmit({ name: name.trim(), feedback: feedback.trim() });
      
      // Success state
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Clear form after success animation
      setTimeout(() => {
        setName('');
        setFeedback('');
        setDraft({ name: '', feedback: '' });
        setIsSuccess(false);
      }, 2000);
      
    } catch (error) {
      setIsSubmitting(false);
      toast.error('Gagal mengirim feedback. Silakan coba lagi.');
    }
  };

  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <Card className="backdrop-blur-lg bg-white/50 border-gray-200 transition-all duration-300 hover:shadow-xl">
      <CardHeader className="pb-3 sm:pb-4 lg:pb-6">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg text-gray-800">
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          <span className="hidden sm:inline">Berikan Feedback Anda</span>
          <span className="sm:hidden">Feedback</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Name Input */}
          <div className="space-y-1 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 text-gray-700">
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              Nama Anda
            </label>
            <Input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Nama lengkap..."
              className={`transition-all duration-200 text-sm sm:text-base h-8 sm:h-10 ${
                nameError 
                  ? 'border-red-500 focus:border-red-500' 
                  : name.length >= 3 
                    ? 'border-green-500 focus:border-green-500' 
                    : ''
              } bg-white`}
              disabled={isSubmitting || isSuccess}
            />
            {nameError && (
              <p className="text-xs text-red-500 animate-fade-in">{nameError}</p>
            )}
          </div>

          {/* Feedback Textarea */}
          <div className="space-y-1 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 text-gray-700">
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
              Feedback Anda
            </label>
            <Textarea
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Bagikan pendapat, saran, atau kritik..."
              className={`min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] transition-all duration-200 text-sm sm:text-base ${
                feedbackError 
                  ? 'border-red-500 focus:border-red-500' 
                  : feedback.length >= 10 
                    ? 'border-green-500 focus:border-green-500' 
                    : ''
              } bg-white`}
              disabled={isSubmitting || isSuccess}
            />
            
            {/* Character Counter */}
            <div className="flex justify-between text-xs text-gray-500">
              <div className="flex gap-2 sm:gap-4">
                <span>
                  {wordCount} kata
                  <span className="hidden sm:inline"> | ~{estimatedReadTime} menit baca</span>
                </span>
                {draft.feedback && (
                  <span className="flex items-center gap-1 text-blue-500">
                    <Save className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">Draft tersimpan</span>
                    <span className="sm:hidden">Draft</span>
                  </span>
                )}
              </div>
              <span className={`${
                charCount > 450 ? 'text-red-500' : charCount > 400 ? 'text-yellow-500' : ''
              }`}>
                {charCount}/500
              </span>
            </div>
            
            {feedbackError && (
              <p className="text-xs text-red-500 animate-fade-in">{feedbackError}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || isSuccess || !!nameError || !!feedbackError}
            className={`w-full transition-all duration-300 h-8 sm:h-10 text-sm sm:text-base ${
              isSuccess 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-medium`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                <span>Mengirim...</span>
                <div className="w-8 sm:w-16 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full animate-progress"></div>
                </div>
              </div>
            ) : isSuccess ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Terkirim!</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Kirim Feedback</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
