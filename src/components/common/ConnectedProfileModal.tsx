import React from 'react';
import { 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  MessageSquare, 
  FolderPlus, 
  Github, 
  Linkedin, 
  Globe, 
  Mail, 
  Phone,
  ShieldCheck,
  Star,
  Sparkles,
  GitCommit
} from 'lucide-react';
import { User } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SkillTag } from '../ui/SkillTag';

export const ConnectedProfileModal: React.FC = () => {
  const { 
    connectedProfileUser, 
    closeConnectedProfile, 
    startConversationWithUser,
    projects,
    openProjectApplyModal 
  } = useApp();

  if (!connectedProfileUser) return null;

  // Safe normalized user object (handles camelCase or snake_case without crashing)
  const user = {
    ...connectedProfileUser,
    experienceLevel: connectedProfileUser.experienceLevel || (connectedProfileUser as any).experience_level || 'Senior (5-8 yrs)',
    yearsOfExperience: connectedProfileUser.yearsOfExperience || (connectedProfileUser as any).years_of_experience || 5,
    availability: connectedProfileUser.availability || 'Part-Time (10-15h/wk)',
    skills: connectedProfileUser.skills || ['TypeScript', 'React', 'Node.js'],
    preferredCollaboratorRoles: connectedProfileUser.preferredCollaboratorRoles || (connectedProfileUser as any).preferred_collaborator_roles || ['Frontend Developer', 'Backend Developer'],
    socialLinks: connectedProfileUser.socialLinks || (connectedProfileUser as any).social_links || {},
    city: connectedProfileUser.city || 'San Francisco',
    country: connectedProfileUser.country || 'United States'
  };

  // Find collaborative projects owned by or featuring this connected user
  const userProjects = (projects || []).filter(
    p => p.ownerId === user.id || p.contributors?.some(c => c.userId === user.id)
  );

  return (
    <Modal
      isOpen={Boolean(connectedProfileUser)}
      onClose={closeConnectedProfile}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <span className="text-sm uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold">
            Connected Developer
          </span>
          <Badge variant="teal" size="sm" dot>
            Full Access Unlocked
          </Badge>
        </div>
      }
    >
      <div className="space-y-6">
        
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/25">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-18 h-18 rounded-2xl object-cover ring-2 ring-teal-500 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {user.name}
                </h3>
                <ShieldCheck className="w-5 h-5 text-teal-500" />
              </div>
              <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                @{user.username}
              </p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
                {user.role} • {user.yearsOfExperience} years experience
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              icon={<MessageSquare className="w-4 h-4" />}
              onClick={() => {
                closeConnectedProfile();
                startConversationWithUser(user.id);
              }}
              className="flex-1 sm:flex-initial"
            >
              Start Conversation
            </Button>
          </div>
        </div>

        {/* Unlocked Contact & Social Links (Including Mobile Number!) */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Direct Developer Channels
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            
            {/* Email */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-slate-800 dark:text-slate-200">
              <Mail className="w-4 h-4 text-teal-500 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>

            {/* Mobile / Phone Number */}
            {user.phone && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-slate-800 dark:text-slate-200">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate">{user.phone}</span>
                <Badge variant="emerald" size="sm" className="ml-auto">
                  Mobile
                </Badge>
              </div>
            )}

            {/* GitHub */}
            {user.socialLinks?.github && (
              <a
                href={user.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-slate-800 dark:text-slate-200 hover:border-teal-500 transition-colors"
              >
                <Github className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{user.socialLinks.github.replace('https://', '')}</span>
              </a>
            )}

            {/* LinkedIn */}
            {user.socialLinks?.linkedin && (
              <a
                href={user.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-slate-800 dark:text-slate-200 hover:border-teal-500 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate">{user.socialLinks.linkedin.replace('https://', '')}</span>
              </a>
            )}

            {/* Portfolio */}
            {user.socialLinks?.portfolio && (
              <a
                href={user.socialLinks.portfolio}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-slate-800 dark:text-slate-200 hover:border-teal-500 transition-colors"
              >
                <Globe className="w-4 h-4 text-teal-500 shrink-0" />
                <span className="truncate">{user.socialLinks.portfolio.replace('https://', '')}</span>
              </a>
            )}
          </div>
        </div>

        {/* Bio & Collaboration Specs */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Biography & Collaboration Terms
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            {user.bio}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>Availability: <strong className="text-teal-600 dark:text-teal-400 font-semibold">{user.availability}</strong></span>
            <span>•</span>
            <span>Location: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{user.city}, {user.country}</strong></span>
          </div>
        </div>

        {/* Complete Tech Stack */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Complete Tech Stack & Tools
          </h4>
          <div className="flex flex-wrap gap-2">
            {(user.skills || []).map(skill => (
              <SkillTag key={skill} name={skill} size="md" />
            ))}
          </div>
        </div>

        {/* Contributed Projects: Only Overview and Host Link */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Contributed Projects ({userProjects.length})
          </h4>
          {userProjects.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No projects recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {userProjects.map(p => (
                <div key={p.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.title}</h5>
                    {p.status === 'Completed / Shipped' ? (
                      <Badge variant="emerald" size="sm">Completed</Badge>
                    ) : (
                      <Badge variant="teal" size="sm">{p.status}</Badge>
                    )}
                  </div>
                  {/* Overview */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {p.description || p.tagline}
                  </p>
                  {/* Host Link */}
                  <div className="pt-1">
                    {p.liveUrl ? (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Live Host: {p.liveUrl.replace(/^https?:\/\//, '')}</span>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Deployment pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button variant="outline" size="md" onClick={closeConnectedProfile}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
