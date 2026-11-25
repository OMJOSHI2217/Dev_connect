import React from 'react';
import {
  History,
  CheckCircle2,
  ExternalLink,
  Github,
  Users,
  Star,
  GitCommit,
  Award,
  Sparkles,
  Quote
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SkillTag } from '../components/ui/SkillTag';

export const ProjectHistoryPage: React.FC = () => {
  const { projectHistory, openConnectedProfile, openPublicProfile, developers, currentUser } = useApp();

  const handleContributorClick = (c: { userId: string; name: string; username: string; avatar: string; role: string }) => {
    // If it's the logged-in user, open their connected profile modal
    if (c.userId === currentUser.id || c.username === currentUser.username) {
      openConnectedProfile(currentUser);
      return;
    }

    // Check if user exists in developers roster
    const dev = developers.find(d => d.id === c.userId || d.username === c.username);
    if (dev) {
      openPublicProfile(dev);
    } else {
      // Build a fallback user profile so clicking always successfully opens their profile
      const fallbackUser: User = {
        id: c.userId,
        name: c.name,
        username: c.username,
        email: `${c.username}@devcollab.io`,
        avatar: c.avatar,
        role: 'Fullstack Developer',
        specialization: 'Cloud & Full Stack Architecture',
        experienceLevel: 'Senior (5-8 yrs)',
        yearsOfExperience: 5,
        bio: `Software engineer and active collaborator on DevCollab projects.`,
        city: 'San Francisco',
        country: 'United States',
        skills: ['TypeScript', 'React', 'Node.js', 'Go', 'Docker'],
        preferredCollaboratorRoles: ['Frontend Developer', 'Backend Developer', 'DevOps & Cloud Engineer'],
        availability: 'Part-Time (10-15h/wk)',
        socialLinks: {
          github: `https://github.com/${c.username}`
        },
        privacy: {
          profileVisibility: 'public',
          showExactLocation: true,
          showSocialLinksPublicly: true,
          showPhoneToConnections: true,
          allowProjectInvites: true,
          showOnlineStatus: true
        },
        projectsCount: 1,
        connectionsCount: 8,
        joinedDate: 'January 2024',
        isOnline: true,
        lastActive: 'Just now'
      };
      openPublicProfile(fallbackUser);
    }
  };

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Collaborative Project Portfolio
          </h1>
          <Badge variant="emerald" size="sm" dot>
            Verified Shipped
          </Badge>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          A showcase of successfully completed projects built collaboratively by developers who connected on DevCollab.
        </p>
      </div>

      {/* Projects History List */}
      <div className="space-y-6">
        {projectHistory.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
          >
            {/* Top row: Title, status, date */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <Badge variant="emerald" size="sm">
                    Completed {item.completedDate}
                  </Badge>
                </div>
                <p className="text-xs font-medium text-teal-600 dark:text-teal-400 mt-1">
                  {item.tagline}
                </p>
              </div>

              {/* External Links */}
              <div className="flex items-center gap-2 shrink-0">
                {item.githubUrl && (
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-teal-500 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Repository</span>
                  </a>
                )}
                {item.liveUrl && (
                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 text-xs font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>

            {/* Description & Impact */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {item.description}
            </p>

            {/* Metrics pills if present */}
            {item.metrics && (
              <div className="flex flex-wrap items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 text-xs font-medium">
                {item.metrics.stars && (
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>{item.metrics.stars.toLocaleString()} GitHub stars</span>
                  </div>
                )}
                {item.metrics.users && (
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Award className="w-4 h-4 text-teal-500" />
                    <span>{item.metrics.users}</span>
                  </div>
                )}
                {item.metrics.commits && (
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <GitCommit className="w-4 h-4 text-indigo-500" />
                    <span>{item.metrics.commits} total commits</span>
                  </div>
                )}
              </div>
            )}

            {/* Technologies */}
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 block mb-2">
                Tech Stack Implemented:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.technologies.map(t => (
                  <SkillTag key={t} name={t} size="sm" />
                ))}
              </div>
            </div>

            {/* Collaborators Roster */}
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 block mb-2">
                Project Contributors & Roles:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {item.collaborators.map((c) => (
                  <div
                    key={c.userId}
                    onClick={() => handleContributorClick(c)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-teal-500/40 transition-colors flex items-center gap-3 cursor-pointer group"
                  >
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 truncate">
                        {c.name}
                      </p>
                      <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 truncate">
                        @{c.username}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {c.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Quote */}
            {item.testimonial && (
              <div className="p-4 rounded-xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20 flex items-start gap-3.5">
                <Quote className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs italic text-slate-700 dark:text-slate-300 leading-relaxed">
                    "{item.testimonial.quote}"
                  </p>
                  <p className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                    — {item.testimonial.author}, {item.testimonial.authorRole}
                  </p>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};
