import React from 'react';
import { 
  MapPin, 
  Briefcase, 
  Sparkles, 
  UserPlus, 
  Check, 
  Clock, 
  MessageSquare, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { User } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SkillTag } from '../ui/SkillTag';
import { COMPLEMENTARY_ROLE_MAP, calculateDeveloperMatch } from '../../data/mockData';

interface DeveloperCardProps {
  developer: User;
  showComplementaryBadge?: boolean;
}

export const DeveloperCard: React.FC<DeveloperCardProps> = ({ 
  developer, 
  showComplementaryBadge = true 
}) => {
  const { 
    currentUser, 
    getConnectionStatus, 
    openPublicProfile, 
    openConnectedProfile, 
    openSendRequestModal,
    startConversationWithUser 
  } = useApp();

  const connectionStatus = getConnectionStatus(developer.id);
  const isSelf = developer.id === currentUser.id;

  // Calculate intelligent match with location & role synergy
  const matchInfo = calculateDeveloperMatch(developer, currentUser);

  const handleCardClick = () => {
    if (connectionStatus === 'accepted') {
      openConnectedProfile(developer);
    } else {
      openPublicProfile(developer);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-teal-500/50 dark:hover:border-teal-500/50 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
    >
      <div>
        {/* Top bar: Priority Match (Complementary + Near Location) & Score */}
        <div className="flex items-center justify-between gap-2 mb-4">
          {showComplementaryBadge && matchInfo.badgeLabel ? (
            <Badge variant={matchInfo.isSameCity ? 'emerald' : 'teal'} size="sm" dot>
              {matchInfo.badgeLabel}
            </Badge>
          ) : (
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
              {String(developer.experienceLevel || 'Senior').split(' ')[0]}
            </span>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/25 text-xs sm:text-sm font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>{matchInfo.score}% Match</span>
          </div>
        </div>

        {/* Profile info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            <img
              src={developer.avatar}
              alt={developer.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm"
            />
            {developer.isOnline && (
              <span 
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" 
                title="Online now"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 
              onClick={handleCardClick}
              className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer truncate"
            >
              {developer.name}
            </h4>
            <p className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 truncate">
              @{developer.username}
            </p>
            <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 mt-1 line-clamp-1">
              {developer.role}
            </p>
          </div>
        </div>

        {/* Bio preview */}
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {developer.bio}
        </p>

        {/* Location & Experience meta */}
        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{developer.privacy.showExactLocation ? `${developer.city}, ${developer.country}` : 'Remote / Worldwide'}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{developer.yearsOfExperience} yrs exp</span>
          </div>
        </div>

        {/* Skills Tag Cloud */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {developer.skills.slice(0, 4).map((skill) => (
            <SkillTag key={skill} name={skill} size="sm" />
          ))}
          {developer.skills.length > 4 && (
            <span className="text-xs text-slate-400 font-semibold px-2 py-0.5 rounded self-center">
              +{developer.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={handleCardClick}
          className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Preview Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {!isSelf && (
          <div>
            {connectionStatus === 'none' && (
              <Button
                size="sm"
                variant="primary"
                icon={<UserPlus className="w-4 h-4" />}
                onClick={() => openSendRequestModal(developer)}
              >
                Connect
              </Button>
            )}

            {connectionStatus === 'pending_sent' && (
              <Button
                size="sm"
                variant="secondary"
                disabled
                icon={<Clock className="w-4 h-4 text-amber-500" />}
              >
                Pending
              </Button>
            )}

            {connectionStatus === 'pending_received' && (
              <Button
                size="sm"
                variant="accent"
                onClick={() => openPublicProfile(developer)}
              >
                Respond
              </Button>
            )}

            {connectionStatus === 'accepted' && (
              <Button
                size="sm"
                variant="secondary"
                icon={<MessageSquare className="w-4 h-4 text-teal-500" />}
                onClick={() => startConversationWithUser(developer.id)}
              >
                Message
              </Button>
            )}

            {connectionStatus === 'declined' && (
              <Badge variant="rose" size="sm">
                Declined
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
