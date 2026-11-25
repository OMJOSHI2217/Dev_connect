import React, { useState } from 'react';
import { 
  GitFork, 
  Star, 
  Users, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight, 
  FolderGit2,
  Globe,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { Project } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SkillTag } from '../ui/SkillTag';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { openProjectApplyModal, completeProject, openProjectChat, openRepository, currentUser } = useApp();
  const [completing, setCompleting] = useState(false);
  const [liveUrlInput, setLiveUrlInput] = useState(project.liveUrl || 'https://app-demo.devcollab.io');

  const repoSlug = project.id === 'proj_1' ? 'alexrivera_dev/devpulse-engine'
    : project.id === 'proj_2' ? 'elena_codes/neural-canvas-studio'
    : project.id === 'proj_3' ? 'marcus_cloud/cloudkube-mesh'
    : project.id === 'proj_4' ? 'david_sys/devsync-cli'
    : (project.githubRepo?.name || `${project.owner.username}/${project.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);

  const isOwner = project.ownerId === currentUser.id;
  const isCompleted = project.status === 'Completed / Shipped';

  const statusVariant = {
    'Recruiting Collaborators': 'emerald',
    'In Active Development': 'teal',
    'Beta Testing': 'indigo',
    'Completed / Shipped': 'emerald'
  } as const;

  const handleComplete = () => {
    completeProject(project.id, liveUrlInput);
    setCompleting(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header & Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                {project.title}
              </h4>
              <p className="text-xs text-slate-400 font-medium">
                Created {project.createdAt}
              </p>
            </div>
          </div>
          
          <Badge variant={statusVariant[project.status] || 'teal'} size="sm" dot>
            {project.status}
          </Badge>
        </div>

        {/* Tagline & Description */}
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 leading-relaxed">
          {project.tagline}
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Roles Needed Section */}
        {!isCompleted && project.openRolesNeeded.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs uppercase font-bold text-teal-600 dark:text-teal-400 block mb-2">
              Looking For Collaborators:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.openRolesNeeded.map((role) => (
                <span
                  key={role}
                  className="text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 5).map((tech) => (
            <SkillTag key={tech} name={tech} size="sm" />
          ))}
          {project.technologies.length > 5 && (
            <span className="text-xs text-slate-400 self-center font-semibold px-1">
              +{project.technologies.length - 5}
            </span>
          )}
        </div>

        {/* GitHub stats if present */}
        {project.githubRepo && (
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4 p-2.5 rounded-lg bg-slate-100/50 dark:bg-slate-800/40">
            <span className="text-teal-600 dark:text-teal-400 font-semibold truncate">
              {project.githubRepo.name}
            </span>
            <div className="flex items-center gap-2 ml-auto shrink-0 font-medium">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                {project.githubRepo.stars}
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5 text-slate-400" />
                {project.githubRepo.forks}
              </span>
            </div>
          </div>
        )}
        {/* Live Host URL banner if completed */}
        {project.liveUrl && (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 mb-4 text-xs">
            <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-300 font-semibold truncate">
              <Globe className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span className="truncate">Live Host: {project.liveUrl.replace(/^https?:\/\//, '')}</span>
            </div>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline shrink-0 flex items-center gap-1"
            >
              <span>Visit</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Complete project prompt for maintainer */}
        {completing && (
          <div className="mb-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-teal-500/30 space-y-2">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Ready to ship? Enter live hosted URL:
            </p>
            <input
              type="text"
              value={liveUrlInput}
              onChange={(e) => setLiveUrlInput(e.target.value)}
              placeholder="https://my-app.vercel.app"
              className="w-full text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            />
            <div className="flex items-center gap-2 pt-1">
              <Button size="sm" variant="primary" onClick={handleComplete}>
                Confirm Completed
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setCompleting(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer info & CTA */}
      <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <img
            src={project.owner.avatar}
            alt={project.owner.name}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
          />
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-800 dark:text-slate-200 truncate">
              {project.owner.name}
            </p>
            <p className="text-[10px] text-slate-400">Maintainer</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Git Repository Link */}
          <Button
            size="sm"
            variant="outline"
            icon={<FolderGit2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
            onClick={() => openRepository(repoSlug)}
            className="text-xs border-teal-500/30 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-medium"
            title="Open Git Code Repository (Browse files, branches, PRs & clone)"
          >
            Git Repo
          </Button>

          {/* Active project team chat for all developers collaborating */}
          {!isCompleted && (
            <Button
              size="sm"
              variant="outline"
              icon={<MessageSquare className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
              onClick={() => openProjectChat(project.id)}
              className="text-xs border-teal-500/30 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-medium"
              title="Open Project Workspace & Team Chat for all collaborators"
            >
              Team Chat
            </Button>
          )}

          {isOwner && !isCompleted && !completing && (
            <Button
              size="sm"
              variant="outline"
              icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              onClick={() => setCompleting(true)}
              className="text-xs"
            >
              Mark Completed
            </Button>
          )}

          {!isOwner && !isCompleted && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => openProjectApplyModal(project)}
            >
              Apply to Role
            </Button>
          )}

          {isCompleted && (
            <Badge variant="emerald" size="sm" dot>
              Completed Project
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
