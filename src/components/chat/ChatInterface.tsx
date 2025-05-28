import { useEffect, useState, useRef } from 'react';
import { Message, ChatThread, messageService, MessageType, UserPresence } from '@/app/api/messages/messageService';
import { UserData } from '@/app/api/profile/userDataService';
import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Image as ImageIcon, Paperclip, Mic, Check, CheckCheck, X } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';
import { FirebaseStorage } from 'firebase/storage';

interface ChatInterfaceProps {
  otherUser: UserData;
  currentUser: UserData;
}

export function ChatInterface({ otherUser, currentUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [otherUserPresence, setOtherUserPresence] = useState<UserPresence | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Get or create chat thread
        const userThreads = await messageService.getUserThreads(currentUser.uid);
        const existingThread = userThreads.find(thread => 
          thread.participants.includes(otherUser.uid) && 
          thread.participants.includes(currentUser.uid)
        );

        if (existingThread?.id) {
          setThreadId(existingThread.id);
        } else {
          const newThreadId = await messageService.createChatThread([
            currentUser.uid,
            otherUser.uid
          ]);
          setThreadId(newThreadId);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser && otherUser) {
      initializeChat();
    }
  }, [currentUser, otherUser]);

  useEffect(() => {
    let unsubscribe: () => void;
    let presenceUnsubscribe: () => void;

    if (threadId) {
      unsubscribe = messageService.subscribeToMessages(threadId, (updatedMessages) => {
        setMessages(updatedMessages);
        // Mark messages as read
        messageService.markThreadAsRead(threadId, currentUser.uid);
      });

      presenceUnsubscribe = messageService.subscribeToUserPresence(otherUser.uid, (presence) => {
        setOtherUserPresence(presence);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (presenceUnsubscribe) {
        presenceUnsubscribe();
      }
    };
  }, [threadId, currentUser.uid, otherUser.uid]);

  // Update user presence
  useEffect(() => {
    messageService.updateUserPresence(currentUser.uid, true);

    const handleVisibilityChange = () => {
      messageService.updateUserPresence(currentUser.uid, !document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      messageService.updateUserPresence(currentUser.uid, false);
    };
  }, [currentUser.uid]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!threadId || !newMessage.trim()) return;

    try {
      await messageService.sendMessage(threadId, {
        senderId: currentUser.uid,
        receiverId: otherUser.uid,
        content: newMessage.trim(),
        read: false,
        type: 'text'
      });
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleFileUpload = async (file: File, type: MessageType) => {
    if (!threadId) return;
    if (!storage) {
      toast.error('Storage is not initialized');
      return;
    }

    try {
      const storageRef = ref(storage as FirebaseStorage, `chat/${threadId}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);

      let thumbnailUrl = '';
      if (type === 'image') {
        // Create thumbnail for images
        const thumbnailRef = ref(storage as FirebaseStorage, `chat/${threadId}/thumbnails/${Date.now()}_${file.name}`);
        // Here you might want to resize the image before uploading as thumbnail
        thumbnailUrl = fileUrl; // For now, use the same URL
      }

      await messageService.sendMessage(threadId, {
        senderId: currentUser.uid,
        receiverId: otherUser.uid,
        content: file.name,
        read: false,
        type,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileUrl,
          thumbnailUrl: type === 'image' ? thumbnailUrl : undefined
        }
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  };

  const handleVoiceRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioFile = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });
          await handleFileUpload(audioFile, 'voice');
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error recording voice:', error);
        toast.error('Failed to start voice recording');
      }
    }
  };

  const renderMessage = (message: Message) => {
    const isOwn = message.senderId === currentUser.uid;
    const messageTime = message.timestamp?.toDate().toLocaleTimeString();

    return (
      <div
        key={message.id}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-[70%] px-4 py-2 rounded-lg ${
            isOwn ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
          }`}
        >
          {message.type === 'text' && (
            <p>{message.content}</p>
          )}

          {message.type === 'image' && message.metadata?.fileUrl && (
            <div className="space-y-2">
              <img 
                src={message.metadata.fileUrl} 
                alt={message.metadata.fileName || 'Image'} 
                className="max-w-full rounded"
              />
              {message.metadata.fileName && (
                <p className="text-sm opacity-70">{message.metadata.fileName}</p>
              )}
            </div>
          )}

          {message.type === 'document' && message.metadata?.fileUrl && (
            <a 
              href={message.metadata.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline"
            >
              <Paperclip className="w-4 h-4" />
              <span>{message.metadata.fileName}</span>
            </a>
          )}

          {message.type === 'voice' && message.metadata?.fileUrl && (
            <audio controls className="max-w-full">
              <source src={message.metadata.fileUrl} type="audio/webm" />
              Your browser does not support the audio element.
            </audio>
          )}

          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs opacity-70">{messageTime}</span>
            {isOwn && (
              <span className="ml-1">
                {message.read ? (
                  <CheckCheck className="w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading chat...</div>;
  }

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Avatar className="w-10 h-10">
          <AvatarImage src={otherUser.profilePicture} />
          <AvatarFallback>
            {otherUser.firstName[0]}{otherUser.surname[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">
            {otherUser.firstName} {otherUser.surname}
          </h2>
          <p className="text-sm text-gray-500">
            {otherUserPresence?.online ? 'Online' : otherUserPresence?.lastSeen 
              ? `Last seen ${otherUserPresence.lastSeen.toDate().toLocaleString()}`
              : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const type = file.type.startsWith('image/') ? 'image' : 'document';
                handleFileUpload(file, type);
              }
            }}
            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-600"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="w-5 h-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-600"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                fileInputRef.current.click();
              }
            }}
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`text-gray-500 hover:text-gray-600 ${isRecording ? 'text-red-500' : ''}`}
            onClick={handleVoiceRecording}
          >
            {isRecording ? <X className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
} 