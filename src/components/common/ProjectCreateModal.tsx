import React, { useState } from 'react';
import { FolderGit2, Plus, X, Globe, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { RoleType, ProjectStatus } from '../../types';

export const ProjectCreateModal: React.FC = () => {
  const { projectCreateModalOpen, setProjectCreateModalOpen, createProject } = useApp();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [technologiesInput, setTechnologiesInput] = useState('');
  const [repoName, setRepoName] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [openRolesNeeded, setOpenRolesNeeded] = useState<RoleType[]>([]);
  const [visibility, setVisibility] = useState<'public' | 'connections-only'>('public');

  const availableRoles: RoleType[] = [
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'Mobile Developer',
    'DevOps & Cloud Engineer',
    'AI & Machine Learning Engineer',
    'UI/UX & Product Designer',
    'Systems & Security Engineer',
    'Data Engineer'
  ];

  const toggleRole = (role: RoleType) => {
    setOpenRolesNeeded(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tagline.trim()) return;

    const techArray = technologiesInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    createProject({
      title,
      tagline,
      description: description || tagline,
      goals: [
        'Build core architecture & MVP',
        'Open-source contributor onboarding',
        'Production release deployment'
      ],
      technologies: techArray.length > 0 ? techArray : ['TypeScript', 'React'],
      ownerId: '', // Context will attach currentUser
      status: 'Recruiting Collaborators',
      visibility,
      githubRepo: repoUrl ? {
        name: repoName || 'repo',
        url: repoUrl,
        stars: 1,
        forks: 0,
        openIssues: 0,
        primaryLanguage: techArray[0] || 'TypeScript'
      } : undefined,
      openRolesNeeded,
      estimatedDuration: '2-3 months'
    });

    setProjectCreateModalOpen(false);
    setTitle('');
    setTagline('');
    setDescription('');
    setTechnologiesInput('');
    setRepoName('');
    setRepoUrl('');
    setOpenRolesNeeded([]);
  };

  if (!projectCreateModalOpen) return null;

  return (
    <Modal
      isOpen={projectCreateModalOpen}
      onClose={() => setProjectCreateModalOpen(false)}
      maxWidth="xl"
      title="Create New Collaboration Project"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <Input
          label="Project Title"
          placeholder="e.g. RustKV: Distributed In-Memory Cache"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Input
          label="One-line Tagline"
          placeholder="e.g. Ultra-low latency memory store with Raft consensus protocol"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          required
        />

        <Textarea
          label="Detailed Description & Problem Statement"
          placeholder="Explain what the project does, the technical challenge, and why you are looking for collaborators..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Input
          label="Technologies & Tech Stack (comma-separated)"
          placeholder="Rust, Tokio, Docker, gRPC, React"
          value={technologiesInput}
          onChange={(e) => setTechnologiesInput(e.target.value)}
        />

        {/* Roles needed selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Collaborator Roles Needed
          </label>
          <div className="flex flex-wrap gap-1.5">
            {availableRoles.map(role => {
              const selected = openRolesNeeded.includes(role);
              return (
                <button
                  type="button"
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer font-medium ${
                    selected
                      ? 'bg-teal-600 text-white border-teal-500 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-teal-500'
                  }`}
                >
                  {selected ? `✓ ${role}` : `+ ${role}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* GitHub Repository details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Input
            label="GitHub Repo Name"
            placeholder="my-org/project-name"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
          />
          <Input
            label="GitHub URL"
            placeholder="https://github.com/my-org/project-name"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Project Visibility
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setVisibility('public')}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 cursor-pointer ${
                visibility === 'public'
                  ? 'border-teal-500 bg-teal-500/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <Globe className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Public Discovery</p>
                <p className="text-[11px] text-slate-500">Visible to all developers on DevCollab</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setVisibility('connections-only')}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 cursor-pointer ${
                visibility === 'connections-only'
                  ? 'border-teal-500 bg-teal-500/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <Lock className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Connections Only</p>
                <p className="text-[11px] text-slate-500">Visible only to accepted connections</p>
              </div>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setProjectCreateModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Publish Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};
