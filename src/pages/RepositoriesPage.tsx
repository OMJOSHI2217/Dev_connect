import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  Plus, 
  Search, 
  Star, 
  GitFork, 
  GitPullRequest, 
  AlertCircle, 
  Lock, 
  Globe, 
  Copy, 
  Check, 
  ArrowRight,
  ExternalLink,
  Code2,
  Folder
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Repository } from '../types/git';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const RepositoriesPage: React.FC = () => {
  const { currentUser, openRepository, addToast } = useApp();

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'public' | 'private'>('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // New Repository Modal
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [newRepoName, setNewRepoName] = useState<string>('');
  const [newRepoDescription, setNewRepoDescription] = useState<string>('');
  const [newRepoVisibility, setNewRepoVisibility] = useState<'public' | 'private'>('public');
  const [newRepoBranch, setNewRepoBranch] = useState<string>('main');
  const [creating, setCreating] = useState<boolean>(false);

  const fetchRepositories = async () => {
    setLoading(true);
    try {
      const res = await api.git.getRepositories({
        search,
        userId: currentUser.id
      });
      if (res?.repositories) {
        setRepositories(res.repositories);
      }
    } catch {
      addToast('Could not load repositories from backend.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, [search]);

  const handleCopyClone = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const cloneUrl = `http://localhost:5000/git/${slug}.git`;
    navigator.clipboard.writeText(`git clone ${cloneUrl}`);
    setCopiedSlug(slug);
    addToast('Git clone command copied to clipboard!', 'success');
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleCreateRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim()) {
      addToast('Repository name is required.', 'warning');
      return;
    }

    setCreating(true);
    try {
      const res = await api.git.createRepository({
        name: newRepoName.trim(),
        description: newRepoDescription.trim(),
        visibility: newRepoVisibility,
        defaultBranch: newRepoBranch.trim() || 'main',
        ownerId: currentUser.id
      });

      if (res?.repository) {
        addToast(`Repository "${res.repository.slug}" created successfully!`, 'success');
        setCreateModalOpen(false);
        setNewRepoName('');
        setNewRepoDescription('');
        openRepository(res.repository.slug);
      } else {
        addToast(res?.error || 'Failed to create repository.', 'error');
      }
    } catch (err: any) {
      addToast(err.message || 'Error creating repository.', 'error');
    } finally {
      setCreating(false);
    }
  };

  const filteredRepos = repositories.filter(r => {
    if (filter === 'mine') return r.owner_id === currentUser.id;
    if (filter === 'public') return r.visibility === 'public';
    if (filter === 'private') return r.visibility === 'private';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <FolderGit2 className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            Git Code Repositories
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real server-hosted Git version control. Clone, push, pull, review Pull Requests, and track project issues.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setCreateModalOpen(true)}
        >
          New Repository
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search repositories by name, description, or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 self-start md:self-auto">
          {(['all', 'mine', 'public', 'private'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab === 'mine' ? 'My Repositories' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Repositories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800/40 animate-pulse border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl">
          <Folder className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No repositories found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {search ? 'Try clearing your search query.' : 'Create your first collaborative Git repository to start pushing code.'}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Repository
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.map(repo => (
            <div
              key={repo.id}
              onClick={() => openRepository(repo.slug)}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 dark:hover:border-teal-500/50 rounded-2xl p-5 transition-all shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FolderGit2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                      {repo.slug}
                    </span>
                  </div>

                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                    repo.visibility === 'public'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  }`}>
                    {repo.visibility === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {repo.visibility}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {repo.description || 'No description provided.'}
                </p>

                {repo.project_title && (
                  <div className="mb-3">
                    <Badge variant="indigo" size="sm">
                      Project: {repo.project_title}
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                {/* Clone snippet */}
                <div 
                  onClick={(e) => handleCopyClone(repo.slug, e)}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 font-mono text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mb-4"
                  title="Click to copy git clone command"
                >
                  <span className="truncate">git clone http://localhost:5000/git/{repo.slug}.git</span>
                  {copiedSlug === repo.slug ? (
                    <span className="flex items-center gap-1 text-emerald-500 font-semibold text-[11px] shrink-0 ml-2">
                      <Check className="w-3.5 h-3.5" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0 ml-2" />
                  )}
                </div>

                {/* Footer metadata */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300">
                      <GitPullRequest className="w-3.5 h-3.5 text-purple-500" />
                      {repo.open_prs_count || 0} PRs
                    </span>
                    <span className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      {repo.open_issues_count || 0} Issues
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500" />
                      {repo.stars_count || 0}
                    </span>
                  </div>

                  <span className="text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Explore Code <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Repository Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create a New Git Repository"
      >
        <form onSubmit={handleCreateRepo} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Repository Name *
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-xl text-xs font-mono text-slate-500">
                {currentUser.username}/
              </span>
              <input
                type="text"
                required
                placeholder="my-telemetry-engine"
                value={newRepoName}
                onChange={(e) => setNewRepoName(e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Great repository names are short and memorable (e.g. <span className="font-mono">distributed-sync</span>).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description (Optional)
            </label>
            <Textarea
              placeholder="What does this repository do? Explain goals, stack, and architecture..."
              value={newRepoDescription}
              onChange={(e) => setNewRepoDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Visibility
              </label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <input
                    type="radio"
                    name="visibility"
                    checked={newRepoVisibility === 'public'}
                    onChange={() => setNewRepoVisibility('public')}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-emerald-500" /> Public
                    </span>
                    <p className="text-[10px] text-slate-500">Anyone can see and clone</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <input
                    type="radio"
                    name="visibility"
                    checked={newRepoVisibility === 'private'}
                    onChange={() => setNewRepoVisibility('private')}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-500" /> Private
                    </span>
                    <p className="text-[10px] text-slate-500">Only authorized members</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Default Branch
              </label>
              <Input
                value={newRepoBranch}
                onChange={(e) => setNewRepoBranch(e.target.value)}
                placeholder="main"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Initial branch created with README.md and .gitignore.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={creating}
              icon={<FolderGit2 className="w-4 h-4" />}
            >
              {creating ? 'Initializing Git Repo...' : 'Create Repository'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
