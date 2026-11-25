import React from 'react';
import { 
  MapPin, 
  Briefcase, 
  Lock, 
  UserPlus, 
  Clock, 
  MessageSquare, 
  Globe, 
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { User } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SkillTag } from '../ui/SkillTag';

export const PublicProfileModal: React.FC = () => {
  const { 
    publicProfileUser, 
    closePublicProfile, 
    openSendRequestModal, 
    getConnectionStatus,
    startConversationWithUser,
    projects,
    currentUser 
  } = useApp();

  if (!publicProfileUser) return null;

  // Safe normalized user object (handles camelCase or snake_case without crashing)
  const user = {
    ...publicProfileUser,
    experienceLevel: publicProfileUser.experienceLevel || (publicProfileUser as any).experience_level || 'Senior (5-8 yrs)',
    availability: publicProfileUser.availability || 'Part-Time (10-15h/wk)',
    skills: publicProfileUser.skills || ['TypeScript', 'React', 'Node.js'],
    preferredCollaboratorRoles: publicProfileUser.preferredCollaboratorRoles || (publicProfileUser as any).preferred_collaborator_roles || ['Frontend Developer', 'Backend Developer'],
    socialLinks: publicProfileUser.socialLinks || (publicProfileUser as any).social_links || {},
    city: publicProfileUser.city || 'San Francisco',
    country: publicProfileUser.country || 'United States',
    specialization: publicProfileUser.specialization || 'Full Stack & Cloud Architecture'
  };

  const connectionStatus = getConnectionStatus(user.id);
  const isSelf = user.id === currentUser.id;

  // Filter projects contributed by or owned by this public user
  const userProjects = (projects || []).filter(
    p => p.ownerId === user.id || p.contributors?.some(c => c.userId === user.id)
  );

  return (
    <Modal
      isOpen={Boolean(publicProfileUser)}
      onClose={closePublicProfile}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <span className="text-sm uppercase tracking-wider text-slate-500 font-bold">
            Public Profile Preview
          </span>
          <Badge variant="amber" size="sm" dot>
            Limited Access
          </Badge>
        </div>
      }
    >
      <div className="space-y-6">
        
        {/* Banner informing restricted info */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-sm text-amber-900 dark:text-amber-300">
          <Lock className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
          <p className="leading-relaxed">
            <strong>Privacy Protected:</strong> Direct mobile number, private repositories, verified links, and instant chat channels are unlocked once mutual connection is accepted.
          </p>
        </div>

        {/* Profile Card Header */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-800 shadow-sm"
            />
            {user.isOnline && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 truncate">
                {user.name}
              </h3>
              <ShieldCheck className="w-5 h-5 text-teal-500 shrink-0" />
            </div>
            <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">
              @{user.username}
            </p>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-1">
              {user.role}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {user.specialization}
            </p>
          </div>
        </div>

        {/* Meta pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 block mb-0.5">Location</span>
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 truncate font-semibold">
              <MapPin className="w-4 h-4 text-teal-500" />
              <span>{user.city}, {user.country}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 block mb-0.5">Experience</span>
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 truncate font-semibold">
              <Briefcase className="w-4 h-4 text-teal-500" />
              <span>{String(user.experienceLevel).split(' ')[0]}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-xs text-slate-400 block mb-0.5">Availability</span>
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 truncate font-semibold">
              <Clock className="w-4 h-4 text-teal-500" />
              <span>{String(user.availability).split(' ')[0]}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
            About Developer
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            {user.bio}
          </p>
        </div>

        {/* Selected skills (Publicly visible) */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
            Public Skill Highlights
          </h4>
          <div className="flex flex-wrap gap-2">
            {(user.skills || []).map((skill) => (
              <SkillTag key={skill} name={skill} size="md" />
            ))}
          </div>
        </div>

        {/* Preferred Collaborator Roles */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
            Looking to Collaborate With
          </h4>
          <div className="flex flex-wrap gap-2">
            {(user.preferredCollaboratorRoles || []).map((role) => (
              <Badge key={role} variant="indigo" size="md">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        {/* Contributed Projects */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
            Contributed Projects ({userProjects.length})
          </h4>
          {userProjects.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No published projects yet.</p>
          ) : (
            <div className="space-y-2.5">
              {userProjects.map(p => (
                <div key={p.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.title}</h5>
                    {p.status === 'Completed / Shipped' && (
                      <Badge variant="emerald" size="sm">Completed</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description || p.tagline}
                  </p>
                  {p.liveUrl && (
                    <div className="pt-1">
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Live Host: {p.liveUrl.replace(/^https?:\/\//, '')}</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio link */}
        {user.socialLinks?.portfolio && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Globe className="w-4 h-4 text-teal-500" />
              <span>Public Portfolio:</span>
              <span className="font-mono text-teal-600 dark:text-teal-400 underline font-semibold">
                {user.socialLinks.portfolio}
              </span>
            </div>
          </div>
        )}

        {/* Action footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Button variant="ghost" size="md" onClick={closePublicProfile}>
            Close
          </Button>

          {!isSelf && (
            <div>
              {connectionStatus === 'none' && (
                <Button
                  variant="primary"
                  size="md"
                  icon={<UserPlus className="w-4 h-4" />}
                  onClick={() => openSendRequestModal(user)}
                >
                  Send Connection Request
                </Button>
              )}

              {connectionStatus === 'pending_sent' && (
                <Button variant="secondary" size="md" disabled icon={<Clock className="w-4 h-4 text-amber-500" />}>
                  Request Pending
                </Button>
              )}

              {connectionStatus === 'accepted' && (
                <Button
                  variant="secondary"
                  size="md"
                  icon={<MessageSquare className="w-4 h-4 text-teal-500" />}
                  onClick={() => {
                    closePublicProfile();
                    startConversationWithUser(user.id);
                  }}
                >
                  Open Messaging
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
