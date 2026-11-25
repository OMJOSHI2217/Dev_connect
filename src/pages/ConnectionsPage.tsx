import React, { useState } from 'react';
import { 
  Users2, 
  Inbox, 
  Send, 
  UserCheck, 
  UserX, 
  Search, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Tabs } from '../components/ui/Tabs';
import { ConnectionRequestCard } from '../components/common/ConnectionRequestCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

export const ConnectionsPage: React.FC = () => {
  const { connectionRequests, currentUser, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'accepted' | 'declined'>('received');
  const [searchQuery, setSearchQuery] = useState('');

  // Partition requests
  const receivedRequests = connectionRequests.filter(
    r => r.toUserId === currentUser.id && r.status === 'pending'
  );

  const sentRequests = connectionRequests.filter(
    r => r.fromUserId === currentUser.id && r.status === 'pending'
  );

  const acceptedRequests = connectionRequests.filter(
    r => r.status === 'accepted' && (r.fromUserId === currentUser.id || r.toUserId === currentUser.id)
  );

  const declinedRequests = connectionRequests.filter(
    r => r.status === 'declined' && (r.fromUserId === currentUser.id || r.toUserId === currentUser.id)
  );

  // Filter based on active tab & search query
  const getTabRequests = () => {
    let list = receivedRequests;
    if (activeTab === 'sent') list = sentRequests;
    if (activeTab === 'accepted') list = acceptedRequests;
    if (activeTab === 'declined') list = declinedRequests;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(r => {
      const other = r.fromUserId === currentUser.id ? r.toUser : r.fromUser;
      return other.name.toLowerCase().includes(q) ||
             other.username.toLowerCase().includes(q) ||
             other.role.toLowerCase().includes(q) ||
             (r.message && r.message.toLowerCase().includes(q));
    });
  };

  const currentList = getTabRequests();

  const tabsConfig = [
    {
      id: 'received',
      label: 'Received Requests',
      badge: receivedRequests.length,
      icon: <Inbox className="w-3.5 h-3.5" />
    },
    {
      id: 'sent',
      label: 'Sent Requests',
      badge: sentRequests.length > 0 ? sentRequests.length : undefined,
      icon: <Send className="w-3.5 h-3.5" />
    },
    {
      id: 'accepted',
      label: 'Active Connections',
      badge: acceptedRequests.length,
      icon: <UserCheck className="w-3.5 h-3.5" />
    },
    {
      id: 'declined',
      label: 'Declined / Archived',
      badge: declinedRequests.length > 0 ? declinedRequests.length : undefined,
      icon: <UserX className="w-3.5 h-3.5" />
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Developer Connections
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your connection requests, active collaborator network, and pending permissions.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Sparkles className="w-3.5 h-3.5" />}
          onClick={() => setCurrentView('discovery')}
        >
          Find New Collaborators
        </Button>
      </div>

      {/* Tabs and Search Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <Tabs
          tabs={tabsConfig}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId as any)}
        />

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search connections by name, handle, role, or note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Request Cards Grid */}
      {currentList.length === 0 ? (
        <EmptyState
          icon={<Users2 className="w-6 h-6" />}
          title={`No ${activeTab} connections found`}
          description={
            activeTab === 'received'
              ? 'You have no pending requests from other developers at the moment.'
              : activeTab === 'sent'
              ? 'You have not sent any pending connection requests.'
              : activeTab === 'accepted'
              ? 'Connect with developers to unlock full profiles and messaging.'
              : 'No declined or archived requests recorded.'
          }
          actionLabel={activeTab !== 'accepted' ? 'Explore Developer Discovery' : 'Discover Collaborators'}
          onAction={() => setCurrentView('discovery')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentList.map(req => (
            <ConnectionRequestCard
              key={req.id}
              request={req}
              type={activeTab}
            />
          ))}
        </div>
      )}

    </div>
  );
};
