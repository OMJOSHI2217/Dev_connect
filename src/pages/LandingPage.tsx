import React, { useState } from 'react';
import { 
  Code2, 
  Sparkles, 
  Users2, 
  ShieldCheck, 
  GitFork, 
  FolderGit2, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  Lock, 
  Zap, 
  Laptop, 
  Search,
  Cpu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { COMPLEMENTARY_ROLE_MAP, MOCK_DEVELOPERS } from '../data/mockData';
import { RoleType } from '../types';

export const LandingPage: React.FC = () => {
  const { setCurrentView, openPublicProfile } = useApp();

  // Interactive Live Match Preview State
  const [selectedRole, setSelectedRole] = useState<RoleType>('Backend Developer');
  const [selectedLookingFor, setSelectedLookingFor] = useState<RoleType>('Frontend Developer');

  const rolesList: RoleType[] = [
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'Mobile Developer',
    'DevOps & Cloud Engineer',
    'AI & Machine Learning Engineer',
    'UI/UX & Product Designer'
  ];

  // Filter developers based on user selection in the interactive widget
  const matchingDevelopers = MOCK_DEVELOPERS.filter(
    d => d.role === selectedLookingFor
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-grid-pattern border-b border-slate-200/80 dark:border-slate-800">
        
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[400px] h-[300px] bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top pill badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-700 dark:text-teal-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-spin" />
              <span>Smart Complementary Matching Engine v1.0</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span className="hidden sm:inline text-teal-600 dark:text-teal-400 font-semibold">User-Side Only</span>
            </div>
          </div>

          {/* Hero Headlines */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Find the perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-500">collaborator</span> for your next developer project.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              DevCollab connects developers based on complementary skills, verified tech stacks, and shared project vision. Connect securely, communicate with permission, and build together.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                variant="primary"
                icon={<Sparkles className="w-4 h-4" />}
                onClick={() => setCurrentView('register')}
                className="w-full sm:w-auto shadow-lg shadow-teal-500/25"
              >
                Join DevCollab Free
              </Button>
              <Button
                size="lg"
                variant="secondary"
                icon={<Search className="w-4 h-4" />}
                onClick={() => setCurrentView('login')}
                className="w-full sm:w-auto"
              >
                Sign In to Platform
              </Button>
            </div>

            {/* Trust and privacy badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-500" />
                <span>Zero Public Contact Scraping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-teal-500" />
                <span>Dual-Opt-in Connections</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-teal-500" />
                <span>Developer-Centric UX</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Match Calculator Widget */}
          <div className="mt-14 max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-teal-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
                    Try the Complementary Matcher
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  See how DevCollab pairs your skills with the exact partners you need to ship.
                </p>
              </div>
              <Badge variant="teal" size="md">
                Live Algorithm Simulation
              </Badge>
            </div>

            {/* Role pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                  1. What is your primary role?
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => {
                    const newRole = e.target.value as RoleType;
                    setSelectedRole(newRole);
                    const suggested = COMPLEMENTARY_ROLE_MAP[newRole]?.[0] as RoleType;
                    if (suggested) setSelectedLookingFor(suggested);
                  }}
                  className="w-full rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  {rolesList.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                  2. Who are you looking for?
                </label>
                <select
                  value={selectedLookingFor}
                  onChange={(e) => setSelectedLookingFor(e.target.value as RoleType)}
                  className="w-full rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  {rolesList.filter(r => r !== selectedRole).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Simulated match results preview */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-mono text-slate-500">
                  Top compatible developers matching <strong className="text-teal-600 dark:text-teal-400">"{selectedLookingFor}"</strong>:
                </span>
                <span className="text-[11px] font-mono text-emerald-500 font-semibold">
                  {matchingDevelopers.length} available online
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingDevelopers.slice(0, 2).map(dev => (
                  <div
                    key={dev.id}
                    onClick={() => openPublicProfile(dev)}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={dev.avatar} alt={dev.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                          {dev.name}
                        </p>
                        <p className="text-[11px] font-mono text-teal-600 dark:text-teal-400 truncate">
                          {dev.specialization}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {dev.city}, {dev.country}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-[10px] font-mono font-bold block">
                        {dev.compatibilityScore}%
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 block">View</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3-Step Workflow Section */}
      <section className="py-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="teal" size="md">
              How Developers Collaborate
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              From matchmaking to production deployment
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              A structured, respectful workflow built specifically for engineering collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-mono font-bold text-base mb-4">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Discover by Complementary Stack
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Search by specific tech stacks, roles, experience, and timezone. Our matching engine highlights partners whose skills complement yours rather than compete with them.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Public profile privacy preserved</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-bold text-base mb-4">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Mutual Permissioned Connection
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Send connection requests with personalized context and project interests. Only after acceptance are full verified links, emails, and direct messaging channels unlocked.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero unsolicited spam or DMs</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-base mb-4">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Exchange Code & Ship Projects
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Create collaboration projects, link GitHub repositories, discuss architecture with syntax-highlighted snippets, and build a verified collaborative project portfolio.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified collaborator endorsements</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Built for real developer workflows
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Everything developers need to find partners and build without corporate bloat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Complementary Matchmaking
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Backend developers see Frontend & UI/UX matches. ML engineers see Fullstack & Data Engineers.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Dual Privacy Boundaries
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Public profile displays high-level skills and bio. Direct contact and deep repositories require accepted connection.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Code-Native Messaging
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Share GitHub repos with live star widgets, code snippets with syntax highlighting, and project invitations directly in chat.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Project Open Roles
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Post open collaboration spots with exact technologies needed, and apply to participate with one click.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Developer Social Proof & Stats */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">14,200+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Developers Joined</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">8,450+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Connections Formed</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">3,200+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Projects Shipped</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">100%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">User-Side Privacy</p>
            </div>
          </div>

          {/* Developer Testimonial Quote */}
          <div className="mt-14 max-w-2xl mx-auto p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <p className="text-sm italic text-slate-700 dark:text-slate-300 leading-relaxed">
              "Finding a backend engineer who actually cares about low latency and clean gRPC contracts used to take months of Reddit browsing. On DevCollab, I matched with Alex in 24 hours and we shipped our OpenTelemetry tool two weeks later."
            </p>
            <div className="flex items-center justify-center gap-3">
              <img
                src={MOCK_DEVELOPERS[0].avatar}
                alt=""
                className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-500"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Elena Rostova</p>
                <p className="text-[11px] font-mono text-teal-600 dark:text-teal-400">Frontend & WebGL Lead</p>
              </div>
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-16 text-center max-w-xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Ready to find your engineering partner?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 mb-6">
              Create your developer profile in under 2 minutes. Free and open to all builders.
            </p>
            <Button
              size="lg"
              variant="primary"
              onClick={() => setCurrentView('register')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Get Started with DevCollab
            </Button>
          </div>

        </div>
      </section>

    </div>
  );
};
