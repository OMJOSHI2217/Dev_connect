import React, { useState, useMemo } from 'react';
import { 
  FolderGit2, 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  GitPullRequest, 
  Star, 
  Users,
  X,
  History 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectCard } from '../components/common/ProjectCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { RoleType, ProjectStatus } from '../types';

export const ProjectsPage: React.FC = () => {
  const { projects, setProjectCreateModalOpen, setCurrentView, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRoleNeeded, setSelectedRoleNeeded] = useState<string>('all');

  const rolesList: RoleType[] = [
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'Mobile Developer',
    'DevOps & Cloud Engineer',
    'AI & Machine Learning Engineer',
    'UI/UX & Product Designer'
  ];

  const statusList: { id: string; label: string }[] = [
    { id: 'all', label: 'All Active' },
    { id: 'Recruiting Collaborators', label: 'Recruiting' },
    { id: 'In Active Development', label: 'In Development' },
    { id: 'Beta Testing', label: 'Beta' }
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Completed projects graduate to Project History and are removed from active projects
      if (project.status === 'Completed / Shipped') {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(q);
        const matchesTagline = project.tagline.toLowerCase().includes(q);
        const matchesDesc = project.description.toLowerCase().includes(q);
        const matchesTech = project.technologies.some(t => t.toLowerCase().includes(q));
        const matchesOwner = project.owner.name.toLowerCase().includes(q);

        if (!matchesTitle && !matchesTagline && !matchesDesc && !matchesTech && !matchesOwner) {
          return false;
        }
      }

      // Status
      if (selectedStatus !== 'all' && project.status !== selectedStatus) {
        return false;
      }

      // Role needed
      if (selectedRoleNeeded !== 'all' && !project.openRolesNeeded.includes(selectedRoleNeeded as RoleType)) {
        return false;
      }

      return true;
    });
  }, [projects, searchQuery, selectedStatus, selectedRoleNeeded]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Collaboration Projects
            </h1>
            <Badge variant="teal" size="sm">
              {filteredProjects.length} active
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Discover active engineering projects seeking specific roles and build together.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<History className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
            onClick={() => setCurrentView('project_history')}
          >
            Project History
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setProjectCreateModalOpen(true)}
          >
            Create Project
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3.5 shadow-sm">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by title, stack (e.g. Go, React, PyTorch) or maintainer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-9 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
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

        {/* Filter chips: Status and Role needed */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-medium">
          
          {/* Status chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {statusList.map(s => {
              const active = selectedStatus === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStatus(s.id)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap border ${
                    active
                      ? 'bg-teal-600 text-white border-teal-500 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Role needed filter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-slate-500">Role Needed:</span>
            <select
              value={selectedRoleNeeded}
              onChange={(e) => setSelectedRoleNeeded(e.target.value)}
              className="rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="all">Any Role</option>
              {rolesList.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderGit2 className="w-6 h-6" />}
          title="No collaboration projects match your filters"
          description="Try clearing your search query or role needed filter, or start your own open source project to invite developers."
          actionLabel="Post New Project"
          onAction={() => setProjectCreateModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map(proj => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      )}

    </div>
  );
};
