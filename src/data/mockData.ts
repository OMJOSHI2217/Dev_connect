import { User, ConnectionRequest, Conversation, Project, ProjectHistoryItem, Notification } from '../types';

export const CURRENT_USER: User = {
  id: 'user_current',
  name: 'Alex Rivera',
  username: 'alexrivera_dev',
  email: 'alex.rivera@devcollab.io',
  phone: '+1 (415) 892-3490',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  role: 'Backend Developer',
  specialization: 'Distributed Systems & High-Throughput APIs',
  experienceLevel: 'Senior (5-8 yrs)',
  yearsOfExperience: 6,
  bio: 'Passionate about building scalable backend services, microservices architecture, and real-time streaming pipelines. Currently looking to partner with skilled Frontend and UI/UX developers to build open-source developer tooling.',
  city: 'San Francisco',
  country: 'United States',
  skills: ['Go', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis', 'GraphQL', 'gRPC', 'AWS'],
  preferredCollaboratorRoles: ['Frontend Developer', 'UI/UX & Product Designer', 'DevOps & Cloud Engineer'],
  availability: 'Part-Time (10-15h/wk)',
  socialLinks: {
    github: 'https://github.com/alexrivera-dev',
    linkedin: 'https://linkedin.com/in/alexrivera-dev',
    portfolio: 'https://alexrivera.dev',
    twitter: 'https://x.com/alexrivera_code'
  },
  privacy: {
    profileVisibility: 'public',
    showExactLocation: true,
    showSocialLinksPublicly: true,
    showPhoneToConnections: true,
    allowProjectInvites: true,
    showOnlineStatus: true
  },
  projectsCount: 8,
  connectionsCount: 14,
  joinedDate: 'January 2024',
  isOnline: true,
  lastActive: 'Just now'
};

export const MOCK_DEVELOPERS: User[] = [
  {
    id: 'user_1',
    name: 'Elena Rostova',
    username: 'elena_codes',
    email: 'elena.rostova@example.com',
    phone: '+49 30 5683 9281',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    role: 'Frontend Developer',
    specialization: 'Interactive 3D WebGL & Modern React Architectures',
    experienceLevel: 'Senior (5-8 yrs)',
    yearsOfExperience: 5,
    bio: 'Crafting responsive, tactile, and performant web interfaces. Big fan of WebGL, Tailwind, and React Server Components. Seeking backend partners to ship ambitious SaaS tools.',
    city: 'San Francisco',
    country: 'United States',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Three.js', 'WebGL', 'Zustand', 'Vite'],
    preferredCollaboratorRoles: ['Backend Developer', 'DevOps & Cloud Engineer', 'AI & Machine Learning Engineer'],
    availability: 'Part-Time (10-15h/wk)',
    socialLinks: {
      github: 'https://github.com/elena-codes',
      linkedin: 'https://linkedin.com/in/elenarostova',
      portfolio: 'https://elena.design-code.io'
    },
    privacy: {
      profileVisibility: 'public',
      showExactLocation: true,
      showSocialLinksPublicly: false,
      showPhoneToConnections: true,
      allowProjectInvites: true,
      showOnlineStatus: true
    },
    projectsCount: 12,
    connectionsCount: 42,
    compatibilityScore: 99,
    joinedDate: 'March 2023',
    isOnline: true,
    lastActive: 'Online'
  },
  {
    id: 'user_2',
    name: 'Sofia Martinez',
    username: 'sofia_ux',
    email: 'sofia.design@example.com',
    phone: '+34 93 412 8790',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    role: 'UI/UX & Product Designer',
    specialization: 'Design Systems, Micro-interactions & Developer Ergonomics',
    experienceLevel: 'Mid-Level (2-5 yrs)',
    yearsOfExperience: 4,
    bio: 'I turn complex technical workflows into dead-simple, accessible, delightful developer experiences. Proficient in Figma, Design Tokens, and writing production Tailwind code.',
    city: 'Barcelona',
    country: 'Spain',
    skills: ['Figma', 'Design Systems', 'Tailwind CSS', 'UI Prototyping', 'User Research', 'HTML/CSS', 'Storybook'],
    preferredCollaboratorRoles: ['Frontend Developer', 'Fullstack Developer', 'Backend Developer'],
    availability: 'Weekends & Hackathons',
    socialLinks: {
      github: 'https://github.com/sofia-martinez-ux',
      linkedin: 'https://linkedin.com/in/sofiamartinez',
      portfolio: 'https://sofia.work'
    },
    privacy: {
      profileVisibility: 'public',
      showExactLocation: true,
      showSocialLinksPublicly: true,
      showPhoneToConnections: true,
      allowProjectInvites: true,
      showOnlineStatus: true
    },
    projectsCount: 7,
    connectionsCount: 29,
    compatibilityScore: 94,
    joinedDate: 'August 2023',
    isOnline: true,
    lastActive: '5m ago'
  },
  {
    id: 'user_3',
    name: 'Priya Sharma',
    username: 'priya_ml',
    email: 'priya.sharma@example.com',
    phone: '+91 98450 12894',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    role: 'AI & Machine Learning Engineer',
    specialization: 'LLM Fine-tuning, RAG Architecture & Vector Search',
    experienceLevel: 'Senior (5-8 yrs)',
    yearsOfExperience: 6,
    bio: 'Deep learning researcher turned AI builder. Focused on lightweight fine-tuning, latency-optimized inference, and semantic retrieval agents. Excited to pair with developers building AI-driven products.',
    city: 'Bengaluru',
    country: 'India',
    skills: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'Hugging Face', 'Vector DBs (Qdrant)', 'Docker', 'CUDA'],
    preferredCollaboratorRoles: ['Fullstack Developer', 'Frontend Developer', 'Backend Developer'],
    availability: 'Part-Time (10-15h/wk)',
    socialLinks: {
      github: 'https://github.com/priyasharma-ai',
      linkedin: 'https://linkedin.com/in/priyasharma-ml',
      portfolio: 'https://priya-ml.dev'
    },
    privacy: {
      profileVisibility: 'public',
      showExactLocation: true,
      showSocialLinksPublicly: false,
      showPhoneToConnections: false,
      allowProjectInvites: true,
      showOnlineStatus: false
    },
    projectsCount: 9,
    connectionsCount: 38,
    compatibilityScore: 91,
    joinedDate: 'May 2023',
    isOnline: false,
    lastActive: '2 hours ago'
  },
  {
    id: 'user_4',
    name: 'Marcus Chen',
    username: 'marcus_cloud',
    email: 'marcus.chen@example.com',
    phone: '+1 (416) 728-9102',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    role: 'DevOps & Cloud Engineer',
    specialization: 'Infrastructure as Code, Kubernetes & Zero-Trust CI/CD',
    experienceLevel: 'Senior (5-8 yrs)',
    yearsOfExperience: 7,
    bio: 'Automating everything between `git push` and production. Dedicated to self-healing clusters, multi-region failovers, and cost-efficient cloud setups.',
    city: 'Toronto',
    country: 'Canada',
    skills: ['Kubernetes', 'Terraform', 'AWS', 'GitHub Actions', 'Prometheus', 'Grafana', 'Go', 'Linux', 'Helm'],
    preferredCollaboratorRoles: ['Backend Developer', 'Systems & Security Engineer', 'Fullstack Developer'],
    availability: 'Part-Time (10-15h/wk)',
    socialLinks: {
      github: 'https://github.com/marcuschen-ops',
      linkedin: 'https://linkedin.com/in/marcus-chen-cloud'
    },
    privacy: {
      profileVisibility: 'public',
      showExactLocation: true,
      showSocialLinksPublicly: true,
      showPhoneToConnections: true,
      allowProjectInvites: true,
      showOnlineStatus: true
    },
    projectsCount: 15,
    connectionsCount: 56,
    compatibilityScore: 89,
    joinedDate: 'February 2023',
    isOnline: true,
    lastActive: 'Online'
  },
  {
    id: 'user_5',
    name: 'Liam O’Connor',
    username: 'liam_mobile',
    email: 'liam.mobile@example.com',
    phone: '+353 1 496 0192',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    role: 'Mobile Developer',
    specialization: 'Cross-Platform React Native & Native Swift iOS',
    experienceLevel: 'Mid-Level (2-5 yrs)',
    yearsOfExperience: 3,
    bio: 'Building fluid mobile experiences with 60 FPS gesture animations. Looking for backend wizards who can expose clean, lightning-fast GraphQL or REST endpoints.',
    city: 'Dublin',
    country: 'Ireland',
    skills: ['React Native', 'Swift', 'iOS', 'TypeScript', 'Expo', 'GraphQL', 'Tailwind', 'App Store Deploy'],
    preferredCollaboratorRoles: ['Backend Developer', 'UI/UX & Product Designer'],
    availability: 'Weekends & Hackathons',
    socialLinks: {
      github: 'https://github.com/liam-mobile-dev',
      portfolio: 'https://liamdev.app'
    },
    privacy: {
      profileVisibility: 'public',
      showExactLocation: true,
      showSocialLinksPublicly: true,
      showPhoneToConnections: true,
      allowProjectInvites: true,
      showOnlineStatus: false
    },
    projectsCount: 5,
    connectionsCount: 22,
    compatibilityScore: 88,
    joinedDate: 'September 2023',
    isOnline: false,
    lastActive: 'Yesterday'
  },
  {
    id: 'user_6',
    name: 'David Kim',
    username: 'david_sys',
    email: 'david.kim@example.com',
    phone: '+1 (206) 555-0198',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    role: 'Systems & Security Engineer',
    specialization: 'Rust, High-Concurrency Network Daemons & Cryptography',
    experienceLevel: 'Lead / Staff (8+ yrs)',
    yearsOfExperience: 9,
    bio: 'Low-level systems enthusiast. Profiling CPU cache misses, asynchronous I/O with Tokio, and building privacy-preserving peer-to-peer protocols.',
    city: 'Seattle',
    country: 'United States',
    skills: ['Rust', 'C++', 'Linux Kernel', 'Tokio', 'WebAssembly', 'Cryptography', 'Go', 'Docker'],
    preferredCollaboratorRoles: ['Frontend Developer', 'DevOps & Cloud Engineer'],
    availability: 'Advisory & Mentorship',
    socialLinks: {
      github: 'https://github.com/davidkim-sys',
      linkedin: 'https://linkedin.com/in/davidkim-systems'
    },
    privacy: {
      profileVisibility: 'public',
      showExactLocation: false,
      showSocialLinksPublicly: false,
      showPhoneToConnections: false,
      allowProjectInvites: false,
      showOnlineStatus: true
    },
    projectsCount: 18,
    connectionsCount: 65,
    compatibilityScore: 78,
    joinedDate: 'November 2022',
    isOnline: true,
    lastActive: 'Online'
  },
  {
    id: 'user_7',
    name: 'Aisha Diallo',
    username: 'aisha_fullstack',
    email: 'aisha.diallo@example.com',
    phone: '+44 20 7946 0912',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=250',
    role: 'Fullstack Developer',
    specialization: 'Next.js 14, Supabase & Distributed Edge Functions',
    experienceLevel: 'Mid-Level (2-5 yrs)',
    yearsOfExperience: 4,
    bio: 'Jack of all trades with a bias for shipping quickly. Love hacking on open source, developer productivity tools, and real-time collaboration engines.',
    city: 'London',
    country: 'United Kingdom',
    skills: ['TypeScript', 'Next.js', 'React', 'Node.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Redis'],
    preferredCollaboratorRoles: ['UI/UX & Product Designer', 'Mobile Developer', 'DevOps & Cloud Engineer'],
    availability: 'Part-Time (10-15h/wk)',
    socialLinks: {
      github: 'https://github.com/aishadiallo',
      portfolio: 'https://aishafullstack.com'
    },
    privacy: {
      profileVisibility: 'public',
      showExactLocation: true,
      showSocialLinksPublicly: true,
      showPhoneToConnections: true,
      allowProjectInvites: true,
      showOnlineStatus: true
    },
    projectsCount: 11,
    connectionsCount: 34,
    compatibilityScore: 92,
    joinedDate: 'April 2023',
    isOnline: true,
    lastActive: 'Online'
  },
  {
    id: 'user_8',
    name: 'Maya Patel',
    username: 'maya_creative_dev',
    email: 'maya.patel@example.com',
    phone: '+1 (512) 670-3841',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    role: 'Frontend Developer',
    specialization: 'Data Visualizations, Svelte & Canvas Interactions',
    experienceLevel: 'Junior (0-2 yrs)',
    yearsOfExperience: 2,
    bio: 'Passionate about creative coding, charts, interactive analytics dashboards and typography. Always eager to learn, pair-program, and contribute to cool web experiments.',
    city: 'Austin',
    country: 'United States',
    skills: ['SvelteKit', 'D3.js', 'React', 'JavaScript', 'Tailwind CSS', 'SVG Animations', 'Chart.js'],
    preferredCollaboratorRoles: ['Backend Developer', 'Data Engineer'],
    availability: 'Full-Time Available',
    socialLinks: {
      github: 'https://github.com/mayapatel-dev',
      linkedin: 'https://linkedin.com/in/mayapatel-creative'
    },
    privacy: {
      profileVisibility: 'public',
      showExactLocation: true,
      showSocialLinksPublicly: true,
      showPhoneToConnections: true,
      allowProjectInvites: true,
      showOnlineStatus: false
    },
    projectsCount: 4,
    connectionsCount: 16,
    compatibilityScore: 85,
    joinedDate: 'December 2023',
    isOnline: false,
    lastActive: '3 hours ago'
  },
  {
    id: 'user_9',
    name: 'Lucas Silva',
    username: 'lucas_data',
    email: 'lucas.silva@example.com',
    phone: '+55 11 98123-4567',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    role: 'Data Engineer',
    specialization: 'Streaming Pipelines, Apache Kafka & Lakehouse Architecture',
    experienceLevel: 'Senior (5-8 yrs)',
    yearsOfExperience: 7,
    bio: 'Architecting batch and streaming data foundations. Looking for AI/ML engineers and Fullstack devs to turn raw data lakes into interactive intelligence dashboards.',
    city: 'São Paulo',
    country: 'Brazil',
    skills: ['Python', 'Apache Kafka', 'Apache Spark', 'SQL', 'Snowflake', 'dbt', 'Airflow', 'GCP'],
    preferredCollaboratorRoles: ['AI & Machine Learning Engineer', 'Backend Developer', 'Frontend Developer'],
    availability: 'Part-Time (10-15h/wk)',
    socialLinks: {
      github: 'https://github.com/lucassilva-data'
    },
    privacy: {
      profileVisibility: 'public',
      showExactLocation: true,
      showSocialLinksPublicly: false,
      showPhoneToConnections: false,
      allowProjectInvites: true,
      showOnlineStatus: false
    },
    projectsCount: 6,
    connectionsCount: 25,
    compatibilityScore: 81,
    joinedDate: 'June 2023',
    isOnline: false,
    lastActive: '1 day ago'
  }
];

