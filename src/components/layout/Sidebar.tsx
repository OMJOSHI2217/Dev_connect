import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Users2,
  MessageSquare,
  FolderGit2,
  History,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    currentView,
    setCurrentView,
    connectionRequests,
    conversations,
    projects,
    currentUser
  } = useApp();

  // Pending incoming requests count
  const pendingRequestsCount = connectionRequests.filter(
    r => r.toUserId === currentUser.id && r.status === 'pending'
  ).length;

  // Unread messages count
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const navItems: { id: AppView; label: string; icon: React.ReactNode; badge?: number | string; highlight?: boolean }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'discovery',
      label: 'Discover Developers',
      icon: <Compass className="w-5 h-5" />,
      badge: 'Match'
    },
    {
      id: 'connections',
      label: 'Connections',
      icon: <Users2 className="w-5 h-5" />,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
      highlight: pendingRequestsCount > 0
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: <MessageSquare className="w-5 h-5" />,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      highlight: unreadMessagesCount > 0
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <FolderGit2 className="w-5 h-5" />,
      badge: projects.filter(p => p.status !== 'Completed / Shipped').length
    },
    {
      id: 'repositories',
      label: 'Repositories',
      icon: <FolderGit2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      badge: 'Git'
    },
    {
      id: 'project_history',
      label: 'Project History',
      icon: <History className="w-5 h-5" />
    }
  ];

  const handleNavClick = (viewId: AppView) => {
    setCurrentView(viewId);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 w-68 select-none">

      {/* Platform badge */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
        <div className="flex items-center justify-between p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wider">
                Matching Mode
              </p>
              <p className="text-xs text-teal-700/90 dark:text-teal-400/90 truncate font-medium">
                Complementary Filter Active
              </p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3.5 py-4 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Workspace Menu
        </p>
        {navItems.map((item) => {
          const isActive = currentView === item.id || (item.id === 'repositories' && currentView === 'repository_detail');
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group cursor-pointer ${isActive
                  ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-md shadow-teal-500/20 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400'}`}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-bold tracking-tight ${isActive
                      ? 'bg-white/20 text-white'
                      : item.highlight
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Mini Profile Footer: permanently anchored at the bottom */}
      <div className="p-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 shrink-0 mt-auto">
        <div
          onClick={() => handleNavClick('profile_settings')}
          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800/80 transition-colors cursor-pointer group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt=""
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-300 dark:ring-slate-700"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {currentUser.name}
              </p>
              <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
              {currentUser.role.split(' ')[0]}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop permanent sidebar: fixed position on scroll */}
      <aside className="hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] z-30">
        {sidebarContent}
      </aside>

      {/* Mobile drawer backdrop and content */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-68 shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
