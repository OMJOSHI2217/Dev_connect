export type RoleType = 
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Fullstack Developer'
  | 'Mobile Developer'
  | 'DevOps & Cloud Engineer'
  | 'AI & Machine Learning Engineer'
  | 'UI/UX & Product Designer'
  | 'Systems & Security Engineer'
  | 'Data Engineer';

export type ExperienceLevel = 'Junior (0-2 yrs)' | 'Mid-Level (2-5 yrs)' | 'Senior (5-8 yrs)' | 'Lead / Staff (8+ yrs)';

export type Availability = 'Part-Time (10-15h/wk)' | 'Full-Time Available' | 'Weekends & Hackathons' | 'Advisory & Mentorship';

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'database' | 'ai-ml' | 'mobile' | 'design' | 'tools';
  level?: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  twitter?: string;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'connections-only';
  showExactLocation: boolean;
  showSocialLinksPublicly: boolean;
  showPhoneToConnections: boolean;
  allowProjectInvites: boolean;
  showOnlineStatus: boolean;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  avatar: string;
  role: RoleType;
  specialization: string;
  experienceLevel: ExperienceLevel;
  yearsOfExperience: number;
  bio: string;
  city: string;
  country: string;
  skills: string[];
  preferredCollaboratorRoles: RoleType[];
  availability: Availability;
  socialLinks: SocialLinks;
  privacy: PrivacySettings;
  projectsCount: number;
  connectionsCount: number;
  compatibilityScore?: number;
  joinedDate: string;
  isOnline: boolean;
  lastActive: string;
}

export type ConnectionStatus = 'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'declined';

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: User;
  toUser: User;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  projectInterest?: string;
}

export interface MessageAttachment {
  type: 'code' | 'repo' | 'file' | 'git_action';
  title: string;
  url?: string;
  language?: string;
  content?: string;
  size?: string;
  gitAction?: {
    action: 'commit' | 'push' | 'pull' | 'pr';
    branch?: string;
    commitHash?: string;
    commitMessage?: string;
    filesChanged?: string[];
    additions?: number;
    deletions?: number;
    prNumber?: number;
    prStatus?: 'open' | 'merged';
    isSynced?: boolean;
    diffSnippet?: string;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  projectRole?: string;
  text: string;
  timestamp: string;
  attachments?: MessageAttachment[];
  isRead: boolean;
  isSystem?: boolean;
}

export interface Conversation {
  id: string;
  type?: 'direct' | 'project';
  projectId?: string;
  projectName?: string;
  participantIds: string[];
  participant: User; // Other participant or project entity
  participants?: User[]; // All participants in group chat
  projectRoles?: Record<string, string>; // userId -> assigned project role
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
  projectContext?: string;
}

export type ProjectStatus = 'Recruiting Collaborators' | 'In Active Development' | 'Beta Testing' | 'Completed / Shipped';

export interface ProjectContributor {
  userId: string;
  user: User;
  role: string;
  joinedAt: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  goals: string[];
  technologies: string[];
  ownerId: string;
  owner: User;
  contributors: ProjectContributor[];
  status: ProjectStatus;
  visibility: 'public' | 'connections-only';
  githubRepo?: {
    name: string;
    url: string;
    stars: number;
    forks: number;
    openIssues: number;
    primaryLanguage: string;
  };
  openRolesNeeded: RoleType[];
  estimatedDuration: string;
  liveUrl?: string;
  createdAt: string;
  updatedAt: string;
  applicationsCount?: number;
}

export interface ProjectHistoryItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  completedDate: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  collaborators: {
    userId: string;
    name: string;
    username: string;
    avatar: string;
    role: string;
  }[];
  testimonial?: {
    author: string;
    authorRole: string;
    avatar: string;
    quote: string;
  };
  metrics?: {
    stars?: number;
    users?: string;
    commits?: number;
  };
}

export interface Notification {
  id: string;
  type: 'connection_request' | 'connection_accepted' | 'new_message' | 'project_invite' | 'project_application';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkAction?: string;
  avatar?: string;
}

export type AppView = 
  | 'landing'
  | 'login'
  | 'register'
  | 'verify_otp'
  | 'forgot_password'
  | 'reset_password'
  | 'onboarding'
  | 'dashboard'
  | 'discovery'
  | 'connections'
  | 'messages'
  | 'projects'
  | 'repositories'
  | 'repository_detail'
  | 'project_history'
  | 'profile_settings';