export const MOCK_CONNECTION_REQUESTS: ConnectionRequest[] = [
  {
    id: 'req_rec_1',
    fromUserId: 'user_1',
    toUserId: 'user_current',
    fromUser: MOCK_DEVELOPERS[0],
    toUser: CURRENT_USER,
    message: 'Hey Alex! I saw your work on distributed Go systems. I am building a real-time collaborative canvas with WebGL and need a strong backend partner for the WebSocket sync layer. Would love to collaborate!',
    status: 'pending',
    createdAt: '2 hours ago',
    projectInterest: 'Real-time Canvas Sync'
  },
  {
    id: 'req_rec_2',
    fromUserId: 'user_3',
    toUserId: 'user_current',
    fromUser: MOCK_DEVELOPERS[2],
    toUser: CURRENT_USER,
    message: 'Hi Alex, loved your GitHub repository on high-throughput microservices. I am working on an LLM-assisted code review engine and we need someone with your backend and Redis caching experience.',
    status: 'pending',
    createdAt: 'Yesterday',
    projectInterest: 'AI Code Reviewer Engine'
  },
  {
    id: 'req_sent_1',
    fromUserId: 'user_current',
    toUserId: 'user_4',
    fromUser: CURRENT_USER,
    toUser: MOCK_DEVELOPERS[3],
    message: 'Hi Marcus, would love to connect and chat about automated CI/CD for our open-source telemetry engine.',
    status: 'pending',
    createdAt: '3 days ago',
    projectInterest: 'Telemetry Cloud Infra'
  },
  {
    id: 'req_acc_1',
    fromUserId: 'user_2',
    toUserId: 'user_current',
    fromUser: MOCK_DEVELOPERS[1],
    toUser: CURRENT_USER,
    message: 'Accepted your invitation! Looking forward to designing the design system together.',
    status: 'accepted',
    createdAt: '1 week ago'
  },
  {
    id: 'req_acc_2',
    fromUserId: 'user_6',
    toUserId: 'user_current',
    fromUser: MOCK_DEVELOPERS[5],
    toUser: CURRENT_USER,
    message: 'Connected. Let us discuss Rust and Go interop whenever you are ready.',
    status: 'accepted',
    createdAt: '2 weeks ago'
  },
  {
    id: 'req_dec_1',
    fromUserId: 'user_current',
    toUserId: 'user_5',
    fromUser: CURRENT_USER,
    toUser: MOCK_DEVELOPERS[4],
    status: 'declined',
    createdAt: '1 month ago'
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_proj_1',
    type: 'project',
    projectId: 'proj_1',
    projectName: 'DevPulse Telemetry Engine',
    participantIds: ['user_current', 'user_2', 'user_4', 'user_1'],
    participant: {
      ...CURRENT_USER,
      name: 'DevPulse Telemetry Engine',
      role: CURRENT_USER.role,
      avatar: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=250',
      isOnline: true
    },
    participants: [CURRENT_USER, MOCK_DEVELOPERS[1], MOCK_DEVELOPERS[3], MOCK_DEVELOPERS[0]],
    projectRoles: {
      'user_current': 'Lead Architect & Maintainer',
      'user_2': 'UI/UX & Product Designer',
      'user_4': 'DevOps & Cloud Engineer',
      'user_1': 'Frontend Developer'
    },
    lastMessage: {
      id: 'msg_proj_4',
      conversationId: 'conv_proj_1',
      senderId: 'user_2',
      senderName: 'Sofia Patel',
      projectRole: 'UI/UX & Product Designer',
      text: 'Updated the WebSockets telemetry dashboard mocks in Figma. Ready for the frontend team to inspect!',
      timestamp: '2:15 PM',
      isRead: false
    },
    unreadCount: 2,
    updatedAt: '2:15 PM',
    projectContext: 'DevPulse Telemetry Engine'
  },
  {
    id: 'conv_1',
    participantIds: ['user_current', 'user_2'],
    participant: MOCK_DEVELOPERS[1],
    lastMessage: {
      id: 'msg_1_6',
      conversationId: 'conv_1',
      senderId: 'user_2',
      text: 'I also submitted Pull Request #14 against main. You can review and merge it right here without leaving chat.',
      timestamp: '1:10 PM',
      isRead: false,
      attachments: [
        {
          type: 'git_action',
          title: 'PR #14: Dynamic Theme Tokens & Accent System',
          gitAction: {
            action: 'pr',
            branch: 'feature/theme-tokens',
            prNumber: 14,
            prStatus: 'open',
            commitMessage: 'Dynamic Theme Tokens & High-Contrast Dark Accents'
          }
        }
      ]
    },
    unreadCount: 1,
    updatedAt: '1:10 PM',
    projectContext: 'DevCollab Design System'
  },
  {
    id: 'conv_2',
    participantIds: ['user_current', 'user_6'],
    participant: MOCK_DEVELOPERS[5],
    lastMessage: {
      id: 'msg_2_3',
      conversationId: 'conv_2',
      senderId: 'user_6',
      text: 'Here is the Rust benchmarking repository with memory profiling charts. We achieved 420,000 req/sec over TCP.',
      timestamp: 'Yesterday',
      isRead: true,
      attachments: [
        {
          type: 'repo',
          title: 'davidkim-sys/turbo-tcp-bench',
          url: 'https://github.com/davidkim-sys/turbo-tcp-bench',
          language: 'Rust'
        }
      ]
    },
    unreadCount: 0,
    updatedAt: 'Yesterday',
    projectContext: 'High-Concurrency Benchmark'
  }
];

