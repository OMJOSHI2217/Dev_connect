import React from 'react';
import {
  Check,
  X,
  Clock,
  Sparkles,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  UserPlus
} from 'lucide-react';
import { ConnectionRequest } from '../../types';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SkillTag } from '../ui/SkillTag';

interface ConnectionRequestCardProps {
  request: ConnectionRequest;
  type: 'received' | 'sent' | 'accepted' | 'declined';
}

export const ConnectionRequestCard: React.FC<ConnectionRequestCardProps> = ({ request, type }) => {
  const {
    acceptConnectionRequest,
    declineConnectionRequest,
    openConnectedProfile,
    openPublicProfile,
    openSendRequestModal,
    startConversationWithUser,
    currentUser
  } = useApp();

  const otherUser = request.fromUserId === currentUser.id ? request.toUser : request.fromUser;

  // Find mutual skills
  const mutualSkills = (otherUser.skills || []).filter(s => currentUser.skills.includes(s));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-teal-500/30 transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={otherUser.avatar}
                alt={otherUser.name}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800"
              />
              {otherUser.isOnline && (
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </div>
            <div>
              <h4
                onClick={() => type === 'accepted' ? openConnectedProfile(otherUser) : openPublicProfile(otherUser)}
                className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer transition-colors"
              >
                {otherUser.name}
              </h4>
              <p className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400">
                @{otherUser.username}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                {otherUser.role} • {String(otherUser.experienceLevel || 'Mid-Level').split(' ')[0]}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block mb-1 font-medium">
              {request.createdAt}
            </span>
            {request.projectInterest && (
              <Badge variant="indigo" size="sm">
                {request.projectInterest}
              </Badge>
            )}
          </div>
        </div>

        {/* Intro Message */}
        {request.message && (
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 mb-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
            "{request.message}"
          </div>
        )}

        {/* Mutual skills preview */}
        {mutualSkills.length > 0 && (
          <div className="flex items-center gap-2 mb-4 text-xs sm:text-sm">
            <span className="text-xs font-semibold text-slate-400">Mutual stack:</span>
            <div className="flex flex-wrap gap-1.5">
              {mutualSkills.slice(0, 3).map(skill => (
                <span key={skill} className="px-2 py-0.5 rounded-md text-xs bg-teal-500/10 text-teal-600 dark:text-teal-300 font-semibold border border-teal-500/20">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => type === 'accepted' ? openConnectedProfile(otherUser) : openPublicProfile(otherUser)}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer font-medium"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2">
          {type === 'received' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => declineConnectionRequest(request.id)}
                icon={<X className="w-3.5 h-3.5 text-rose-500" />}
              >
                Decline
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => acceptConnectionRequest(request.id)}
                icon={<Check className="w-3.5 h-3.5" />}
              >
                Accept
              </Button>
            </>
          )}

          {type === 'sent' && (
            <Badge variant="amber" size="sm" dot>
              Awaiting Approval
            </Badge>
          )}

          {type === 'accepted' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => startConversationWithUser(otherUser.id)}
              icon={<MessageSquare className="w-3.5 h-3.5 text-teal-500" />}
            >
              Start Conversation
            </Button>
          )}

          {type === 'declined' && (
            <div className="flex items-center gap-2">
              <Badge variant="rose" size="sm">
                Declined
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openSendRequestModal(otherUser)}
                icon={<UserPlus className="w-3.5 h-3.5 text-teal-500" />}
              >
                Connect Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
