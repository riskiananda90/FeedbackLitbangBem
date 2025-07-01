
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Bell, Heart, MessageSquare, Award, Clock, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface ActivityFeedProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: Date;
    read: boolean;
    user?: string;
    feedbackId?: number;
  }>;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  isDarkMode: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
  isDarkMode
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like_received':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'new_feedback':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'milestone':
        return <Award className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Activity Feed Panel */}
      <div className={`fixed right-0 top-0 h-full w-80 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${
        isDarkMode ? 'bg-slate-900' : 'bg-white'
      } shadow-2xl border-l ${
        isDarkMode ? 'border-slate-700' : 'border-gray-200'
      }`}>
        <Card className="h-full border-0 rounded-none">
          <CardHeader className={`border-b ${
            isDarkMode ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <CardTitle className={`flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                <Bell className="w-5 h-5" />
                Activity Feed
              </CardTitle>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    className={`text-xs ${
                      isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className={isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-80px)]">
              {notifications.length === 0 ? (
                <div className={`p-8 text-center ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No notifications yet</p>
                  <p className="text-sm">Activity will appear here when users interact with feedbacks</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-slate-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className={`flex items-center gap-2 mt-1 text-xs ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>
                              {formatDistanceToNow(notification.timestamp, { 
                                addSuffix: true, 
                                locale: id 
                              })}
                            </span>
                          </div>
                        </div>
                        
                        {!notification.read && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