export const MOCK_MESSAGES_MAP: Record<string, import('../types').Message[]> = {
  'conv_proj_1': [
    {
      id: 'msg_proj_init',
      conversationId: 'conv_proj_1',
      senderId: 'system',
      senderName: 'DevCollab Project Automation',
      text: '🚀 Project Team Channel created for "DevPulse Telemetry Engine". 4 active developers collaborating.',
      timestamp: 'Yesterday',
      isRead: true,
      isSystem: true
    },
    {
      id: 'msg_proj_1',
      conversationId: 'conv_proj_1',
      senderId: 'user_current',
      senderName: 'Alex Rivera',
      projectRole: 'Lead Architect & Maintainer',
      text: 'Welcome to the DevPulse team chat! Sofia is leading UI/UX, Marcus is on DevOps/Cloud Kubernetes setup, and Elena is building the React WebGL visualizer.',
      timestamp: 'Yesterday, 4:00 PM',
      isRead: true
    },
    {
      id: 'msg_proj_2',
      conversationId: 'conv_proj_1',
      senderId: 'user_4',
      senderName: 'Marcus Chen',
      projectRole: 'DevOps & Cloud Engineer',
      text: 'Hey team! The eBPF kernel probes and ClickHouse distributed storage instance are successfully running on our staging cluster.',
      timestamp: 'Yesterday, 4:15 PM',
      isRead: true
    },
    {
      id: 'msg_proj_3',
      conversationId: 'conv_proj_1',
      senderId: 'user_1',
      senderName: 'Elena Rostova',
      projectRole: 'Frontend Developer',
      text: 'I started wiring up the WebGL canvas for trace node topologies. The telemetry pipeline benchmarks look super responsive!',
      timestamp: '1:30 PM',
      isRead: true
    },
    {
      id: 'msg_proj_4',
      conversationId: 'conv_proj_1',
      senderId: 'user_2',
      senderName: 'Sofia Patel',
      projectRole: 'UI/UX & Product Designer',
      text: 'Updated the WebSockets telemetry dashboard mocks in Figma. Ready for the frontend team to inspect!',
      timestamp: '2:15 PM',
      isRead: false
    }
  ],
  'conv_1': [
    {
      id: 'msg_1_1',
      conversationId: 'conv_1',
      senderId: 'user_current',
      text: 'Hey Sofia! Excited to collaborate on the UI component library for developer workspaces.',
      timestamp: '10:15 AM',
      isRead: true
    },
    {
      id: 'msg_1_2',
      conversationId: 'conv_1',
      senderId: 'user_2',
      text: 'Hey Alex! Glad we connected. I have drafted the wireframes for the collaboration dashboard and discovery cards.',
      timestamp: '10:20 AM',
      isRead: true
    },
    {
      id: 'msg_1_3',
      conversationId: 'conv_1',
      senderId: 'user_current',
      text: 'Awesome! Did you set up the Tailwind color variables for both dark and light mode?',
      timestamp: '11:05 AM',
      isRead: true
    },
    {
      id: 'msg_1_4',
      conversationId: 'conv_1',
      senderId: 'user_2',
      text: 'I just finished the Figma tokens for the dark theme! Check out this component structure when you have 5 minutes.',
      timestamp: '12:42 PM',
      isRead: false,
      attachments: [
        {
          type: 'code',
          title: 'themeTokens.config.ts',
          language: 'typescript',
          content: `export const brandTokens = {
  emerald: {
    500: '#0d9488',
    glow: 'rgba(13, 148, 136, 0.25)'
  },
  surface: {
    dark: '#020617',
    glass: 'rgba(15, 23, 42, 0.75)'
  }
};`
        }
      ]
    },
    {
      id: 'msg_1_5',
      conversationId: 'conv_1',
      senderId: 'user_2',
      text: 'Pushed the design system tokens to our shared repo! You can pull & sync the branch directly to your workspace below:',
      timestamp: '1:05 PM',
      isRead: true,
      attachments: [
        {
          type: 'git_action',
          title: 'Git Push origin/feature/theme-tokens',
          gitAction: {
            action: 'push',
            branch: 'feature/theme-tokens',
            commitHash: '7b4e91f',
            commitMessage: 'feat(tokens): add dark/light theme tokens and neon accents',
            filesChanged: ['src/styles/theme.ts', 'src/components/Badge.tsx', 'tailwind.config.js'],
            additions: 48,
            deletions: 12,
            isSynced: false,
            diffSnippet: `@@ -12,4 +12,12 @@ export const colors = {
-  primary: '#059669',
+  primary: '#0d9488',
+  secondary: '#6366f1',
+  accent: '#14b8a6',
+  backgroundDark: '#0b0f19',
+  surfaceDark: '#111827'`
          }
        }
      ]
    },
    {
      id: 'msg_1_6',
      conversationId: 'conv_1',
      senderId: 'user_2',
      text: 'I also submitted Pull Request #14 against main. You can review and merge it right here without leaving chat.',
      timestamp: '1:10 PM',
      isRead: false,
      attachments: [
        {
          type: 'git_action',
          title: 'PR #14: Dynamic Theme Tokens & Accent System',
          gitAction: {
            action: 'pr',
            branch: 'feature/theme-tokens',
            prNumber: 14,
            prStatus: 'open',
            commitMessage: 'Dynamic Theme Tokens & High-Contrast Dark Accents',
            filesChanged: ['src/styles/theme.ts', 'src/components/Badge.tsx', 'src/types/index.ts'],
            additions: 112,
            deletions: 24,
            diffSnippet: `@@ -1,6 +1,18 @@
+// DevCollab Theme Tokens
+export interface ThemeColors {
+  primary: string;
+  secondary: string;
+  darkSurface: string;
+}
+export const defaultTokens: ThemeColors = {
+  primary: '#0d9488',
+  secondary: '#6366f1',
+  darkSurface: '#0b0f19',
+};`
          }
        }
      ]
    }
  ],
  'conv_2': [
    {
      id: 'msg_2_1',
      conversationId: 'conv_2',
      senderId: 'user_current',
      text: 'Hi David, how did the Zero-Copy buffer tests go on the Linux server?',
      timestamp: 'Nov 18, 4:10 PM',
      isRead: true
    },
    {
      id: 'msg_2_2',
      conversationId: 'conv_2',
      senderId: 'user_6',
      text: 'We saw an 80% decrease in context switches by leveraging io_uring. The benchmarks are looking very promising.',
      timestamp: 'Nov 18, 5:30 PM',
      isRead: true
    },
    {
      id: 'msg_2_3',
      conversationId: 'conv_2',
      senderId: 'user_6',
      text: 'Here is the Rust benchmarking repository with memory profiling charts. We achieved 420,000 req/sec over TCP.',
      timestamp: 'Yesterday',
      isRead: true,
      attachments: [
        {
          type: 'repo',
          title: 'davidkim-sys/turbo-tcp-bench',
          url: 'https://github.com/davidkim-sys/turbo-tcp-bench',
          language: 'Rust'
        }
      ]
    }
  ]
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    title: 'DevPulse Telemetry Engine',
    tagline: 'Lightweight, eBPF-powered real-time service observability for local dev and cloud clusters.',
    description: 'DevPulse is a high-performance open-source telemetry engine designed to inspect microservice network calls, database queries, and distributed latency traces with near-zero overhead.',
    goals: [
      'Build eBPF kernel probes for Linux HTTP/gRPC traffic',
      'Create an intuitive real-time trace visualizer in React + WebGL',
      'Support OpenTelemetry export protocols and local docker-compose setups'
    ],
    technologies: ['Go', 'eBPF', 'React', 'TypeScript', 'WebSockets', 'ClickHouse', 'Docker'],
    ownerId: 'user_current',
    owner: CURRENT_USER,
    contributors: [
      {
        userId: 'user_current',
        user: CURRENT_USER,
        role: 'Lead Architect & Maintainer',
        joinedAt: 'Jan 2024'
      },
      {
        userId: 'user_2',
        user: MOCK_DEVELOPERS[1],
        role: 'UI/UX & Product Designer',
        joinedAt: 'Feb 2024'
      },
      {
        userId: 'user_4',
        user: MOCK_DEVELOPERS[3],
        role: 'DevOps & Cloud Engineer',
        joinedAt: 'Feb 2024'
      },
      {
        userId: 'user_1',
        user: MOCK_DEVELOPERS[0],
        role: 'Frontend Developer',
        joinedAt: 'Mar 2024'
      }
    ],
    status: 'In Active Development',
    visibility: 'public',
    githubRepo: {
      name: 'devcollab-community/devpulse-engine',
      url: 'https://github.com/devcollab-community/devpulse-engine',
      stars: 342,
      forks: 48,
      openIssues: 12,
      primaryLanguage: 'Go'
    },
    openRolesNeeded: ['Frontend Developer', 'DevOps & Cloud Engineer'],
    estimatedDuration: '3-4 months',
    createdAt: 'Jan 15, 2024',
    updatedAt: '2 days ago',
    applicationsCount: 4
  },
  {
    id: 'proj_2',
    title: 'NeuralCanvas Studio',
    tagline: 'Collaborative infinite canvas for visual AI prompt engineering and model pipelines.',
    description: 'A shared visual studio where developers and ML engineers can chain prompts, test multi-modal models, compare latent embeddings, and export production TypeScript SDK code.',
    goals: [
      'Multi-user real-time canvas with CRDT synchronization',
      'Pluggable model execution nodes for OpenAI, Claude, and local Ollama',
      'Exportable pipeline definitions in JSON and Python'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'Python', 'Yjs', 'PyTorch'],
    ownerId: 'user_1',
    owner: MOCK_DEVELOPERS[0],
    contributors: [
      {
        userId: 'user_1',
        user: MOCK_DEVELOPERS[0],
        role: 'Frontend & Canvas Lead',
        joinedAt: 'Feb 2024'
      },
      {
        userId: 'user_3',
        user: MOCK_DEVELOPERS[2],
        role: 'AI Model Integration',
        joinedAt: 'Mar 2024'
      }
    ],
    status: 'Recruiting Collaborators',
    visibility: 'public',
    githubRepo: {
      name: 'elena-codes/neural-canvas-studio',
      url: 'https://github.com/elena-codes/neural-canvas-studio',
      stars: 819,
      forks: 92,
      openIssues: 19,
      primaryLanguage: 'TypeScript'
    },
    openRolesNeeded: ['Backend Developer', 'UI/UX & Product Designer'],
    estimatedDuration: '2 months',
    createdAt: 'Feb 10, 2024',
    updatedAt: 'Yesterday',
    applicationsCount: 7
  },
  {
    id: 'proj_3',
    title: 'CloudKube Zero-Trust Mesh',
    tagline: 'Automated mTLS and ephemeral identity management for hybrid multi-cloud Kubernetes clusters.',
    description: 'Simplifies service-to-service encryption by issuing ephemeral SPIFFE/SPIRE certificates with zero manual YAML overhead and automated Envoy proxy sidecar injection.',
    goals: [
      'Automatic rotation of 1-hour certificates with hardware security module support',
      'Web-based audit log viewer for compliance and connection graph',
      'Single-command Helm install with zero downtime migration'
    ],
    technologies: ['Kubernetes', 'Go', 'Envoy', 'Terraform', 'Prometheus', 'React'],
    ownerId: 'user_4',
    owner: MOCK_DEVELOPERS[3],
    contributors: [
      {
        userId: 'user_4',
        user: MOCK_DEVELOPERS[3],
        role: 'Infrastructure Architect',
        joinedAt: 'Dec 2023'
      }
    ],
    status: 'Recruiting Collaborators',
    visibility: 'public',
    githubRepo: {
      name: 'marcuschen-ops/cloudkube-mesh',
      url: 'https://github.com/marcuschen-ops/cloudkube-mesh',
      stars: 512,
      forks: 64,
      openIssues: 8,
      primaryLanguage: 'Go'
    },
    openRolesNeeded: ['Backend Developer', 'Systems & Security Engineer', 'Frontend Developer'],
    estimatedDuration: '4 months',
    createdAt: 'Dec 20, 2023',
    updatedAt: '3 days ago',
    applicationsCount: 3
  },
  {
    id: 'proj_4',
    title: 'DevSync CLI & Live Pair Coding',
    tagline: 'Terminal-native pair programming tool with bidirectional AST syntax diffing.',
    description: 'Enables developers to share interactive code buffers securely through SSH tunnels with vim and VS Code keybinding fidelity, zero lag, and optional audio whisper channels.',
    goals: [
      'Sub-15ms peer-to-peer data channel via WebRTC & UDP',
      'Tree-sitter powered syntax aware conflict resolution',
      'Clean CLI client in Rust with zero runtime dependencies'
    ],
    technologies: ['Rust', 'WebRTC', 'Tree-sitter', 'Tokio', 'SQLite'],
    ownerId: 'user_6',
    owner: MOCK_DEVELOPERS[5],
    contributors: [
      {
        userId: 'user_6',
        user: MOCK_DEVELOPERS[5],
        role: 'Core Systems Maintainer',
        joinedAt: 'Oct 2023'
      }
    ],
    status: 'In Active Development',
    visibility: 'public',
    githubRepo: {
      name: 'davidkim-sys/devsync-cli',
      url: 'https://github.com/davidkim-sys/devsync-cli',
      stars: 1240,
      forks: 140,
      openIssues: 24,
      primaryLanguage: 'Rust'
    },
    openRolesNeeded: ['Frontend Developer', 'UI/UX & Product Designer'],
    estimatedDuration: '3 months',
    createdAt: 'Oct 04, 2023',
    updatedAt: '5 days ago',
    applicationsCount: 6
  }
];

