import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  ConnectionRequest,
  Conversation,
  Message,
  Project,
  ProjectHistoryItem,
  Notification,
  AppView,
  ConnectionStatus,
  MessageAttachment,
  RoleType
} from '../types';
import {
  CURRENT_USER,
  MOCK_DEVELOPERS,
  MOCK_CONNECTION_REQUESTS,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES_MAP,
  MOCK_PROJECTS,
  MOCK_PROJECT_HISTORY,
  MOCK_NOTIFICATIONS
} from '../data/mockData';
import { api, checkBackendHealth } from '../services/api';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // View / Routing
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Auth
  isAuthenticated: boolean;
  currentUser: User;
  pendingAuthEmail: string;
  login: (email: string) => boolean;
  register: (name: string, username: string, email: string, phone?: string) => void;
  verifyOtp: (code: string) => boolean;
  logout: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;

  // Developers & Discovery
  developers: User[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Connections
  connectionRequests: ConnectionRequest[];
  sendConnectionRequest: (toUserId: string, message?: string, projectInterest?: string) => void;
  acceptConnectionRequest: (requestId: string) => void;
  declineConnectionRequest: (requestId: string) => void;
  getConnectionStatus: (targetUserId: string) => ConnectionStatus;
  getConnectedUsers: () => User[];

  // Messaging
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  messagesMap: Record<string, Message[]>;
  sendMessage: (conversationId: string, text: string, attachments?: MessageAttachment[]) => void;
  startConversationWithUser: (targetUserId: string) => string;
  openProjectChat: (projectId: string) => void;
  assignProjectRole: (projectId: string, userId: string, newRole: string) => void;
  syncGitAction: (conversationId: string, messageId: string) => void;
  mergeGitPr: (conversationId: string, messageId: string) => void;

  // Projects
  projects: Project[];
  projectHistory: ProjectHistoryItem[];
  createProject: (newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'owner' | 'contributors'>) => void;
  completeProject: (projectId: string, liveUrl?: string) => void;
  applyToProject: (projectId: string, role: RoleType, note: string) => void;

  // Notifications & Toasts
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Modals
  publicProfileUser: User | null;
  openPublicProfile: (user: User) => void;
  closePublicProfile: () => void;

  connectedProfileUser: User | null;
  openConnectedProfile: (user: User) => void;
  closeConnectedProfile: () => void;

  sendRequestModalUser: User | null;
  openSendRequestModal: (user: User) => void;
  closeSendRequestModal: () => void;

  projectCreateModalOpen: boolean;
  setProjectCreateModalOpen: (open: boolean) => void;

  projectApplyModalProject: Project | null;
  openProjectApplyModal: (project: Project) => void;
  closeProjectApplyModal: () => void;

  // Git Repositories
  currentRepoSlug: string | null;
  setCurrentRepoSlug: (slug: string | null) => void;
  openRepository: (slug: string) => void;
  notifyPushToProjectChat: (data: {
    projectId: string;
    branch: string;
    commitHash: string;
    message: string;
    filesChanged?: string[];
    authorName?: string;
  }) => void;

  // MySQL Backend connectivity
  isBackendConnected: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('devcollab_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark'; // Developer-first default to dark mode
  });

  useEffect(() => {
    localStorage.setItem('devcollab_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Auth & View state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('devcollab_auth') === 'true';
  });
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const savedAuth = localStorage.getItem('devcollab_auth') === 'true';
    return savedAuth ? 'dashboard' : 'landing';
  });
  const [pendingAuthEmail, setPendingAuthEmail] = useState<string>('developer@devcollab.io');
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Check MySQL Backend connectivity on startup
  useEffect(() => {
    checkBackendHealth().then(health => {
      if (health?.mysqlConnected) {
        setIsBackendConnected(true);
        addToast('Connected to MySQL backend database! 🗄️', 'success');

        api.getDevelopers().then(res => {
          if (res?.developers?.length > 0) setDevelopers(res.developers);
        }).catch(() => {});

        api.getProjects().then(res => {
          if (res?.projects?.length > 0) setProjects(res.projects);
        }).catch(() => {});

        api.getProjectHistory().then(res => {
          if (res?.history?.length > 0) setProjectHistory(res.history);
        }).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  // User state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('devcollab_current_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  useEffect(() => {
    localStorage.setItem('devcollab_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const updateCurrentUser = (updates: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      // Sync profile & picture updates to MySQL backend database
      api.updateProfile(updated.id, updates).catch(err => {
        console.warn('Backend profile sync failed (local state active):', err);
      });
      return updated;
    });

    // Also keep developers state synchronized
    setDevelopers(prev => prev.map(d => d.id === currentUser.id ? { ...d, ...updates } : d));

    // If avatar was updated, keep chat message bubbles synchronized
    if (updates.avatar) {
      setMessagesMap(prev => {
        const next = { ...prev };
        for (const convId in next) {
          next[convId] = next[convId].map(m => 
            m.senderId === currentUser.id ? { ...m, senderAvatar: updates.avatar } : m
          );
        }
        return next;
      });
    }

    addToast('Profile and picture updated and saved!', 'success');
  };

  // Developers state
  const [developers, setDevelopers] = useState<User[]>(() => {
    const saved = localStorage.getItem('devcollab_developers');
    return saved ? JSON.parse(saved) : MOCK_DEVELOPERS;
  });

  useEffect(() => {
    localStorage.setItem('devcollab_developers', JSON.stringify(developers));
  }, [developers]);

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Connection Requests state
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>(() => {
    const saved = localStorage.getItem('devcollab_requests');
    return saved ? JSON.parse(saved) : MOCK_CONNECTION_REQUESTS;
  });

  useEffect(() => {
    localStorage.setItem('devcollab_requests', JSON.stringify(connectionRequests));
  }, [connectionRequests]);

  // Messages & Conversations state
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('devcollab_conversations');
    return saved ? JSON.parse(saved) : MOCK_CONVERSATIONS;
  });

  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('devcollab_messages_map');
    return saved ? JSON.parse(saved) : MOCK_MESSAGES_MAP;
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv_1');

  useEffect(() => {
    localStorage.setItem('devcollab_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('devcollab_messages_map', JSON.stringify(messagesMap));
  }, [messagesMap]);

  // Projects state
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('devcollab_projects');
    return saved ? JSON.parse(saved) : MOCK_PROJECTS;
  });

  useEffect(() => {
    localStorage.setItem('devcollab_projects', JSON.stringify(projects));
  }, [projects]);

  const [projectHistory, setProjectHistory] = useState<ProjectHistoryItem[]>(() => {
    const saved = localStorage.getItem('devcollab_project_history');
    return saved ? JSON.parse(saved) : MOCK_PROJECT_HISTORY;
  });

  useEffect(() => {
    localStorage.setItem('devcollab_project_history', JSON.stringify(projectHistory));
  }, [projectHistory]);

  // Notifications & Toasts
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('devcollab_notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  };

  // Modals state
  const [publicProfileUser, setPublicProfileUser] = useState<User | null>(null);
  const [connectedProfileUser, setConnectedProfileUser] = useState<User | null>(null);
  const [sendRequestModalUser, setSendRequestModalUser] = useState<User | null>(null);
  const [projectCreateModalOpen, setProjectCreateModalOpen] = useState<boolean>(false);
  const [projectApplyModalProject, setProjectApplyModalProject] = useState<Project | null>(null);

  // Git Repository state
  const [currentRepoSlug, setCurrentRepoSlug] = useState<string | null>(() => {
    return localStorage.getItem('devcollab_current_repo_slug') || 'alexrivera_dev/devpulse-engine';
  });

  const openRepository = (slug: string) => {
    setCurrentRepoSlug(slug);
    localStorage.setItem('devcollab_current_repo_slug', slug);
    setCurrentView('repository_detail');
  };

  const openPublicProfile = (user: User) => {
    const status = getConnectionStatus(user.id);
    if (status === 'accepted') {
      setConnectedProfileUser(user);
    } else {
      setPublicProfileUser(user);
    }
  };

  const closePublicProfile = () => setPublicProfileUser(null);

  const openConnectedProfile = (user: User) => setConnectedProfileUser(user);
  const closeConnectedProfile = () => setConnectedProfileUser(null);

  const openSendRequestModal = (user: User) => {
    setPublicProfileUser(null);
    setSendRequestModalUser(user);
  };
  const closeSendRequestModal = () => setSendRequestModalUser(null);

  const openProjectApplyModal = (project: Project) => setProjectApplyModalProject(project);
  const closeProjectApplyModal = () => setProjectApplyModalProject(null);

  // Connection management
  const getConnectionStatus = (targetUserId: string): ConnectionStatus => {
    if (targetUserId === currentUser.id) return 'none';

    // Check received
    const received = connectionRequests.find(r => r.fromUserId === targetUserId && r.toUserId === currentUser.id);
    if (received) {
      if (received.status === 'pending') return 'pending_received';
      if (received.status === 'accepted') return 'accepted';
      // When declined, return to normal flow ('none') so user can connect again in the future
      if (received.status === 'declined') return 'none';
    }

    // Check sent
    const sent = connectionRequests.find(r => r.fromUserId === currentUser.id && r.toUserId === targetUserId);
    if (sent) {
      if (sent.status === 'pending') return 'pending_sent';
      if (sent.status === 'accepted') return 'accepted';
      // When declined, return to normal flow ('none') so user can connect again in the future
      if (sent.status === 'declined') return 'none';
    }

    return 'none';
  };

  const getConnectedUsers = (): User[] => {
    const acceptedRequests = connectionRequests.filter(r =>
      r.status === 'accepted' && (r.fromUserId === currentUser.id || r.toUserId === currentUser.id)
    );

    const connectedUserIds = acceptedRequests.map(r =>
      r.fromUserId === currentUser.id ? r.toUserId : r.fromUserId
    );

    return developers.filter(dev => connectedUserIds.includes(dev.id));
  };

  const sendConnectionRequest = (toUserId: string, message?: string, projectInterest?: string) => {
    const targetUser = developers.find(d => d.id === toUserId);
    if (!targetUser) return;

    // Check existing request
    const existing = connectionRequests.find(r => 
      (r.fromUserId === currentUser.id && r.toUserId === toUserId) ||
      (r.fromUserId === toUserId && r.toUserId === currentUser.id)
    );

    if (existing) {
      if (existing.status === 'pending') {
        addToast('Connection request is already pending.', 'warning');
        return;
      }
      if (existing.status === 'accepted') {
        addToast('You are already connected with this developer.', 'info');
        return;
      }
      // If previous request was declined, clear it to return to normal flow and allow new request
      setConnectionRequests(prev => prev.filter(r => r.id !== existing.id));
    }

    const newReq: ConnectionRequest = {
      id: `req_${Date.now()}`,
      fromUserId: currentUser.id,
      toUserId: toUserId,
      fromUser: currentUser,
      toUser: targetUser,
      message: message || `Hi ${targetUser.name}, I would love to connect and discuss developer collaboration!`,
      status: 'pending',
      createdAt: 'Just now',
      projectInterest
    };

    setConnectionRequests(prev => [newReq, ...prev]);

    // Sync to backend if available
    api.sendConnectionRequest({
      fromUserId: currentUser.id,
      toUserId,
      message: newReq.message,
      projectInterest
    }).catch(err => console.warn('Backend sendConnectionRequest sync error:', err));

    addToast(`Connection request sent to ${targetUser.name}!`, 'success');
  };

  const acceptConnectionRequest = (requestId: string) => {
    let acceptedUser: User | null = null;

    setConnectionRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        acceptedUser = req.fromUserId === currentUser.id ? req.toUser : req.fromUser;
        return { ...req, status: 'accepted' };
      }
      return req;
    }));

    if (acceptedUser) {
      const partner = acceptedUser as User;
      setCurrentUser(prev => ({ ...prev, connectionsCount: prev.connectionsCount + 1 }));
      addToast(`Connected with ${partner.name}! You can now message and collaborate.`, 'success');

      const notif: Notification = {
        id: `notif_${Date.now()}`,
        type: 'connection_accepted',
        title: 'Connection Accepted',
        message: `You and ${partner.name} are now connected.`,
        timestamp: 'Just now',
        read: false,
        linkAction: 'messages',
        avatar: partner.avatar
      };
      setNotifications(prev => [notif, ...prev]);

      const existingConv = conversations.find(c => c.participantIds.includes(partner.id));
      if (!existingConv) {
        const newConv: Conversation = {
          id: `conv_${Date.now()}`,
          participantIds: [currentUser.id, partner.id],
          participant: partner,
          lastMessage: {
            id: `msg_${Date.now()}`,
            conversationId: `conv_${Date.now()}`,
            senderId: partner.id,
            text: `Connection accepted! Looking forward to collaborating.`,
            timestamp: 'Just now',
            isRead: false
          },
          unreadCount: 1,
          updatedAt: 'Just now'
        };
        setConversations(prev => [newConv, ...prev]);
        setMessagesMap(prev => ({
          ...prev,
          [newConv.id]: [newConv.lastMessage!]
        }));
      }
    }
  };

  const declineConnectionRequest = (requestId: string) => {
    setConnectionRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'declined' };
      }
      return req;
    }));

    // Sync to backend
    api.updateConnectionRequest(requestId, 'declined').catch(err => 
      console.warn('Backend declineConnectionRequest error:', err)
    );

    addToast('Connection request declined. Returned to normal flow.', 'info');
  };

  // Messaging actions
  const startConversationWithUser = (targetUserId: string): string => {
    const existing = conversations.find(c => c.participantIds.includes(targetUserId));
    if (existing) {
      setActiveConversationId(existing.id);
      setCurrentView('messages');
      return existing.id;
    }

    const partner = developers.find(d => d.id === targetUserId);
    if (!partner) return '';

    const newConvId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: newConvId,
      participantIds: [currentUser.id, partner.id],
      participant: partner,
      unreadCount: 0,
      updatedAt: 'Just now'
    };

    setConversations(prev => [newConv, ...prev]);
    setMessagesMap(prev => ({
      ...prev,
      [newConvId]: []
    }));
    setActiveConversationId(newConvId);
    setCurrentView('messages');
    addToast(`Conversation started with ${partner.name}`, 'info');
    return newConvId;
  };

  const sendMessage = (conversationId: string, text: string, attachments?: MessageAttachment[]) => {
    if (!text.trim() && (!attachments || attachments.length === 0)) return;

    const targetConv = conversations.find(c => c.id === conversationId);
    const assignedRole = targetConv?.projectRoles?.[currentUser.id] || (targetConv?.type === 'project' ? 'Lead Architect' : undefined);

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      projectRole: assignedRole,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments,
      isRead: true
    };

    setMessagesMap(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));

    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: newMessage,
          updatedAt: 'Just now'
        };
      }
      return c;
    }));

    // Simulate smart developer auto-reply for direct 1-on-1 chats
    if (targetConv && targetConv.type !== 'project') {
      const recipient = targetConv.participant;
      setTimeout(() => {
        const replyResponses = [
          `Thanks for sending that over! I just inspected the architecture and it aligns really well with what we need.`,
          `Great point. Let me pull the branch down and test the Docker container locally.`,
          `Looks solid! I'll review the pull request and post comments on GitHub shortly.`,
          `Awesome! Let's schedule a 20-min sync call to review the API endpoints.`
        ];
        const randomReply = replyResponses[Math.floor(Math.random() * replyResponses.length)];

        const autoReplyMsg: Message = {
          id: `msg_reply_${Date.now()}`,
          conversationId,
          senderId: recipient.id,
          senderName: recipient.name,
          senderAvatar: recipient.avatar,
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false
        };

        setMessagesMap(mPrev => ({
          ...mPrev,
          [conversationId]: [...(mPrev[conversationId] || []), autoReplyMsg]
        }));

        setConversations(cPrev => cPrev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: autoReplyMsg,
              unreadCount: conv.id === activeConversationId ? 0 : conv.unreadCount + 1,
              updatedAt: 'Just now'
            };
          }
          return conv;
        }));
      }, 2500);
    }
  };

  const openProjectChat = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const convId = `conv_proj_${project.id}`;
    let existing = conversations.find(c => c.id === convId || (c.type === 'project' && c.projectId === project.id));

    if (!existing) {
      const allMembers = [
        project.owner,
        ...project.contributors.map(c => c.user).filter(Boolean)
      ];
      const uniqueMembers = Array.from(new Map(allMembers.map(m => [m.id, m])).values());

      const initialRoles: Record<string, string> = {
        [project.ownerId]: 'Lead Architect & Maintainer'
      };
      project.contributors.forEach(c => {
        initialRoles[c.userId] = c.role;
      });

      existing = {
        id: convId,
        type: 'project',
        projectId: project.id,
        projectName: project.title,
        participantIds: uniqueMembers.map(m => m.id),
        participant: {
          ...project.owner,
          name: project.title,
          role: project.owner.role
        },
        participants: uniqueMembers,
        projectRoles: initialRoles,
        unreadCount: 0,
        updatedAt: 'Just now',
        projectContext: project.title
      };

      setConversations(prev => [existing!, ...prev]);

      if (!messagesMap[convId]) {
        setMessagesMap(prev => ({
          ...prev,
          [convId]: [
            {
              id: `msg_init_${Date.now()}`,
              conversationId: convId,
              senderId: 'system',
              senderName: 'DevCollab Project Automation',
              text: `🚀 Project Team Channel created for "${project.title}". ${uniqueMembers.length} active developers collaborating.`,
              timestamp: 'Just now',
              isRead: true,
              isSystem: true
            }
          ]
        }));
      }
    }

    setActiveConversationId(existing.id);
    setCurrentView('messages');
    addToast(`Opened Team Workspace for "${project.title}"`, 'info');
  };

  const assignProjectRole = (projectId: string, userId: string, newRole: string) => {
    const convId = `conv_proj_${projectId}`;
    const targetUser = developers.find(d => d.id === userId) || (userId === currentUser.id ? currentUser : null);

    setConversations(prev => prev.map(c => {
      if (c.projectId === projectId || c.id === convId) {
        return {
          ...c,
          projectRoles: {
            ...(c.projectRoles || {}),
            [userId]: newRole
          }
        };
      }
      return c;
    }));

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          contributors: p.contributors.map(contrib => {
            if (contrib.userId === userId) {
              return { ...contrib, role: newRole };
            }
            return contrib;
          })
        };
      }
      return p;
    }));

    if (targetUser) {
      const announcementMsg: Message = {
        id: `msg_role_${Date.now()}`,
        conversationId: convId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        projectRole: 'Maintainer',
        text: `📢 ${currentUser.name} assigned ${targetUser.name} to project role: "${newRole}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
        isSystem: true
      };

      setMessagesMap(prev => ({
        ...prev,
        [convId]: [...(prev[convId] || []), announcementMsg]
      }));

      addToast(`Assigned ${targetUser.name} as "${newRole}"! ✓`, 'success');
    }
  };

  const syncGitAction = (conversationId: string, messageId: string) => {
    setMessagesMap(prev => {
      const list = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: list.map(m => {
          if (m.id === messageId && m.attachments) {
            return {
              ...m,
              attachments: m.attachments.map(att => {
                if (att.gitAction) {
                  return {
                    ...att,
                    gitAction: {
                      ...att.gitAction,
                      isSynced: true
                    }
                  };
                }
                return att;
              })
            };
          }
          return m;
        })
      };
    });
    addToast('Git Pull: Pulled changes from remote into your workspace! ✓', 'success');
  };

  const mergeGitPr = (conversationId: string, messageId: string) => {
    setMessagesMap(prev => {
      const list = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: list.map(m => {
          if (m.id === messageId && m.attachments) {
            return {
              ...m,
              attachments: m.attachments.map(att => {
                if (att.gitAction) {
                  return {
                    ...att,
                    gitAction: {
                      ...att.gitAction,
                      prStatus: 'merged'
                    }
                  };
                }
                return att;
              })
            };
          }
          return m;
        })
      };
    });
    addToast('Git: Pull Request merged successfully into main branch! 🔀', 'success');
  };

  const notifyPushToProjectChat = (data: {
    projectId: string;
    branch: string;
    commitHash: string;
    message: string;
    filesChanged?: string[];
    authorName?: string;
  }) => {
    const convId = `conv_proj_${data.projectId}`;
    const targetConv = conversations.find(c => c.id === convId || (c.type === 'project' && c.projectId === data.projectId));

    const shortHash = (data.commitHash || 'latest').substring(0, 7);
    const authorName = data.authorName || currentUser.name;

    const attachment: MessageAttachment = {
      type: 'git_action',
      title: `Git Push [${data.branch}]`,
      gitAction: {
        action: 'push',
        branch: data.branch,
        commitHash: shortHash,
        commitMessage: data.message,
        filesChanged: data.filesChanged || [],
        isSynced: false
      }
    };

    const newPushMsg: Message = {
      id: `msg_git_${Date.now()}`,
      conversationId: targetConv?.id || convId,
      senderId: currentUser.id,
      senderName: authorName,
      senderAvatar: currentUser.avatar,
      projectRole: targetConv?.projectRoles?.[currentUser.id] || 'Contributor',
      text: `🚀 [Git Push] ${authorName} pushed code to ${data.branch}: "${data.message}"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: [attachment],
      isRead: false
    };

    if (!targetConv) {
      const proj = projects.find(p => p.id === data.projectId);
      const projTitle = proj?.title || 'Project Workspace';
      const newConv: Conversation = {
        id: convId,
        type: 'project',
        projectId: data.projectId,
        projectName: projTitle,
        participantIds: [currentUser.id],
        participant: {
          id: 'proj_bot',
          name: projTitle,
          avatar: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=250',
          role: 'Team Workspace',
          isOnline: true
        } as any,
        lastMessage: newPushMsg,
        unreadCount: 1,
        updatedAt: 'Just now'
      };
      setConversations(prev => [newConv, ...prev]);
      setMessagesMap(prev => ({
        ...prev,
        [convId]: [newPushMsg]
      }));
    } else {
      setMessagesMap(prev => ({
        ...prev,
        [targetConv.id]: [...(prev[targetConv.id] || []), newPushMsg]
      }));

      setConversations(prev => prev.map(c => {
        if (c.id === targetConv.id) {
          return {
            ...c,
            lastMessage: newPushMsg,
            unreadCount: c.id === activeConversationId ? 0 : c.unreadCount + 1,
            updatedAt: 'Just now'
          };
        }
        return c;
      }));
    }
  };

  // Projects actions
  const createProject = (newProjectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'owner' | 'contributors'>) => {
    const newProj: Project = {
      ...newProjectData,
      id: `proj_${Date.now()}`,
      ownerId: currentUser.id,
      owner: currentUser,
      contributors: [
        {
          userId: currentUser.id,
          user: currentUser,
          role: 'Project Lead',
          joinedAt: 'Just now'
        }
      ],
      createdAt: 'Today',
      updatedAt: 'Just now',
      applicationsCount: 0
    };

    setProjects(prev => [newProj, ...prev]);
    setCurrentUser(prev => ({ ...prev, projectsCount: prev.projectsCount + 1 }));
    addToast(`Project "${newProj.title}" created successfully!`, 'success');
  };

  const completeProject = async (projectId: string, liveUrl?: string) => {
    let completedProj: Project | null = null;
    const finalUrl = liveUrl?.trim() || 'https://shipped-app.devcollab.io';

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        completedProj = {
          ...p,
          status: 'Completed / Shipped',
          liveUrl: finalUrl,
          updatedAt: 'Just now'
        };
        return completedProj;
      }
      return p;
    }));

    // Find and add to projectHistory locally immediately for snappy responsiveness
    const target = projects.find(p => p.id === projectId);
    if (target) {
      const historyItem: ProjectHistoryItem = {
        id: `hist_${target.id}_${Date.now()}`,
        title: target.title,
        tagline: target.tagline,
        description: target.description,
        completedDate: 'Today',
        liveUrl: finalUrl,
        githubUrl: target.githubRepo?.url || 'https://github.com/alexrivera-dev',
        technologies: target.technologies,
        collaborators: target.contributors.map(c => ({
          userId: c.userId,
          name: c.user?.name || currentUser.name,
          username: c.user?.username || currentUser.username,
          avatar: c.user?.avatar || currentUser.avatar,
          role: c.role
        })),
        metrics: {
          stars: target.githubRepo?.stars || 150,
          users: 'Live in Production',
          commits: 48
        }
      };
      setProjectHistory(prev => [historyItem, ...prev.filter(h => h.title !== target.title)]);
      addToast(`🎉 Project "${target.title}" is now Completed & live!`, 'success');
    }

    // Persist to MySQL database backend so refresh retains completed status!
    try {
      await api.completeProject(projectId, finalUrl);
      const [histRes, projRes] = await Promise.all([
        api.getProjectHistory(),
        api.getProjects()
      ]);
      if (histRes?.history?.length > 0) setProjectHistory(histRes.history);
      if (projRes?.projects?.length > 0) setProjects(projRes.projects);
    } catch (err) {
      console.warn('Backend completeProject sync failed:', err);
    }
  };

  const applyToProject = (projectId: string, role: RoleType, note: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          applicationsCount: (p.applicationsCount || 0) + 1
        };
      }
      return p;
    }));
    addToast(`Application for ${role} submitted to project maintainers!`, 'success');
  };

  // Auth methods
  const login = (email: string): boolean => {
    setIsAuthenticated(true);
    localStorage.setItem('devcollab_auth', 'true');
    setCurrentView('dashboard');
    addToast(`Welcome back, ${currentUser.name}!`, 'success');
    return true;
  };

  const register = (name: string, username: string, email: string, phone?: string) => {
    setPendingAuthEmail(email);
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
    setCurrentUser(prev => ({
      ...prev,
      name,
      username: cleanUsername,
      email,
      phone: phone || prev.phone
    }));

    // Register user into MySQL database
    api.register({
      name,
      username: cleanUsername,
      email,
      phone: phone || currentUser.phone,
      avatar: currentUser.avatar,
      role: currentUser.role
    }).catch(err => {
      console.warn('Backend registration sync (local state active):', err);
    });

    setCurrentView('verify_otp');
    addToast('Verification OTP code sent to ' + email, 'info');
  };

  // User requirement: after registration and OTP verification, it goes to LOGIN page!
  const verifyOtp = (code: string): boolean => {
    if (code.length === 6) {
      setCurrentView('login');
      addToast('Account email & mobile number verified! Please sign in with your credentials.', 'success');
      return true;
    }
    addToast('Please enter a valid 6-digit verification code.', 'error');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('devcollab_auth');
    setCurrentView('landing');
    addToast('You have been logged out.', 'info');
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      currentView,
      setCurrentView,
      isAuthenticated,
      currentUser,
      pendingAuthEmail,
      login,
      register,
      verifyOtp,
      logout,
      updateCurrentUser,
      developers,
      searchQuery,
      setSearchQuery,
      connectionRequests,
      sendConnectionRequest,
      acceptConnectionRequest,
      declineConnectionRequest,
      getConnectionStatus,
      getConnectedUsers,
      conversations,
      activeConversationId,
      setActiveConversationId,
      messagesMap,
      sendMessage,
      startConversationWithUser,
      syncGitAction,
      mergeGitPr,
      openProjectChat,
      assignProjectRole,
      projects,
      projectHistory,
      createProject,
      completeProject,
      applyToProject,
      notifications,
      markNotificationRead,
      clearAllNotifications,
      toasts,
      addToast,
      removeToast,
      publicProfileUser,
      openPublicProfile,
      closePublicProfile,
      connectedProfileUser,
      openConnectedProfile,
      closeConnectedProfile,
      sendRequestModalUser,
      openSendRequestModal,
      closeSendRequestModal,
      projectCreateModalOpen,
      setProjectCreateModalOpen,
      projectApplyModalProject,
      openProjectApplyModal,
      closeProjectApplyModal,
      currentRepoSlug,
      setCurrentRepoSlug,
      openRepository,
      notifyPushToProjectChat,
      isBackendConnected
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
