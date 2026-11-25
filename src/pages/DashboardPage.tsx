import React from 'react';
import { 
  Sparkles, 
  Users, 
  MessageSquare, 
  FolderGit2, 
  ArrowRight, 
  Plus, 
  Clock, 
  Check, 
  X, 
  Flame,
  ShieldCheck,
  Compass,
  Laptop
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DeveloperCard } from '../components/common/DeveloperCard';
import { ProjectCard } from '../components/common/ProjectCard';
import { COMPLEMENTARY_ROLE_MAP, calculateDeveloperMatch } from '../data/mockData';

export const DashboardPage: React.FC = () => {
  const { 
    currentUser, 
    setCurrentView, 
    developers, 
    connectionRequests, 
    acceptConnectionRequest, 
    declineConnectionRequest,
    conversations, 
    projects,
    setProjectCreateModalOpen,
    startConversationWithUser,
    openConnectedProfile,
    openPublicProfile 
  } = useApp();

  // Pending incoming requests
  const pendingIncomingRequests = connectionRequests.filter(
    r => r.toUserId === currentUser.id && r.status === 'pending'
  );

  // Accepted connections
  const acceptedRequests = connectionRequests.filter(
    r => r.status === 'accepted' && (r.fromUserId === currentUser.id || r.toUserId === currentUser.id)
  );
  const connectedUserIds = acceptedRequests.map(r => 
    r.fromUserId === currentUser.id ? r.toUserId : r.fromUserId
  );
  const connectedDevelopers = developers.filter(d => connectedUserIds.includes(d.id));

  // Intelligent Priority Matching: 1st preference for complementary + near my location
  const recommendedDevelopers = developers.filter(d => 
    d.id !== currentUser.id && !connectedUserIds.includes(d.id)
  ).sort((a, b) => {
    const matchA = calculateDeveloperMatch(a, currentUser);
    const matchB = calculateDeveloperMatch(b, currentUser);
    if (matchA.matchTier !== matchB.matchTier) return matchA.matchTier - matchB.matchTier;
    return matchB.score - matchA.score;
  }).slice(0, 3);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Personalized Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900/40 via-slate-900 to-indigo-950/40 border border-teal-500/20 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge variant="teal" size="sm" dot>
                Online Workspace
              </Badge>
              <span className="text-xs font-mono text-slate-400">
                {currentUser.role}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              You have <strong className="text-teal-400">{pendingIncomingRequests.length} pending request{pendingIncomingRequests.length === 1 ? '' : 's'}</strong> and <strong className="text-indigo-400">{recommendedDevelopers.length} high-match collaborators</strong> waiting in your matching queue.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              icon={<Compass className="w-4 h-4" />}
              onClick={() => setCurrentView('discovery')}
            >
              Discover Collaborators
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setProjectCreateModalOpen(true)}
            >
              New Project
            </Button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 w-80 h-full bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Active Connections</span>
            <Users className="w-4 h-4 text-teal-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-100">
              {currentUser.connectionsCount}
            </span>
            <span className="text-xs text-emerald-500 font-semibold">+2 this month</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-100">
              {pendingIncomingRequests.length}
            </span>
            {pendingIncomingRequests.length > 0 && (
              <span className="text-xs text-amber-500 font-semibold">Action needed</span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Collaborations</span>
            <FolderGit2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-100">
              {projects.length}
            </span>
            <span className="text-xs text-indigo-500 font-semibold">1 Lead • 2 Active</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Match Compatibility</span>
            <Sparkles className="w-4 h-4 text-teal-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-display text-teal-600 dark:text-teal-400">
              96%
            </span>
            <span className="text-xs text-slate-400 font-semibold">Optimal pairing</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Recommended Collaborators (Left) & Requests + Conversations (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Recommended Developers & Ongoing Projects */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section: Recommended Collaborators */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Recommended Collaborators
                  </h3>
                  <Badge variant="teal" size="sm">
                    Complementary to your stack
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Engineers matching your project requirements and collaboration availability.
                </p>
              </div>

              <button
                onClick={() => setCurrentView('discovery')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedDevelopers.slice(0, 2).map((dev) => (
                <DeveloperCard key={dev.id} developer={dev} />
              ))}
            </div>
          </div>

          {/* Section: Active Projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Ongoing Projects & Open Roles
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Projects actively recruiting collaborators with verified requirements.
                </p>
              </div>

              <button
                onClick={() => setCurrentView('projects')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Browse projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.filter(p => p.status !== 'Completed / Shipped').slice(0, 2).map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Pending Requests & Recent Conversations */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Pending Connection Requests Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Pending Requests ({pendingIncomingRequests.length})
                </h4>
              </div>
              <button
                onClick={() => setCurrentView('connections')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            {pendingIncomingRequests.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                No pending requests right now.
              </p>
            ) : (
              <div className="space-y-3">
                {pendingIncomingRequests.map(req => (
                  <div key={req.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={req.fromUser.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                      />
                      <div className="min-w-0 flex-1">
                        <p 
                          onClick={() => openPublicProfile(req.fromUser)}
                          className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate hover:text-teal-500 cursor-pointer"
                        >
                          {req.fromUser.name}
                        </p>
                        <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 truncate">
                          {req.fromUser.role}
                        </p>
                      </div>
                    </div>

                    {req.message && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 italic">
                        "{req.message}"
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 pt-1">
                      <Button
                        size="sm"
                        variant="primary"
                        className="flex-1 text-[11px] py-1"
                        icon={<Check className="w-3 h-3" />}
                        onClick={() => acceptConnectionRequest(req.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-[11px] py-1"
                        icon={<X className="w-3 h-3 text-rose-500" />}
                        onClick={() => declineConnectionRequest(req.id)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Conversations Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Recent Messages
                </h4>
              </div>
              <button
                onClick={() => setCurrentView('messages')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                Open Chat
              </button>
            </div>

            <div className="space-y-2">
              {conversations.slice(0, 2).map(conv => (
                <div
                  key={conv.id}
                  onClick={() => {
                    startConversationWithUser(conv.participant.id);
                  }}
                  className="p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 transition-colors cursor-pointer flex items-start gap-3"
                >
                  <div className="relative">
                    <img
                      src={conv.participant.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-300 dark:ring-slate-700"
                    />
                    {conv.participant.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {conv.participant.name}
                      </p>
                      <span className="text-xs text-slate-400 font-medium">
                        {conv.updatedAt}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {conv.lastMessage?.text || 'Sent an attachment'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Connections Snapshot */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Connected Partners ({connectedDevelopers.length})
              </h4>
              <button
                onClick={() => setCurrentView('connections')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                All
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {connectedDevelopers.map(dev => (
                <div
                  key={dev.id}
                  onClick={() => openConnectedProfile(dev)}
                  title={`${dev.name} (${dev.role})`}
                  className="relative cursor-pointer group"
                >
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-teal-500 transition-all"
                  />
                  {dev.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900" />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
