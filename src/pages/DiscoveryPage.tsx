import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  MapPin, 
  Briefcase, 
  SlidersHorizontal, 
  X, 
  Check, 
  RefreshCw,
  Users2,
  Code
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DeveloperCard } from '../components/common/DeveloperCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { DeveloperCardSkeleton } from '../components/ui/Skeleton';
import { COMPLEMENTARY_ROLE_MAP, calculateDeveloperMatch } from '../data/mockData';
import { RoleType } from '../types';

export const DiscoveryPage: React.FC = () => {
  const { developers, currentUser, searchQuery, setSearchQuery } = useApp();

  // Filter states
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [complementaryMode, setComplementaryMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Complementary roles for currentUser
  const complementaryRoles = COMPLEMENTARY_ROLE_MAP[currentUser.role] || [];

  const rolesList: { id: string; label: string }[] = [
    { id: 'all', label: 'All Roles' },
    { id: 'Frontend Developer', label: 'Frontend' },
    { id: 'Backend Developer', label: 'Backend' },
    { id: 'Fullstack Developer', label: 'Fullstack' },
    { id: 'DevOps & Cloud Engineer', label: 'DevOps' },
    { id: 'AI & Machine Learning Engineer', label: 'AI / ML' },
    { id: 'UI/UX & Product Designer', label: 'UI/UX' },
    { id: 'Mobile Developer', label: 'Mobile' },
    { id: 'Systems & Security Engineer', label: 'Systems' },
    { id: 'Data Engineer', label: 'Data' }
  ];

  const popularSkills = [
    'React', 'TypeScript', 'Go', 'Python', 'Rust', 'Docker', 'Next.js', 
    'Kubernetes', 'Tailwind CSS', 'FastAPI', 'Figma', 'GraphQL'
  ];

  const locationsList = [
    { id: 'all', label: 'Worldwide / Remote' },
    { id: 'San Francisco', label: 'San Francisco' },
    { id: 'Berlin', label: 'Berlin' },
    { id: 'London', label: 'London' },
    { id: 'Toronto', label: 'Toronto' },
    { id: 'Bengaluru', label: 'Bengaluru' },
    { id: 'Barcelona', label: 'Barcelona' }
  ];

  // Filtering and sorting logic
  const filteredDevelopers = useMemo(() => {
    return developers.filter(dev => {
      // Exclude self
      if (dev.id === currentUser.id) return false;

      // Search query (name, username, bio, skills, city, country, role)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = dev.name.toLowerCase().includes(q);
        const matchesUsername = dev.username.toLowerCase().includes(q);
        const matchesRole = dev.role.toLowerCase().includes(q);
        const matchesBio = dev.bio.toLowerCase().includes(q);
        const matchesLocation = `${dev.city} ${dev.country}`.toLowerCase().includes(q);
        const matchesSkills = dev.skills.some(s => s.toLowerCase().includes(q));

        if (!matchesName && !matchesUsername && !matchesRole && !matchesBio && !matchesLocation && !matchesSkills) {
          return false;
        }
      }

      // Role filter
      if (selectedRole !== 'all' && dev.role !== selectedRole) {
        return false;
      }

      // Experience filter
      if (selectedExperience !== 'all') {
        if (!dev.experienceLevel.toLowerCase().includes(selectedExperience.toLowerCase())) {
          return false;
        }
      }

      // Skill filter
      if (selectedSkill !== 'all' && !dev.skills.includes(selectedSkill)) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'all' && dev.city !== selectedLocation) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const matchA = calculateDeveloperMatch(a, currentUser);
      const matchB = calculateDeveloperMatch(b, currentUser);

      if (complementaryMode) {
        // 1st Priority: Complementary Role AND Near My Location (Same city first, then country, then worldwide)
        if (matchA.matchTier !== matchB.matchTier) {
          return matchA.matchTier - matchB.matchTier;
        }
      }
      return matchB.score - matchA.score;
    });
  }, [
    developers, 
    currentUser, 
    searchQuery, 
    selectedRole, 
    selectedExperience, 
    selectedSkill, 
    selectedLocation, 
    complementaryMode, 
    complementaryRoles
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRole('all');
    setSelectedExperience('all');
    setSelectedSkill('all');
    setSelectedLocation('all');
    setComplementaryMode(true);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Complementary Mode Switch Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Discover Developers
            </h1>
            <Badge variant="teal" size="sm">
              {filteredDevelopers.length} available
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse verified developer profiles, filter by stack, and send connection requests.
          </p>
        </div>

        {/* Smart Complementary Matching Mode Toggle */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20 shrink-0">
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <Sparkles className="w-3.5 h-3.5 text-teal-500" />
              <span className="text-xs font-bold text-teal-900 dark:text-teal-200">
                1st Preference: Matching + Near My Location
              </span>
            </div>
            <p className="text-[11px] text-teal-700/80 dark:text-teal-400/80">
              Prioritizes complementary roles near {currentUser.city}, {currentUser.country}
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={complementaryMode}
              onChange={(e) => setComplementaryMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
          </label>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4 shadow-sm">
        
        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by developer name, @handle, role, specific technology (e.g. React, Go, Docker) or city..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-9 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
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

        {/* Role Filters Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {rolesList.map(r => {
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-500 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-teal-500/40'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Dropdowns: Experience, Skill, Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
          
          {/* Experience Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              Experience Level
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="all">Any Experience</option>
              <option value="Junior">Junior (0-2 yrs)</option>
              <option value="Mid">Mid-Level (2-5 yrs)</option>
              <option value="Senior">Senior (5-8 yrs)</option>
              <option value="Lead">Lead / Staff (8+ yrs)</option>
            </select>
          </div>

          {/* Skill Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              Required Skill
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="all">Any Technology</option>
              {popularSkills.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              Location / Region
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
            >
              {locationsList.map(l => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Developer Grid / Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <DeveloperCardSkeleton />
          <DeveloperCardSkeleton />
          <DeveloperCardSkeleton />
          <DeveloperCardSkeleton />
          <DeveloperCardSkeleton />
          <DeveloperCardSkeleton />
        </div>
      ) : filteredDevelopers.length === 0 ? (
        <EmptyState
          icon={<Users2 className="w-6 h-6" />}
          title="No developers match your current filters"
          description="Try broadening your search terms, clearing the required skill, or resetting the filters to explore all community members."
          actionLabel="Reset All Filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDevelopers.map(dev => (
            <DeveloperCard 
              key={dev.id} 
              developer={dev} 
              showComplementaryBadge={complementaryMode}
            />
          ))}
        </div>
      )}

    </div>
  );
};