export const MOCK_PROJECT_HISTORY: ProjectHistoryItem[] = [
  {
    id: 'hist_1',
    title: 'StreamSQL: Distributed Query Engine',
    tagline: 'SQL engine for real-time Kafka streams with sliding window aggregations.',
    description: 'Built during an open-source collaboration sprint between 3 developers who met on DevCollab. We implemented a vectorized query engine running on Apache Arrow format that benchmarks 4x faster than existing alternatives.',
    completedDate: 'November 2023',
    liveUrl: 'https://streamsql.demo.devcollab.io',
    githubUrl: 'https://github.com/devcollab-community/streamsql',
    technologies: ['Go', 'Apache Arrow', 'Kafka', 'React', 'Tailwind CSS'],
    collaborators: [
      {
        userId: 'user_current',
        name: 'Alex Rivera',
        username: 'alexrivera_dev',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        role: 'Storage Engine & Raft Consensus'
      },
      {
        userId: 'user_1',
        name: 'Elena Rostova',
        username: 'elena_codes',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
        role: 'Web Query Playground UI'
      },
      {
        userId: 'user_4',
        name: 'Marcus Chen',
        username: 'marcus_cloud',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        role: 'Kubernetes Helm & Benchmark Harness'
      }
    ],
    testimonial: {
      author: 'Elena Rostova',
      authorRole: 'Frontend Architect',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
      quote: 'Alex’s API design made integration a breeze. We shipped our MVP 2 weeks ahead of our hackathon deadline!'
    },
    metrics: {
      stars: 1850,
      users: '12k+ downloads',
      commits: 248
    }
  },
  {
    id: 'hist_2',
    title: 'PromptForge: Local LLM Testbench',
    tagline: 'Developer tool to run automated regression tests against local LLM endpoints.',
    description: 'An open-source regression testing harness for local language model pipelines. Provides assertions for hallucinations, latency bounds, and semantic drift across version upgrades.',
    completedDate: 'September 2023',
    liveUrl: 'https://promptforge.dev',
    githubUrl: 'https://github.com/devcollab-community/promptforge',
    technologies: ['Python', 'FastAPI', 'Next.js', 'PostgreSQL', 'Docker'],
    collaborators: [
      {
        userId: 'user_current',
        name: 'Alex Rivera',
        username: 'alexrivera_dev',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        role: 'FastAPI Service & Worker Queues'
      },
      {
        userId: 'user_3',
        name: 'Priya Sharma',
        username: 'priya_ml',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
        role: 'Semantic Evaluation Metrics'
      }
    ],
    testimonial: {
      author: 'Priya Sharma',
      authorRole: 'AI Research Engineer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      quote: 'Partnering on DevCollab unlocked a project I had parked for 6 months. High engineering standards and super reliable communication.'
    },
    metrics: {
      stars: 920,
      users: '3.5k devs',
      commits: 165
    }
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    type: 'connection_request',
    title: 'New Connection Request',
    message: 'Elena Rostova wants to connect with you regarding Real-time Canvas Sync.',
    timestamp: '2 hours ago',
    read: false,
    linkAction: 'connections',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'notif_2',
    type: 'new_message',
    title: 'New message from Sofia Martinez',
    message: 'I just finished the Figma tokens for the dark theme!',
    timestamp: '12:42 PM',
    read: false,
    linkAction: 'messages',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'notif_3',
    type: 'connection_accepted',
    title: 'Request Accepted',
    message: 'David Kim accepted your connection request.',
    timestamp: '2 weeks ago',
    read: true,
    linkAction: 'connections',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250'
  }
];

