'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { motion, MotionConfig, AnimatePresence } from 'framer-motion';
import { 
  FiPhone, 
  FiMapPin, 
  FiMail, 
  FiBell, 
  FiCalendar, 
  FiShare2, 
  FiX, 
  FiMessageCircle,
  FiPlus,
  FiUsers,
  FiLoader,
  FiAlertCircle
} from 'react-icons/fi';

import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChatRoom, ChatRoomType, ChatMessage } from '@/types/chat';
import { useChatRooms, useChatMessages, useWebSocket } from '@/hooks/chat';

// UI Components
import { ChatRoomList } from '@/components/chat/ChatRoomList';
import { ChatMessageList } from '@/components/chat/ChatMessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatRoomHeader } from '@/components/chat/ChatRoomHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Types for quick actions
interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export default function ChatPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { data: session, status: sessionStatus } = useSession();
  const searchParams = useSearchParams();

  // URL params for direct navigation
  const contactId = searchParams?.get('contactId') || undefined;
  const contactName = searchParams?.get('contactName') || undefined;
  const contactAvatar = searchParams?.get('contactAvatar') || undefined;

  // Local state
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(contactId || null);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<ChatRoomType>('group');
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  
  // Modals state
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [draftMeeting, setDraftMeeting] = useState<{ day: string; time: string }>({ 
    day: t('today'), 
    time: '15:00' 
  });
  const [draftReminder, setDraftReminder] = useState<string>(t('tomorrow'));

  // Quick replies
  const quickReplies = useMemo(() => [
    t('chat_qr_1'),
    t('chat_qr_2'),
    t('chat_qr_3'),
    t('chat_qr_4'),
    t('chat_qr_5')
  ], [t]);

  const recentProperties = useMemo(() => [
    { id: 'p1', title: `${t('vake')} • 3 ${t('rooms')} • 120 ${t('sqm')}`, url: '/properties/101' },
    { id: 'p2', title: `${t('saburtalo')} • 2 ${t('rooms')} • 78 ${t('sqm')}`, url: '/properties/102' },
    { id: 'p3', title: `${t('vera')} • 1 ${t('rooms')} • 52 ${t('sqm')}`, url: '/properties/103' },
  ], [t]);

  // Chat hooks
  const {
    rooms,
    isLoading: roomsLoading,
    isCreating,
    error: roomsError,
    createRoom,
    refresh: refreshRooms,
  } = useChatRooms({ pollInterval: 10000 });

  const {
    messages,
    isLoading: messagesLoading,
    isSending,
    error: messagesError,
    hasMore,
    sendMessage,
    loadMore,
    addOptimisticMessage,
    updateMessage,
  } = useChatMessages({
    roomId: selectedRoomId,
    pollInterval: 3000,
  });

  const {
    isConnected: wsConnected,
    onlineUsers,
    typingUsers,
    sendTyping,
  } = useWebSocket({
    roomId: selectedRoomId,
    enabled: !!selectedRoomId,
  });

  // Derived state
  const selectedRoom = useMemo(() => 
    rooms.find(r => r.id === selectedRoomId) || null,
    [rooms, selectedRoomId]
  );

  const currentUserId = session?.user?.id || '';

  // Handle room selection
  const handleSelectRoom = useCallback((room: ChatRoom) => {
    setSelectedRoomId(room.id);
    setShowMobileSidebar(false);
  }, []);

  // Handle creating new room
  const handleCreateRoom = useCallback(async () => {
    if (!newRoomName.trim()) return;
    
    const room = await createRoom({
      name: newRoomName.trim(),
      type: newRoomType,
      memberIds: [], // Add members in a separate step
    });
    
    if (room) {
      setNewRoomName('');
      setIsCreateRoomOpen(false);
      setSelectedRoomId(room.id);
    }
  }, [newRoomName, newRoomType, createRoom]);

  // Handle sending message with optimistic update
  const handleSendMessage = useCallback(async (content: string, file?: File | null) => {
    if (!selectedRoomId || !currentUserId) return;

    // Create optimistic message
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      roomId: selectedRoomId,
      senderId: currentUserId,
      senderName: session?.user?.name || 'You',
      senderAvatar: null,
      type: file ? 'file' : 'text',
      content,
      fileUrl: file ? URL.createObjectURL(file) : null,
      fileName: file?.name || null,
      fileSize: file?.size || null,
      isEdited: false,
      editedAt: null,
      replyTo: null,
      createdAt: new Date().toISOString(),
    };

    // Add optimistic message immediately
    addOptimisticMessage(optimisticMessage);

    // Send to server
    const result = await sendMessage({ content, file });

    // Update optimistic message with real one if successful
    if (result) {
      updateMessage(optimisticMessage.id, { id: result.id });
    }
  }, [selectedRoomId, currentUserId, session?.user?.name, addOptimisticMessage, sendMessage, updateMessage]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    sendTyping(true);
  }, [sendTyping]);

  // Handle quick reply
  const handleQuickReply = useCallback((text: string) => {
    handleSendMessage(text);
  }, [handleSendMessage]);

  // System message helpers
  const addSystemMessage = useCallback((text: string) => {
    if (!selectedRoomId) return;
    
    const systemMessage: ChatMessage = {
      id: `system-${Date.now()}`,
      roomId: selectedRoomId,
      senderId: 'system',
      senderName: 'System',
      senderAvatar: null,
      type: 'system',
      content: text,
      fileUrl: null,
      fileName: null,
      fileSize: null,
      isEdited: false,
      editedAt: null,
      replyTo: null,
      createdAt: new Date().toISOString(),
    };
    
    addOptimisticMessage(systemMessage);
  }, [selectedRoomId, addOptimisticMessage]);

  // Modal handlers
  const confirmMeeting = useCallback(() => {
    addSystemMessage(`${t('chat_schedule')}: ${draftMeeting.day}, ${draftMeeting.time}`);
    setMeetingOpen(false);
  }, [draftMeeting, t, addSystemMessage]);

  const confirmShare = useCallback((propUrl: string) => {
    addSystemMessage(`${t('chat_shared_property')}: ${propUrl}`);
    setShareOpen(false);
  }, [t, addSystemMessage]);

  const confirmReminder = useCallback(() => {
    addSystemMessage(`${t('chat_reminder_set')}: ${draftReminder}`);
    setReminderOpen(false);
  }, [draftReminder, t, addSystemMessage]);

  // Set initial room from URL params
  useEffect(() => {
    if (contactId && !selectedRoomId) {
      setSelectedRoomId(contactId);
    }
  }, [contactId, selectedRoomId]);

  // Loading state for session
  if (sessionStatus === 'loading') {
    return (
      <div className={`fixed inset-x-0 top-20 bottom-0 flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <FiLoader className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // Not authenticated state
  if (sessionStatus === 'unauthenticated') {
    return (
      <div className={`fixed inset-x-0 top-20 bottom-0 flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="text-center">
          <FiAlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Please sign in to access chat
          </p>
        </div>
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className={`fixed inset-x-0 top-20 bottom-0 overflow-hidden flex ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        
        {/* Left Sidebar - Chat Room List */}
        <AnimatePresence mode="wait">
          {(showMobileSidebar || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className={cn(
                "absolute lg:relative z-20 w-full lg:w-[350px] flex-shrink-0 h-full",
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50',
                "border-r",
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              )}
            >
              <ChatRoomList
                rooms={rooms}
                selectedRoomId={selectedRoomId}
                isLoading={roomsLoading}
                onSelect={handleSelectRoom}
                onCreate={() => setIsCreateRoomOpen(true)}
                className="h-full"
              />
              
              {/* Error Toast */}
              {roomsError && (
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-red-500 text-white rounded-lg shadow-lg text-sm">
                  {roomsError}
                  <button 
                    onClick={refreshRooms}
                    className="ml-2 underline"
                  >
                    Retry
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full relative">
          {/* Mobile Back Button */}
          {!showMobileSidebar && (
            <button
              onClick={() => setShowMobileSidebar(true)}
              className={cn(
                "lg:hidden absolute top-4 left-4 z-10 p-2 rounded-full",
                theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
              )}
            >
              <FiMessageCircle className="w-5 h-5" />
            </button>
          )}

          {/* Chat Header */}
          <ChatRoomHeader
            room={selectedRoom}
            isMobile={typeof window !== 'undefined' && window.innerWidth < 1024}
            onBack={() => setShowMobileSidebar(true)}
            onVoiceCall={() => addSystemMessage(t('chat_voice_call_initiated'))}
            onVideoCall={() => addSystemMessage(t('chat_video_call_initiated'))}
            onViewInfo={() => addSystemMessage(t('chat_view_info'))}
            onLeaveRoom={() => {
              if (confirm(t('chat_leave_confirm'))) {
                setSelectedRoomId(null);
              }
            }}
          />

          {/* Connection Status */}
          {wsConnected && (
            <div className="absolute top-16 right-4 z-10 flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden relative">
            {selectedRoomId ? (
              <>
                <ChatMessageList
                  messages={messages}
                  currentUserId={currentUserId}
                  isLoading={messagesLoading && messages.length === 0}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                  className="h-full"
                />
                
                {/* Typing Indicator */}
                {Array.from(typingUsers.values()).some(t => t.roomId === selectedRoomId) && (
                  <div className={cn(
                    "absolute bottom-4 left-4 px-3 py-2 rounded-full text-sm",
                    theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  )}>
                    <span className="flex items-center gap-2">
                      <span className="flex gap-0.5">
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                      Someone is typing...
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className={`flex flex-col items-center justify-center h-full ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <FiMessageCircle className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">
                  {t('chat_select_room') || 'Select a conversation to start chatting'}
                </p>
              </div>
            )}
          </div>

          {/* Quick Replies Bar */}
          {selectedRoomId && (
            <div className={cn(
              "px-4 py-2 border-t overflow-x-auto",
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            )}>
              <div className="flex gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    )}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input */}
          {selectedRoomId && (
            <div className="relative">
              {/* Quick Action Buttons */}
              <div className={cn(
                "absolute -top-10 right-4 flex gap-1",
              )}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setMeetingOpen(true)}
                  title={t('chat_schedule')}
                >
                  <FiCalendar className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShareOpen(true)}
                  title={t('chat_share')}
                >
                  <FiShare2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setReminderOpen(true)}
                  title={t('chat_reminder')}
                >
                  <FiBell className="w-4 h-4" />
                </Button>
              </div>

              <ChatInput
                onSend={handleSendMessage}
                isLoading={isSending}
                disabled={!selectedRoomId}
                placeholder={t('chat_type_message') || 'Type a message...'}
              />
            </div>
          )}
        </div>

        {/* Right Sidebar - User Info */}
        {selectedRoom && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "hidden xl:block w-[300px] flex-shrink-0 border-l overflow-y-auto",
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            )}
          >
            {/* Room/Contact Info */}
            <div className={cn(
              "p-6 border-b text-center",
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            )}>
              <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-lg">
                <AvatarImage src={selectedRoom.avatar || undefined} alt={selectedRoom.name} />
                <AvatarFallback className="bg-primary-500 text-white text-2xl">
                  {selectedRoom.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <h3 className={cn(
                "mt-4 text-lg font-semibold",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {selectedRoom.name}
              </h3>
              
              <div className="flex items-center justify-center gap-2 mt-2">
                {selectedRoom.type === 'direct' ? (
                  <>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      onlineUsers.has(selectedRoom.participantIds[0]) ? 'bg-green-500' : 'bg-gray-400'
                    )} />
                    <span className={cn(
                      "text-sm",
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      {onlineUsers.has(selectedRoom.participantIds[0]) ? t('online') : t('offline')}
                    </span>
                  </>
                ) : (
                  <div className="flex items-center gap-1">
                    <FiUsers className="w-4 h-4" />
                    <span className={cn(
                      "text-sm",
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      {selectedRoom.participantCount} members
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information (placeholder) */}
            <div className={cn(
              "p-5 border-b",
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            )}>
              <h4 className={cn(
                "font-semibold mb-4",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {t('contactInformation')}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiPhone className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className={cn(
                    "text-sm",
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    +995 599 12 34 56
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiMail className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className={cn(
                    "text-sm",
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    contact@lumina.estate
                  </span>
                </div>
              </div>
            </div>

            {/* Online Members (for group chats) */}
            {selectedRoom.type === 'group' && (
              <div className={cn(
                "p-5 border-b",
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              )}>
                <h4 className={cn(
                  "font-semibold mb-4",
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  Online Now
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(onlineUsers).slice(0, 5).map((userId) => (
                    <div key={userId} className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary-500 text-white text-xs">
                          {userId.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                  ))}
                  {onlineUsers.size > 5 && (
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                      theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                    )}>
                      +{onlineUsers.size - 5}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Create Room Dialog */}
      <Dialog open={isCreateRoomOpen} onOpenChange={setIsCreateRoomOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Chat Room</DialogTitle>
            <DialogDescription>
              Start a new conversation with your team or clients.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Room Name</label>
              <Input
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Enter room name..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Room Type</label>
              <div className="flex gap-2">
                <Button
                  variant={newRoomType === 'direct' ? 'default' : 'outline'}
                  onClick={() => setNewRoomType('direct')}
                  className="flex-1"
                >
                  Direct
                </Button>
                <Button
                  variant={newRoomType === 'group' ? 'default' : 'outline'}
                  onClick={() => setNewRoomType('group')}
                  className="flex-1"
                >
                  Group
                </Button>
                <Button
                  variant={newRoomType === 'support' ? 'default' : 'outline'}
                  onClick={() => setNewRoomType('support')}
                  className="flex-1"
                >
                  Support
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateRoomOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateRoom}
              disabled={!newRoomName.trim() || isCreating}
            >
              {isCreating ? (
                <>
                  <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Room'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Meeting Modal */}
      {meetingOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
          onClick={() => setMeetingOpen(false)}
        >
          <div 
            className={cn(
              "rounded-lg shadow-xl p-4 w-[320px]",
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{t('chat_schedule')}</h3>
              <button onClick={() => setMeetingOpen(false)}>
                <FiX />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                {[t('today'), t('tomorrow'), t('other')].map(d => (
                  <button 
                    key={d} 
                    onClick={() => setDraftMeeting({ ...draftMeeting, day: d })} 
                    className={cn(
                      "text-xs px-2 py-1 rounded-full border",
                      draftMeeting.day === d 
                        ? 'bg-primary-500 text-white border-transparent' 
                        : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <Input 
                value={draftMeeting.time} 
                onChange={(e) => setDraftMeeting({ ...draftMeeting, time: e.target.value })} 
                type="time"
              />
              <Button onClick={confirmMeeting} className="w-full">
                {t('chat_confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
          onClick={() => setShareOpen(false)}
        >
          <div 
            className={cn(
              "rounded-lg shadow-xl p-4 w-[360px]",
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{t('chat_recent_properties')}</h3>
              <button onClick={() => setShareOpen(false)}>
                <FiX />
              </button>
            </div>
            <div className="space-y-2">
              {recentProperties.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => confirmShare(p.url)} 
                  className={cn(
                    "w-full text-left rounded px-3 py-2 transition-colors",
                    theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  )}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {reminderOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
          onClick={() => setReminderOpen(false)}
        >
          <div 
            className={cn(
              "rounded-lg shadow-xl p-4 w-[320px]",
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{t('chat_reminder')}</h3>
              <button onClick={() => setReminderOpen(false)}>
                <FiX />
              </button>
            </div>
            <div className="flex gap-2 mb-3">
              {[t('today'), t('tomorrow'), t('oneWeek')].map(d => (
                <button 
                  key={d} 
                  onClick={() => setDraftReminder(d)} 
                  className={cn(
                    "text-xs px-2 py-1 rounded-full border",
                    draftReminder === d 
                      ? 'bg-primary-500 text-white border-transparent' 
                      : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
            <Button onClick={confirmReminder} className="w-full">
              {t('chat_confirm')}
            </Button>
          </div>
        </div>
      )}
    </MotionConfig>
  );
}
