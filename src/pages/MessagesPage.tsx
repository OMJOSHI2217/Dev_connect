import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Code,
  Github,
  Search,
  MoreVertical,
  CheckCheck,
  ExternalLink,
  FolderGit2,
  Smile,
  Sparkles,
  ShieldCheck,
  Star,
  GitFork,
  Copy,
  Check,
  GitCommit,
  GitPullRequest,
  GitBranch,
  Upload,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Terminal,
  Users,
  UserPlus,
  UserCheck,
  Layers,
  Hash
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Message, MessageAttachment, RoleType } from '../types';

export const MessagesPage: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    messagesMap,
    sendMessage,
    currentUser,
    openConnectedProfile,
    setCurrentView,
    syncGitAction,
    mergeGitPr,
    assignProjectRole,
    developers,
    projects,
    openRepository
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [conversationSearch, setConversationSearch] = useState('');
  const [chatFilterTab, setChatFilterTab] = useState<'all' | 'projects' | 'direct'>('all');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showPersonalGitMenu, setShowPersonalGitMenu] = useState(false);
  const [showRepoModal, setShowRepoModal] = useState(false);
  
  // Project Chat & Role Assignment State
  const [showTeamDrawer, setShowTeamDrawer] = useState(false);
  const [showAssignRoleModal, setShowAssignRoleModal] = useState(false);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>('user_2');
  const [newRoleInput, setNewRoleInput] = useState<string>('Frontend Developer');

  // In-Chat Unified Diff expansion
  const [expandedDiffMsgId, setExpandedDiffMsgId] = useState<string | null>(null);

  // Repo modal state
  const [repoUrl, setRepoUrl] = useState('https://github.com/alexrivera-dev/high-throughput-grpc');
  const [repoName, setRepoName] = useState('alexrivera-dev/high-throughput-grpc');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    const q = conversationSearch.toLowerCase();
    const matchesSearch = c.participant.name.toLowerCase().includes(q) ||
      c.participant.role.toLowerCase().includes(q) ||
      (c.projectName && c.projectName.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (chatFilterTab === 'projects') return c.type === 'project';
    if (chatFilterTab === 'direct') return c.type !== 'project';
    return true;
  });

  const handleAssignRoleSubmit = () => {
    if (!activeConversation || !selectedAssigneeId || !newRoleInput.trim()) return;
    const projId = activeConversation.projectId || 'proj_1';
    assignProjectRole(projId, selectedAssigneeId, newRoleInput.trim());
    setShowAssignRoleModal(false);
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const activeMessages = activeConversation ? (messagesMap[activeConversation.id] || []) : [];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;

    sendMessage(activeConversation.id, messageText.trim());
    setMessageText('');
  };

  const handleSendRepo = () => {
    if (!repoUrl.trim() || !activeConversation) return;
    const attachment: MessageAttachment = {
      type: 'repo',
      title: repoName || 'github-repository',
      url: repoUrl,
      language: 'Go'
    };
    sendMessage(activeConversation.id, `Shared repository link: ${repoName}`, [attachment]);
    setShowRepoModal(false);
  };

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={<Search className="w-6 h-6" />}
        title="No active conversations yet"
        description="Connect with developers to unlock direct messaging and exchange code snippets."
        actionLabel="Discover Developers"
        onAction={() => setCurrentView('discovery')}
      />
    );
  }

  return (
    <div className="h-[calc(100vh-8.5rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">

      {/* Left Pane: Conversations List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/40 shrink-0">

        {/* Header, Search & Category Tabs */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
              Conversations
            </h3>
            <Badge variant="teal" size="sm">
              Encrypted
            </Badge>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search chats or projects..."
              value={conversationSearch}
              onChange={(e) => setConversationSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Chat Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-[10px] font-mono">
            <button
              type="button"
              onClick={() => setChatFilterTab('all')}
              className={`flex-1 py-1 rounded-md text-center transition-colors cursor-pointer ${
                chatFilterTab === 'all'
                  ? 'bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All ({conversations.length})
            </button>
            <button
              type="button"
              onClick={() => setChatFilterTab('projects')}
              className={`flex-1 py-1 rounded-md text-center transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                chatFilterTab === 'projects'
                  ? 'bg-teal-500 text-white font-bold shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FolderGit2 className="w-3 h-3" />
              <span>Projects</span>
            </button>
            <button
              type="button"
              onClick={() => setChatFilterTab('direct')}
              className={`flex-1 py-1 rounded-md text-center transition-colors cursor-pointer ${
                chatFilterTab === 'direct'
                  ? 'bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Direct
            </button>
          </div>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredConversations.map(conv => {
            const isSelected = activeConversation && conv.id === activeConversation.id;
            const isProject = conv.type === 'project';
            const displayName = isProject ? (conv.projectName || conv.participant.name) : conv.participant.name;

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${isSelected
                    ? 'bg-teal-500/10 dark:bg-teal-500/15 border-l-4 border-teal-500'
                    : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
              >
                <div className="relative shrink-0">
                  {isProject ? (
                    <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-sm">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <img
                      src={conv.participant.avatar}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800"
                    />
                  )}
                  {conv.participant.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-slate-900 dark:text-slate-100'}`}>
                      {displayName}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {conv.updatedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1">
                    {isProject ? (
                      <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                        {conv.participants?.length || 4} Devs Collaborating
                      </span>
                    ) : (
                      <p className="text-[11px] font-mono text-teal-600 dark:text-teal-400 truncate">
                        {conv.participant.role}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate leading-relaxed">
                    {conv.lastMessage?.text || 'Project channel active'}
                  </p>
                </div>

                {conv.unreadCount > 0 && !isSelected && (
                  <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Pane: Chat Canvas */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">

          {/* Chat Header */}
          <div className="p-3.5 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                {activeConversation.type === 'project' ? (
                  <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-sm shrink-0">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                ) : (
                  <img
                    src={activeConversation.participant.avatar}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 shrink-0"
                  />
                )}
                {activeConversation.participant.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {activeConversation.type === 'project' ? (activeConversation.projectName || activeConversation.participant.name) : activeConversation.participant.name}
                  </h4>
                  {activeConversation.type === 'project' ? (
                    <Badge variant="teal" size="sm">Project Workspace</Badge>
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                  {activeConversation.type === 'project'
                    ? `${activeConversation.participants?.length || 4} Developers Collaborating • Role-Assigned Channel`
                    : `${activeConversation.participant.role} • ${activeConversation.participant.isOnline ? 'Online' : 'Last active recently'}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeConversation.type === 'project' ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const slugMap: Record<string, string> = {
                        proj_1: 'alexrivera_dev/devpulse-engine',
                        proj_2: 'elena_codes/neural-canvas-studio',
                        proj_3: 'marcus_cloud/cloudkube-mesh',
                        proj_4: 'david_sys/devsync-cli'
                      };
                      const slug = (activeConversation.projectId && slugMap[activeConversation.projectId]) || 'alexrivera_dev/devpulse-engine';
                      openRepository(slug);
                    }}
                    icon={<FolderGit2 className="w-3.5 h-3.5 text-teal-500" />}
                    className="text-xs font-mono"
                    title="Open Project Git Repository"
                  >
                    Git Repo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTeamDrawer(!showTeamDrawer)}
                    icon={<Users className="w-3.5 h-3.5 text-teal-500" />}
                    className="text-xs font-mono"
                  >
                    Team & Roles ({activeConversation.participants?.length || 4})
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedAssigneeId(activeConversation.participantIds.find(id => id !== currentUser.id) || activeConversation.participantIds[0]);
                      setNewRoleInput('Frontend Developer');
                      setShowAssignRoleModal(true);
                    }}
                    icon={<UserPlus className="w-3.5 h-3.5" />}
                    className="text-xs font-mono"
                  >
                    Assign Role
                  </Button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPersonalGitMenu(!showPersonalGitMenu)}
                      icon={<FolderGit2 className="w-3.5 h-3.5 text-teal-500" />}
                      className="text-xs font-mono"
                      title="Access Git Repositories"
                    >
                      Git Repos ▾
                    </Button>

                    {showPersonalGitMenu && (
                      <div className="absolute right-0 top-full mt-1.5 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-2.5">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <FolderGit2 className="w-3.5 h-3.5 text-teal-500" />
                            <span>Git Collaboration</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowPersonalGitMenu(false)}
                            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          >
                            ✕
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Quick shortcuts to collaborate on code with {activeConversation.participant.name}:
                        </p>

                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setShowPersonalGitMenu(false);
                              setCurrentView('repositories');
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <Code className="w-3.5 h-3.5 text-teal-500" />
                              <span>Browse All Repositories</span>
                            </span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowPersonalGitMenu(false);
                              openRepository('alexrivera_dev/devpulse-engine');
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Open devpulse-engine</span>
                            </span>
                            <Badge variant="teal" size="sm">Main</Badge>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowPersonalGitMenu(false);
                              const att: MessageAttachment = {
                                type: 'repo',
                                title: 'alexrivera_dev/devpulse-engine',
                                url: 'http://localhost:5000/git/alexrivera_dev/devpulse-engine.git',
                                language: 'Go / TypeScript'
                              };
                              sendMessage(
                                activeConversation.id,
                                `Hey @${activeConversation.participant.username || activeConversation.participant.name}, here is our repository to review: alexrivera_dev/devpulse-engine. Clone command: git clone http://localhost:5000/git/alexrivera_dev/devpulse-engine.git`,
                                [att]
                              );
                            }}
                            className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-mono text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors text-left cursor-pointer font-bold"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Share Repo Link in Chat</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openConnectedProfile(activeConversation.participant)}
                    className="text-xs"
                  >
                    View Profile
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Project Team Roster & Assigned Roles Drawer / Banner */}
          {activeConversation.type === 'project' && showTeamDrawer && (
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-teal-500" />
                  <span>Project Contributors & Assigned Roles:</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Assign or adjust team roles anytime in chat
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {(activeConversation.participants || [currentUser, ...developers.slice(0, 3)]).map(member => {
                  const currentAssignedRole = activeConversation.projectRoles?.[member.id] || (member.id === currentUser.id ? 'Lead Architect & Maintainer' : member.role);
                  return (
                    <div key={member.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shadow-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={member.avatar} alt="" className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {member.id === currentUser.id ? `${member.name} (You)` : member.name}
                          </p>
                          <span className="inline-block text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 truncate max-w-[130px]">
                            {currentAssignedRole}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAssigneeId(member.id);
                          setNewRoleInput(currentAssignedRole);
                          setShowAssignRoleModal(true);
                        }}
                        className="text-[10px] font-mono font-semibold text-teal-600 dark:text-teal-400 hover:underline shrink-0 p-1"
                        title="Change role for this developer"
                      >
                        Edit
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Project Context banner if present */}
          {activeConversation.projectContext && (
            <div className="px-6 py-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-mono text-slate-500">
              <FolderGit2 className="w-3.5 h-3.5 text-teal-500" />
              <span>Project Discussion Context:</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {activeConversation.projectContext}
              </strong>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

            <div className="text-center my-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
                Mutual connection accepted. Direct end-to-end communication established.
              </span>
            </div>

            {activeMessages.map(msg => {
              if (msg.isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2.5">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/25 flex items-center gap-2 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span>{msg.text}</span>
                    </span>
                  </div>
                );
              }

              const isMe = msg.senderId === currentUser.id;
              const senderUser = isMe ? currentUser : (developers.find(d => d.id === msg.senderId) || activeConversation.participants?.find(p => p.id === msg.senderId));
              const senderDisplayName = isMe ? `${currentUser.name} (You)` : (senderUser?.name || msg.senderName || 'Developer');
              const senderAvatar = isMe ? currentUser.avatar : (senderUser?.avatar || msg.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb');
              const assignedRole = activeConversation.projectRoles?.[msg.senderId] || msg.projectRole || (activeConversation.type === 'project' ? (isMe ? 'Lead Architect' : senderUser?.role) : undefined);

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  {/* Sender Name & Assigned Project Role Badge */}
                  <div className={`flex items-center gap-1.5 mb-1 px-1 text-[11px] font-mono ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <img src={senderAvatar} alt="" className="w-4 h-4 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{senderDisplayName}</span>
                    {assignedRole && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/25">
                        {assignedRole}
                      </span>
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-md md:max-w-lg rounded-2xl p-3.5 shadow-sm space-y-2.5 ${isMe
                        ? 'bg-teal-600 text-white rounded-br-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
                      }`}
                  >
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>

                    {/* Rich Attachments: Code Snippet */}
                    {msg.attachments?.map((att, i) => {
                      if (att.type === 'code') {
                        return (
                          <div
                            key={i}
                            className="rounded-lg bg-slate-950 border border-slate-800 text-slate-200 p-3 font-mono text-[11px] overflow-hidden"
                          >
                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
                              <span className="text-[10px] text-teal-400 font-bold">{att.title}</span>
                              <button
                                type="button"
                                onClick={() => copyCode(msg.id, att.content || '')}
                                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300">
                              <code>{att.content}</code>
                            </pre>
                          </div>
                        );
                      }

                      // Rich Attachments: GitHub Repo Card
                      if (att.type === 'repo') {
                        return (
                          <a
                            key={i}
                            href={att.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-left hover:border-teal-500/50 transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-1 text-teal-400 font-mono text-xs font-semibold">
                              <Github className="w-4 h-4 text-white" />
                              <span className="truncate">{att.title}</span>
                              <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1">
                              High-concurrency network benchmarks & latency profiling
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-slate-400">
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                {att.language || 'Rust'}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <Star className="w-3 h-3 text-amber-500" /> 1.2k
                              </span>
                              <span className="flex items-center gap-0.5">
                                <GitFork className="w-3 h-3" /> 140
                              </span>
                            </div>
                          </a>
                        );
                      }

                      // Rich Attachments: Git Actions (Commit, Push, Pull, PR)
                      if (att.type === 'git_action' && att.gitAction) {
                        return (
                          <div
                            key={i}
                            className="rounded-xl bg-slate-950 border border-slate-800 text-slate-200 p-3.5 space-y-3 font-mono text-xs shadow-md"
                          >
                            {/* Action header */}
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                              <div className="flex items-center gap-2">
                                {att.gitAction.action === 'commit' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                    <GitCommit className="w-3 h-3" /> git commit
                                  </span>
                                )}
                                {att.gitAction.action === 'push' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                    <Upload className="w-3 h-3" /> git push
                                  </span>
                                )}
                                {att.gitAction.action === 'pull' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                    <Download className="w-3 h-3" /> git pull
                                  </span>
                                )}
                                {att.gitAction.action === 'pr' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                                    <GitPullRequest className="w-3 h-3" /> pull request
                                  </span>
                                )}

                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                  <GitBranch className="w-3 h-3 text-slate-500" />
                                  <span className="text-slate-300 font-semibold">{att.gitAction.branch || 'main'}</span>
                                </span>
                              </div>

                              {att.gitAction.commitHash && (
                                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-teal-400 font-bold">
                                  #{att.gitAction.commitHash}
                                </span>
                              )}
                            </div>

                            {/* Message & stats */}
                            <div>
                              <p className="text-xs font-semibold text-white leading-snug">
                                {att.gitAction.commitMessage || att.title}
                              </p>
                              {att.gitAction.filesChanged && att.gitAction.filesChanged.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] text-slate-400">
                                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                                    {att.gitAction.filesChanged.length} files changed
                                  </span>
                                  {att.gitAction.additions !== undefined && (
                                    <span className="text-emerald-400 font-bold">+{att.gitAction.additions}</span>
                                  )}
                                  {att.gitAction.deletions !== undefined && (
                                    <span className="text-rose-400 font-bold">-{att.gitAction.deletions}</span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Push Action: Pull changes */}
                            {att.gitAction.action === 'push' && (
                              <div className="pt-2 border-t border-slate-800/80">
                                {att.gitAction.isSynced ? (
                                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium py-1">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span>Synced to local workspace ✓</span>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => syncGitAction(activeConversation.id, msg.id)}
                                    icon={<Download className="w-3.5 h-3.5" />}
                                    className="text-xs w-full py-1.5 justify-center bg-teal-600 hover:bg-teal-500 text-white font-mono"
                                  >
                                    Pull Changes to Local Workspace
                                  </Button>
                                )}
                              </div>
                            )}

                            {/* Pull Action confirmation */}
                            {att.gitAction.action === 'pull' && (
                              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Branch synced with remote HEAD. Fast-forward merge complete.</span>
                              </div>
                            )}

                            {/* Pull Request Action: Merge */}
                            {att.gitAction.action === 'pr' && (
                              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  {att.gitAction.prStatus === 'merged' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Merged into main
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                      ● Open PR #{att.gitAction.prNumber || 14}
                                    </span>
                                  )}
                                </div>

                                {att.gitAction.prStatus !== 'merged' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => mergeGitPr(activeConversation.id, msg.id)}
                                    icon={<GitPullRequest className="w-3.5 h-3.5 text-purple-400" />}
                                    className="text-xs bg-purple-600 hover:bg-purple-700 text-white border-transparent font-mono"
                                  >
                                    Merge Pull Request
                                  </Button>
                                )}
                              </div>
                            )}

                            {/* Unified Git Diff Viewer Toggle */}
                            {att.gitAction.diffSnippet && (
                              <div className="pt-1.5 border-t border-slate-800/60">
                                <button
                                  type="button"
                                  onClick={() => setExpandedDiffMsgId(expandedDiffMsgId === msg.id ? null : msg.id)}
                                  className="flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 font-mono cursor-pointer transition-colors"
                                >
                                  {expandedDiffMsgId === msg.id ? (
                                    <>
                                      <ChevronUp className="w-3 h-3" /> Hide Git Diff
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-3 h-3" /> View In-Chat Diff (+/-)
                                    </>
                                  )}
                                </button>

                                {expandedDiffMsgId === msg.id && (
                                  <div className="mt-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] leading-relaxed overflow-x-auto">
                                    <pre>
                                      {att.gitAction.diffSnippet.split('\n').map((line, idx) => {
                                        let colorClass = 'text-slate-400';
                                        if (line.startsWith('+')) colorClass = 'text-emerald-400 bg-emerald-950/40 px-1 rounded-sm';
                                        else if (line.startsWith('-')) colorClass = 'text-rose-400 bg-rose-950/40 px-1 rounded-sm';
                                        else if (line.startsWith('@@')) colorClass = 'text-cyan-400 font-bold';
                                        return (
                                          <div key={idx} className={colorClass}>
                                            {line}
                                          </div>
                                        );
                                      })}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>

                  {/* Timestamp & read status */}
                  <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] font-mono text-slate-400">
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-teal-500" />}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form onSubmit={handleSend} className="space-y-2">
              <div className="flex items-center gap-2">

                {/* Attachment triggers */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Attach Code or Repo"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  {showAttachMenu && (
                    <div className="absolute bottom-10 left-0 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-20 p-1.5 animate-in fade-in zoom-in-95 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAttachMenu(false);
                          setShowRepoModal(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                      >
                        <Github className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Share GitHub Repo Link</span>
                      </button>

                      <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          setShowAttachMenu(false);
                          openRepository('alexrivera_dev/devpulse-engine');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                      >
                        <FolderGit2 className="w-3.5 h-3.5 text-teal-500" />
                        <span>Jump to Git Code Editor</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Text input */}
                <input
                  type="text"
                  placeholder={`Message ${activeConversation.participant.name}...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />

                {/* Send button */}
                <Button
                  type="submit"
                  size="md"
                  variant="primary"
                  disabled={!messageText.trim()}
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  Send
                </Button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-1">
                <span>Press Enter to send</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-teal-500" />
                  Instant Developer Simulated Sync
                </span>
              </div>
            </form>
          </div>

        </div>
      ) : null}

      {/* Repo Share Modal */}
      {showRepoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono flex items-center gap-2">
              <Github className="w-4 h-4 text-indigo-500" />
              <span>Share GitHub Repository</span>
            </h4>

            <input
              type="text"
              placeholder="Repo Name (e.g. org/repo-name)"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono"
            />

            <input
              type="text"
              placeholder="Repo URL (https://github.com/...)"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button size="sm" variant="ghost" onClick={() => setShowRepoModal(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleSendRepo}>
                Share Repo Card
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Project Role Modal */}
      {showAssignRoleModal && activeConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-teal-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
                  Assign Project Role
                </h4>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assign or change this developer's specific role for <strong>{activeConversation.projectName || activeConversation.participant.name}</strong>. The assigned role badge will appear next to all their messages in this team chat.
            </p>

            <div className="space-y-3 font-mono">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Select Developer</label>
                <select
                  value={selectedAssigneeId}
                  onChange={(e) => setSelectedAssigneeId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  {(activeConversation.participants || [currentUser, ...developers.slice(0, 3)]).map(dev => (
                    <option key={dev.id} value={dev.id}>
                      {dev.name} {dev.id === currentUser.id ? '(You)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Select New Role</label>
                <select
                  value={newRoleInput}
                  onChange={(e) => setNewRoleInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  <option value="Lead Architect & Maintainer">Lead Architect & Maintainer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Fullstack Developer">Fullstack Developer</option>
                  <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                  <option value="UI/UX & Product Designer">UI/UX & Product Designer</option>
                  <option value="AI & Machine Learning Engineer">AI & Machine Learning Engineer</option>
                  <option value="Mobile Developer">Mobile Developer</option>
                  <option value="QA & Testing Engineer">QA & Testing Engineer</option>
                  <option value="Systems & Security Engineer">Systems & Security Engineer</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button size="sm" variant="ghost" onClick={() => setShowAssignRoleModal(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleAssignRoleSubmit}
                icon={<UserCheck className="w-3.5 h-3.5" />}
              >
                Assign & Announce in Chat
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
