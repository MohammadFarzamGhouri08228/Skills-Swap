import { useState, useEffect } from 'react';
import { peerService, PeerRequest, Peer } from '@/app/api/peers/peerService';
import { userDataService, UserData } from '@/app/api/profile/userDataService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { Check, X, UserPlus, Users, Send } from 'lucide-react';

interface PeerRequestWithUser extends PeerRequest {
  fromUser: UserData;
}

interface PeerRequestsProps {
  currentUser: UserData;
  onPeerUpdate?: () => void;
}

export default function PeerRequests({ currentUser, onPeerUpdate }: PeerRequestsProps) {
  const [requests, setRequests] = useState<PeerRequestWithUser[]>([]);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRequestMessage, setNewRequestMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    loadPeerRequests();
    loadPeers();
  }, [currentUser.uid]);

  const loadPeerRequests = async () => {
    try {
      setIsLoading(true);
      const requests = await peerService.getUserPeerRequests(currentUser.uid);
      console.log('Loaded peer requests:', requests); // Debug log
      
      // Transform the requests to include user data
      const requestsWithUser = await Promise.all(
        requests.map(async (request) => {
          try {
            const fromUser = await userDataService.getUser(request.senderId);
            if (!fromUser) {
              console.error(`User not found: ${request.senderId}`);
              return null;
            }
            return {
              ...request,
              fromUser
            };
          } catch (error) {
            console.error(`Error loading user data for request ${request.id}:`, error);
            return null;
          }
        })
      );
      
      // Filter out any null values from failed user data loads
      const validRequests = requestsWithUser.filter((request): request is PeerRequestWithUser => request !== null);
      console.log('Processed peer requests:', validRequests); // Debug log
      
      setRequests(validRequests);
    } catch (error) {
      console.error('Error loading peer requests:', error);
      toast.error('Failed to load peer requests');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPeers = async () => {
    try {
      const userPeers = await peerService.getUserPeers(currentUser.uid);
      setPeers(userPeers);
    } catch (error) {
      console.error('Error loading peers:', error);
      toast.error('Failed to load peers');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      await peerService.acceptPeerRequest(requestId);
      await loadPeerRequests();
      await loadPeers();
      if (onPeerUpdate) onPeerUpdate();
      toast.success('Peer request accepted');
    } catch (error) {
      console.error('Error accepting peer request:', error);
      toast.error('Failed to accept peer request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      await peerService.rejectPeerRequest(requestId);
      await loadPeerRequests();
      toast.success('Peer request rejected');
    } catch (error) {
      console.error('Error rejecting peer request:', error);
      toast.error('Failed to reject peer request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedUserId) return;

    try {
      setIsLoading(true);
      await peerService.sendPeerRequest(currentUser.uid, selectedUserId, newRequestMessage);
      setIsDialogOpen(false);
      setNewRequestMessage('');
      setSelectedUserId(null);
      toast.success('Peer request sent');
    } catch (error) {
      console.error('Error sending peer request:', error);
      toast.error('Failed to send peer request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePeer = async (peerId: string) => {
    try {
      setIsLoading(true);
      await peerService.removePeer(currentUser.uid, peerId);
      await loadPeers();
      if (onPeerUpdate) onPeerUpdate();
      toast.success('Peer removed');
    } catch (error) {
      console.error('Error removing peer:', error);
      toast.error('Failed to remove peer');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-[#FFD34E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const pendingRequests = requests.filter(request => request.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Requests Section */}
      <Card className="bg-[#5C2594] border-[#FFD34E]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <UserPlus className="w-5 h-5 text-[#FFD34E]" />
            Pending Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <p className="text-white/80 text-center py-4">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="bg-[#6A35A6] border-[#FFD34E]/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={request.fromUser.profilePicture || undefined} />
                        <AvatarFallback className="bg-[#FFD34E] text-[#5C2594]">
                          {request.fromUser.firstName[0]}{request.fromUser.surname[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {request.fromUser.firstName} {request.fromUser.surname}
                        </p>
                        <p className="text-xs text-[#FFD34E]">
                          Wants to connect with you
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-[#FFD34E] text-[#5C2594] hover:bg-[#FFD34E]/90"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:bg-red-500/10"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Peers Section */}
      <Card className="bg-[#5C2594] border-[#FFD34E]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-[#FFD34E]" />
              My Peers
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Add Peer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Peer Request</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter user ID"
                    value={selectedUserId || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedUserId(e.target.value)}
                  />
                  <Textarea
                    placeholder="Add a message (optional)"
                    value={newRequestMessage}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewRequestMessage(e.target.value)}
                  />
                  <Button
                    className="w-full"
                    onClick={handleSendRequest}
                    disabled={!selectedUserId || isLoading}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Send Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {peers.length === 0 ? (
            <p className="text-white/80 text-center py-4">No peers yet</p>
          ) : (
            <div className="space-y-3">
              {peers.map((peer) => (
                <Card key={peer.userId} className="bg-[#6A35A6] border-[#FFD34E]/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={peer.profilePicture || undefined} />
                        <AvatarFallback className="bg-[#FFD34E] text-[#5C2594]">
                          {peer.displayName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{peer.displayName}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {peer.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-[#FFD34E] text-[#5C2594]">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-500/10"
                        onClick={() => handleRemovePeer(peer.userId)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 