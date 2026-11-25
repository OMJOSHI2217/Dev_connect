import React, { useState } from 'react';
import { Send, UserCheck, Sparkles, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea, Input } from '../ui/Input';

export const SendRequestModal: React.FC = () => {
  const { 
    sendRequestModalUser, 
    closeSendRequestModal, 
    sendConnectionRequest,
    currentUser 
  } = useApp();

  const [message, setMessage] = useState('');
  const [projectInterest, setProjectInterest] = useState('');

  if (!sendRequestModalUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendConnectionRequest(
      sendRequestModalUser.id, 
      message.trim() || `Hey ${sendRequestModalUser.name}, I would love to connect and build projects together!`, 
      projectInterest.trim() || undefined
    );
    closeSendRequestModal();
    setMessage('');
    setProjectInterest('');
  };

  return (
    <Modal
      isOpen={Boolean(sendRequestModalUser)}
      onClose={closeSendRequestModal}
      maxWidth="md"
      title="Send Connection Request"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Recipient preview */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <img
            src={sendRequestModalUser.avatar}
            alt={sendRequestModalUser.name}
            className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-300 dark:ring-slate-700"
          />
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              Connecting with {sendRequestModalUser.name}
            </h4>
            <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
              @{sendRequestModalUser.username} • {sendRequestModalUser.role}
            </p>
          </div>
        </div>

        {/* Project Interest */}
        <Input
          label="Project Interest or Focus Area"
          placeholder="e.g. Real-time WebGL Canvas / Open Source Telemetry"
          value={projectInterest}
          onChange={(e) => setProjectInterest(e.target.value)}
          helperText="Optional: mention a specific repo or topic you want to collaborate on."
        />

        {/* Introduction Note */}
        <Textarea
          label="Introduction Message"
          rows={4}
          placeholder={`Hi ${sendRequestModalUser.name}, I noticed your experience with ${sendRequestModalUser.skills.slice(0, 2).join(' and ')}. I'm building...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          helperText="Personalized requests have an 85% higher acceptance rate."
        />

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={closeSendRequestModal}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon={<Send className="w-3.5 h-3.5" />}
          >
            Send Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
