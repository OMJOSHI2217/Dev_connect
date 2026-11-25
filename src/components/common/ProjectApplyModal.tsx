import React, { useState } from 'react';
import { Send, CheckCircle2, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { RoleType } from '../../types';

export const ProjectApplyModal: React.FC = () => {
  const { projectApplyModalProject, closeProjectApplyModal, applyToProject, currentUser } = useApp();

  const [selectedRole, setSelectedRole] = useState<RoleType | ''>('');
  const [note, setNote] = useState('');
  const [portfolioLink, setPortfolioLink] = useState(currentUser.socialLinks.portfolio || currentUser.socialLinks.github || '');

  if (!projectApplyModalProject) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    applyToProject(projectApplyModalProject.id, selectedRole as RoleType, note);
    closeProjectApplyModal();
    setSelectedRole('');
    setNote('');
  };

  return (
    <Modal
      isOpen={Boolean(projectApplyModalProject)}
      onClose={closeProjectApplyModal}
      maxWidth="md"
      title="Apply to Collaborate on Project"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Project snippet */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {projectApplyModalProject.title}
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
            Maintainer: {projectApplyModalProject.owner.name} (@{projectApplyModalProject.owner.username})
          </p>
        </div>

        {/* Role selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Select Role You Are Applying For
          </label>
          <div className="space-y-1.5">
            {projectApplyModalProject.openRolesNeeded.map(role => (
              <label
                key={role}
                className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  selectedRole === role
                    ? 'border-teal-500 bg-teal-500/10 text-teal-900 dark:text-teal-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="apply-role"
                  checked={selectedRole === role}
                  onChange={() => setSelectedRole(role)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm font-medium">{role}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Note */}
        <Textarea
          label="Why are you interested in this project?"
          placeholder="Mention how your skills fit the architecture and what parts you'd love to work on..."
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
        />

        {/* Portfolio link */}
        <Input
          label="Portfolio or GitHub Link to showcase"
          value={portfolioLink}
          onChange={(e) => setPortfolioLink(e.target.value)}
        />

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={closeProjectApplyModal}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!selectedRole}
            icon={<Send className="w-3.5 h-3.5" />}
          >
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};
