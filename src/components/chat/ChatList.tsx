import { useEffect, useState } from 'react';
import { ChatThread, messageService } from '@/app/api/messages/messageService';
import { UserData, userDataService } from '@/app/api/profile/userDataService';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface ChatListProps {
  currentUser: UserData;
  onSelectChat: (user: UserData) => void;
  selectedUserId?: string;
}

export function ChatList({ currentUser, onSelectChat, selectedUserId }: ChatListProps) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [users, setUsers] = useState<Record<string, UserData>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = messageService.subscribeToUserThreads(
      currentUser.uid,
      async (updatedThreads) => {
        setThreads(updatedThreads);
        
        // Fetch user data for all participants
        const userIds = new Set<string>();
        updatedThreads.forEach(thread => {
          thread.participants.forEach(participantId => {
            if (participantId !== currentUser.uid) {
              userIds.add(participantId);
            }
          });
        });

        const userPromises = Array.from(userIds).map(async userId => {
          const userData = await userDataService.getUser(userId);
          if (userData) {
            return [userId, userData] as [string, UserData];
          }
          return null;
        });

        const userEntries = (await Promise.all(userPromises))
          .filter((entry): entry is [string, UserData] => entry !== null);
        
        setUsers(Object.fromEntries(userEntries));
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser.uid]);

  const getOtherUser = (thread: ChatThread): UserData | undefined => {
    const otherUserId = thread.participants.find(id => id !== currentUser.uid);
    return otherUserId ? users[otherUserId] : undefined;
  };

  const filteredThreads = threads.filter(thread => {
    const otherUser = getOtherUser(thread);
    if (!otherUser) return false;

    const searchTerm = searchQuery.toLowerCase();
    return (
      otherUser.firstName.toLowerCase().includes(searchTerm) ||
      otherUser.surname.toLowerCase().includes(searchTerm)
    );
  });

  if (isLoading) {
    return <div>Loading conversations...</div>;
  }

  return (
    <div className="w-80 border-r h-[600px] flex flex-col">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredThreads.map(thread => {
          const otherUser = getOtherUser(thread);
          if (!otherUser) return null;

          return (
            <Button
              key={thread.id}
              variant="ghost"
              className={`w-full flex items-center gap-3 p-4 hover:bg-gray-100 ${
                selectedUserId === otherUser.uid ? 'bg-gray-100' : ''
              }`}
              onClick={() => onSelectChat(otherUser)}
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={otherUser.profilePicture} />
                <AvatarFallback>
                  {otherUser.firstName[0]}{otherUser.surname[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">
                    {otherUser.firstName} {otherUser.surname}
                  </h3>
                  {thread.lastMessage?.timestamp && (
                    <span className="text-xs text-gray-500">
                      {thread.lastMessage.timestamp.toDate().toLocaleTimeString()}
                    </span>
                  )}
                </div>
                {thread.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {thread.lastMessage.senderId === currentUser.uid ? 'You: ' : ''}
                    {thread.lastMessage.content}
                  </p>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
} 