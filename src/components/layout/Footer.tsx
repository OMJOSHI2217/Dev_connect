import React from 'react';
import { Code2, Github, Terminal, Heart, Shield, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView, isAuthenticated } = useApp();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-base text-slate-900 dark:text-white">
                Dev<span className="text-teal-600 dark:text-teal-400">Collab</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The developer-first collaboration network. Find complementary talent, connect safely, exchange code, and ship projects together.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-600 dark:text-teal-400 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-tracking, privacy-first platform</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button 
                  onClick={() => setCurrentView(isAuthenticated ? 'discovery' : 'landing')} 
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Discover Developers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView(isAuthenticated ? 'projects' : 'landing')} 
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Explore Projects
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView(isAuthenticated ? 'project_history' : 'landing')} 
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Collaboration History
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('landing')} 
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Developer Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Collaboration
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>Complementary Skill Matching</li>
              <li>Dual-Sided Connection Approvals</li>
              <li>GitHub Repository Previews</li>
              <li>Verified Role Portfolios</li>
              <li>Direct Encrypted Chat</li>
            </ul>
          </div>

          {/* Developer System Specs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Architecture
            </h4>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex justify-between">
                <span>Frontend:</span>
                <span className="text-teal-600 dark:text-teal-400">React + Vite + TS</span>
              </div>
              <div className="flex justify-between">
                <span>Styling:</span>
                <span className="text-teal-600 dark:text-teal-400">Tailwind CSS v3</span>
              </div>
              <div className="flex justify-between">
                <span>Icons:</span>
                <span className="text-teal-600 dark:text-teal-400">Lucide Core</span>
              </div>
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className="text-emerald-500 font-semibold">User-Side Only</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DevCollab Inc. Built for developers worldwide.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-teal-500" />
              <span>Clean Code, High Fidelity</span>
            </span>
            <span>•</span>
            <span className="text-slate-400">Strictly User-Side Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