export const COMPLEMENTARY_ROLE_MAP: Record<string, string[]> = {
  'Backend Developer': ['Frontend Developer', 'UI/UX & Product Designer', 'DevOps & Cloud Engineer'],
  'Frontend Developer': ['Backend Developer', 'UI/UX & Product Designer', 'AI & Machine Learning Engineer'],
  'Fullstack Developer': ['UI/UX & Product Designer', 'DevOps & Cloud Engineer', 'Mobile Developer'],
  'Mobile Developer': ['Backend Developer', 'UI/UX & Product Designer'],
  'DevOps & Cloud Engineer': ['Backend Developer', 'Systems & Security Engineer', 'Fullstack Developer'],
  'AI & Machine Learning Engineer': ['Fullstack Developer', 'Backend Developer', 'Frontend Developer'],
  'UI/UX & Product Designer': ['Frontend Developer', 'Fullstack Developer', 'Mobile Developer'],
  'Systems & Security Engineer': ['DevOps & Cloud Engineer', 'Backend Developer'],
  'Data Engineer': ['AI & Machine Learning Engineer', 'Backend Developer', 'Frontend Developer']
};

/**
 * Intelligent Matchmaking Algorithm
 * Priority #1: Complementary Skill / Role Match WITH Nearby Location (same city or same country).
 * Priority #2: Complementary Skill / Role Match (other locations).
 * Priority #3: Nearby developers with mutual stack.
 * Priority #4: General community.
 */
