import React, { useState, useRef, useEffect } from 'react';
import { 
  Code2, 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  LogOut, 
  User as UserIcon, 
  Settings, 
  Menu, 
  X,
  CheckCircle2,
  Users,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

interface NavbarProps {
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle, mobileMenuOpen }) => {
  const { 
    theme, 
    toggleTheme, 
    isAuthenticated, 
    currentUser, 
    setCurrentView, 
    currentView, 
    logout,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    searchQuery,
    setSearchQuery,
    isBackendConnected
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter(n => !n.read);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <div className={`w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 ${!isAuthenticated ? 'max-w-7xl mx-auto' : ''}`}>
        
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}

          <div 
            onClick={() => setCurrentView(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-display">
                  Dev<span className="text-teal-600 dark:text-teal-400">Collab</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/25 font-semibold">
                  v1.0
                </span>
                {isAuthenticated && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1.5 font-semibold border ${
                      isBackendConnected
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                    title={isBackendConnected ? 'Connected to MySQL Backend (port 5000)' : 'MySQL Backend offline - Using local state'}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span>{isBackendConnected ? 'MySQL Live' : 'MySQL Offline'}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Search (Visible when authenticated) */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'discovery') {
                    setCurrentView('discovery');
                  }
                }}
                placeholder="Search developers by skill, role, or city... (e.g. React, Go)"
                className="w-full bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-9 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {isAuthenticated ? (
            <>
              {/* Notifications Popover */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen(prev => !prev)}
                  className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-teal-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-84 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-slate-900 dark:text-slate-100">Notifications</span>
                        {unreadNotifications.length > 0 && (
                          <span className="text-xs bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-md font-semibold">
                            {unreadNotifications.length} new
                          </span>
                        )}
                      </div>
                      {unreadNotifications.length > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-2.5">
                      {notifications.length === 0 ? (
                        <div className="text-center py-8 text-sm text-slate-500">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id);
                              if (n.linkAction) {
                                setCurrentView(n.linkAction as any);
                                setNotificationsOpen(false);
                              }
                            }}
                            className={`p-3 rounded-xl text-left transition-colors cursor-pointer flex gap-3.5 ${
                              !n.read 
                                ? 'bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/25' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            {n.avatar ? (
                              <img src={n.avatar} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0 mt-0.5" />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                                <Users className="w-5 h-5 text-slate-500" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                                {n.title}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                                {n.message}
                              </p>
                              <span className="text-xs text-slate-400 mt-1 block font-medium">
                                {n.timestamp}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(prev => !prev)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition-colors cursor-pointer"
                >
                  <span className="hidden sm:inline-block text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                    @{currentUser.username}
                  </span>
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/40"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2.5 animate-in fade-in zoom-in-95">
                    <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1.5">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</p>
                      <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 truncate">@{currentUser.username}</p>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{currentUser.role}</p>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentView('profile_settings');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>Edit Profile & Photo</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentView('profile_settings');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Privacy & Settings</span>
                    </button>

                    <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setCurrentView('login')}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentView('register')}
              >
                Get Started
              </Button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