export function calculateDeveloperMatch(dev: User, currentUser: User) {
  const complementaryRoles = COMPLEMENTARY_ROLE_MAP[currentUser.role] || [];
  const isComplementary = complementaryRoles.includes(dev.role);

  const isSameCity = Boolean(
    dev.city && currentUser.city &&
    dev.city.trim().toLowerCase() === currentUser.city.trim().toLowerCase()
  );
  const isSameCountry = Boolean(
    dev.country && currentUser.country &&
    dev.country.trim().toLowerCase() === currentUser.country.trim().toLowerCase()
  );
  const isNearby = isSameCity || isSameCountry;

  // Composite scoring system
  let calculatedScore = 70;
  let matchTier = 5;

  if (isComplementary && isSameCity) {
    calculatedScore = 99; // Top Local Complementary Partner!
    matchTier = 1;
  } else if (isComplementary && isSameCountry) {
    calculatedScore = 96; // Country Complementary Partner
    matchTier = 2;
  } else if (isComplementary) {
    calculatedScore = 92; // Worldwide Complementary Partner
    matchTier = 3;
  } else if (isSameCity) {
    calculatedScore = 86; // Local peer
    matchTier = 4;
  } else if (isSameCountry) {
    calculatedScore = 80;
    matchTier = 4;
  }

  // Bonus for reciprocal collaborator preferences
  if (dev.preferredCollaboratorRoles?.includes(currentUser.role)) {
    calculatedScore = Math.min(99, calculatedScore + 2);
  }

  // Bonus for mutual stack
  const sharedSkills = dev.skills.filter(s => currentUser.skills.includes(s));
  if (sharedSkills.length > 0) {
    calculatedScore = Math.min(99, calculatedScore + Math.min(2, sharedSkills.length));
  }

  return {
    score: calculatedScore,
    isComplementary,
    isNearby,
    isSameCity,
    isSameCountry,
    matchTier,
    badgeLabel: (isComplementary && isSameCity)
      ? `Top Local Match • ${dev.city}`
      : (isComplementary && isSameCountry)
        ? `Nearby Partner • ${dev.country}`
        : isComplementary
          ? 'Complementary Match'
          : isSameCity
            ? `Local in ${dev.city}`
            : undefined
  };
}
