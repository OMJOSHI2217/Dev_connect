import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  GitBranch, 
  GitPullRequest, 
  GitCommit, 
  AlertCircle, 
  Settings, 
  Activity, 
  Folder, 
  FileText, 
  FileCode, 
  Copy, 
  Check, 
  Plus, 
  ArrowLeft, 
  Lock, 
  Globe, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Share2, 
  Download,
  Terminal,
  Clock,
  User,
  Shield,
  Eye,
  Star,
  GitFork
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Repository, 
  GitTreeItem, 
  GitCommit as GitCommitType, 
  GitBranch as GitBranchType, 
  PullRequest, 
  Issue, 
  RepositoryActivity, 
  RepositoryCollaborator 
} from '../types/git';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const RepositoryDetailPage: React.FC = () => {
  const { currentRepoSlug, setCurrentView, currentUser, addToast, notifyPushToProjectChat } = useApp();

  const [activeTab, setActiveTab] = useState<'code' | 'pulls' | 'issues' | 'commits' | 'branches' | 'activity' | 'settings'>('code');
  const [repository, setRepository] = useState<Repository | null>(null);
  const [branches, setBranches] = useState<GitBranchType[]>([]);
  const [currentBranch, setCurrentBranch] = useState<string>('main');
  const [currentPath, setCurrentPath] = useState<string>('');
  const [treeItems, setTreeItems] = useState<GitTreeItem[]>([]);
  const [readme, setReadme] = useState<{ fileName: string; content: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // File Viewer & Web Editor
  const [selectedFile, setSelectedFile] = useState<{ path: string; content: string; size: number } | null>(null);
  const [isEditingFile, setIsEditingFile] = useState<boolean>(false);
  const [editFileContent, setEditFileContent] = useState<string>('');
  const [editCommitMessage, setEditCommitMessage] = useState<string>('');
  const [isCreatingNewFile, setIsCreatingNewFile] = useState<boolean>(false);
  const [newFilePath, setNewFilePath] = useState<string>('');

  // Commits state
  const [commits, setCommits] = useState<GitCommitType[]>([]);
  const [selectedCommitDiff, setSelectedCommitDiff] = useState<any | null>(null);

  // Pull Requests state
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [selectedPR, setSelectedPR] = useState<any | null>(null);
  const [prDiff, setPrDiff] = useState<any | null>(null);
  const [prCommentText, setPrCommentText] = useState<string>('');
  const [newPRModalOpen, setNewPRModalOpen] = useState<boolean>(false);
  const [newPRTitle, setNewPRTitle] = useState<string>('');
  const [newPRDescription, setNewPRDescription] = useState<string>('');
  const [newPRSourceBranch, setNewPRSourceBranch] = useState<string>('');
  const [newPRTargetBranch, setNewPRTargetBranch] = useState<string>('main');
  const [prMergeability, setPrMergeability] = useState<any | null>(null);

  // Issues state
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [issueCommentText, setIssueCommentText] = useState<string>('');
  const [newIssueModalOpen, setNewIssueModalOpen] = useState<boolean>(false);
  const [newIssueTitle, setNewIssueTitle] = useState<string>('');
  const [newIssueDescription, setNewIssueDescription] = useState<string>('');
  const [newIssuePriority, setNewIssuePriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  // Branches & Activities & Settings
  const [newBranchModalOpen, setNewBranchModalOpen] = useState<boolean>(false);
  const [newBranchName, setNewBranchName] = useState<string>('');
  const [activities, setActivities] = useState<RepositoryActivity[]>([]);
  const [collaborators, setCollaborators] = useState<RepositoryCollaborator[]>([]);
  const [newCollabUsername, setNewCollabUsername] = useState<string>('');
  const [newCollabRole, setNewCollabRole] = useState<'collaborator' | 'reviewer'>('collaborator');

  // Clone Dropdown / Clipboard
  const [cloneDropdownOpen, setCloneDropdownOpen] = useState<boolean>(false);
  const [copiedClone, setCopiedClone] = useState<boolean>(false);

  const slug = currentRepoSlug || 'alexrivera_dev/devpulse-engine';
  const [owner, repoName] = slug.split('/');

  // 1. Fetch Repository Details
  const loadRepo = async () => {
    setLoading(true);
    try {
      const res = await api.git.getRepository(owner, repoName);
      if (res?.repository) {
        setRepository(res.repository);
        setBranches(res.branches || []);
        setCurrentBranch(res.repository.default_branch || 'main');
        setReadme(res.readme || null);
        setCollaborators(res.collaborators || []);
      }
    } catch {
      addToast('Error loading repository.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepo();
  }, [slug]);

  // 2. Fetch Tree / Files when branch or path changes
  const loadTree = async () => {
    try {
      const res = await api.git.getTree(owner, repoName, currentBranch, currentPath);
      if (res?.items) {
        setTreeItems(res.items);
      }
    } catch {}
  };

  useEffect(() => {
    if (activeTab === 'code' && !selectedFile) {
      loadTree();
    }
  }, [currentBranch, currentPath, activeTab, selectedFile]);

  // 3. Tab Specific Loaders
  useEffect(() => {
    if (activeTab === 'commits') {
      api.git.getCommits(owner, repoName, currentBranch).then(res => {
        if (res?.commits) setCommits(res.commits);
      });
    } else if (activeTab === 'pulls') {
      api.git.getPullRequests(owner, repoName).then(res => {
        if (res?.pullRequests) setPullRequests(res.pullRequests);
      });
    } else if (activeTab === 'issues') {
      api.git.getIssues(owner, repoName).then(res => {
        if (res?.issues) setIssues(res.issues);
      });
    } else if (activeTab === 'activity') {
      api.git.getActivities(owner, repoName).then(res => {
        if (res?.activities) setActivities(res.activities);
      });
    }
  }, [activeTab, currentBranch]);

  // File Click Handler
  const handleItemClick = async (item: GitTreeItem) => {
    if (item.type === 'tree') {
      setCurrentPath(item.path);
      setSelectedFile(null);
    } else {
      try {
        const res = await api.git.getFile(owner, repoName, currentBranch, item.path);
        if (res?.content !== undefined) {
          setSelectedFile({
            path: item.path,
            content: res.content,
            size: res.size
          });
          setIsEditingFile(false);
        }
      } catch {
        addToast('Failed to open file.', 'error');
      }
    }
  };

  // Web Commit Handler
  const handleSaveWebCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCommitMessage.trim()) {
      addToast('Commit message is required.', 'warning');
      return;
    }

    const filePath = isCreatingNewFile ? newFilePath.trim() : (selectedFile?.path || '');
    if (!filePath) {
      addToast('File path is required.', 'warning');
      return;
    }

    try {
      const res = await api.git.createWebCommit(owner, repoName, {
        branch: currentBranch,
        message: editCommitMessage.trim(),
        userId: currentUser.id,
        actions: [
          {
            action: isCreatingNewFile ? 'create' : 'update',
            path: filePath,
            content: editFileContent
          }
        ]
      });

      if (res?.commitHash) {
        addToast(`Changes committed to ${currentBranch} (${res.commitHash.slice(0, 7)})!`, 'success');
        if (repository?.project_id) {
          notifyPushToProjectChat({
            projectId: repository.project_id,
            branch: currentBranch,
            commitHash: res.commitHash,
            message: editCommitMessage.trim(),
            filesChanged: [filePath],
            authorName: currentUser.name
          });
        }
        setIsEditingFile(false);
        setIsCreatingNewFile(false);
        setSelectedFile(null);
        loadTree();
        // Refresh README if README.md was edited
        api.git.getReadme(owner, repoName, currentBranch).then(r => setReadme(r?.readme || null));
      } else {
        addToast(res?.error || 'Failed to commit changes.', 'error');
      }
    } catch (err: any) {
      addToast(err.message || 'Error creating commit.', 'error');
    }
  };

  // Copy Clone Command
  const handleCopyClone = (protocol: 'https' | 'cli') => {
    const cloneUrl = `http://localhost:5000/git/${slug}.git`;
    const textToCopy = protocol === 'cli' ? `git clone ${cloneUrl}` : cloneUrl;
    navigator.clipboard.writeText(textToCopy);
    setCopiedClone(true);
    addToast('Clone link copied to clipboard!', 'success');
    setTimeout(() => setCopiedClone(false), 2500);
  };

  // Open Pull Request Detail
  const handleOpenPR = async (prNumber: number) => {
    try {
      const res = await api.git.getPullRequest(owner, repoName, prNumber);
      if (res?.pullRequest) {
        setSelectedPR(res);
        const diffRes = await api.git.getPullRequestDiff(owner, repoName, prNumber);
        setPrDiff(diffRes);
      }
    } catch {
      addToast('Failed to load Pull Request details.', 'error');
    }
  };

  // Merge Pull Request
  const handleMergePR = async (prNumber: number) => {
    try {
      const res = await api.git.mergePullRequest(owner, repoName, prNumber, {
        userId: currentUser.id
      });
      if (res?.success) {
        addToast(`Pull Request #${prNumber} merged into ${selectedPR.pullRequest.target_branch}!`, 'success');
        if (repository?.project_id && selectedPR?.pullRequest) {
          notifyPushToProjectChat({
            projectId: repository.project_id,
            branch: selectedPR.pullRequest.target_branch,
            commitHash: res.mergeCommitHash || 'merge',
            message: `Merged PR #${prNumber}: ${selectedPR.pullRequest.title}`,
            authorName: currentUser.name
          });
        }
        handleOpenPR(prNumber);
      } else {
        addToast(res?.error || 'Failed to merge Pull Request.', 'error');
      }
    } catch (err: any) {
      addToast(err.message || 'Error merging PR.', 'error');
    }
  };

  // Submit PR Review
  const handleSubmitReview = async (decision: 'approved' | 'changes_requested') => {
    if (!selectedPR) return;
    try {
      await api.git.submitReview(owner, repoName, selectedPR.pullRequest.number, {
        reviewerId: currentUser.id,
        decision,
        body: decision === 'approved' ? 'Approved! Code looks great and tests pass.' : 'Changes requested.'
      });
      addToast(`Review submitted as ${decision}!`, 'success');
      handleOpenPR(selectedPR.pullRequest.number);
    } catch {
      addToast('Error submitting review.', 'error');
    }
  };

  // Add Comment to PR
  const handleAddPRComment = async () => {
    if (!prCommentText.trim() || !selectedPR) return;
    try {
      await api.git.addComment(owner, repoName, selectedPR.pullRequest.number, {
        userId: currentUser.id,
        body: prCommentText.trim()
      });
      setPrCommentText('');
      handleOpenPR(selectedPR.pullRequest.number);
      addToast('Comment added!', 'success');
    } catch {
      addToast('Error posting comment.', 'error');
    }
  };

  // Create New Pull Request
  const handleCreatePR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPRTitle.trim() || !newPRSourceBranch) {
      addToast('Please provide a PR title and source branch.', 'warning');
      return;
    }

    try {
      const res = await api.git.createPullRequest(owner, repoName, {
        title: newPRTitle.trim(),
        description: newPRDescription.trim(),
        sourceBranch: newPRSourceBranch,
        targetBranch: newPRTargetBranch,
        authorId: currentUser.id
      });

      if (res?.pullRequest) {
        addToast(`Pull Request #${res.pullRequest.number} created!`, 'success');
        setNewPRModalOpen(false);
        setNewPRTitle('');
        setNewPRDescription('');
        setActiveTab('pulls');
        handleOpenPR(res.pullRequest.number);
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to create PR.', 'error');
    }
  };

  // Create New Branch
  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;

    try {
      const res = await api.git.createBranch(owner, repoName, {
        newBranch: newBranchName.trim(),
        baseBranch: currentBranch,
        userId: currentUser.id
      });

      if (res?.branch) {
        addToast(`Branch "${res.branch}" created successfully!`, 'success');
        setNewBranchModalOpen(false);
        setNewBranchName('');
        // Refresh branches
        const bRes = await api.git.getBranches(owner, repoName);
        if (bRes?.branches) {
          setBranches(bRes.branches);
          setCurrentBranch(res.branch);
        }
      }
    } catch (err: any) {
      addToast(err.message || 'Error creating branch.', 'error');
    }
  };

  // Open Issue Detail
  const handleOpenIssue = async (issueNumber: number) => {
    try {
      const res = await api.git.getIssue(owner, repoName, issueNumber);
      if (res?.issue) {
        setSelectedIssue(res);
      }
    } catch {
      addToast('Failed to load issue.', 'error');
    }
  };

  // Create New Issue
  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssueTitle.trim()) return;

    try {
      const res = await api.git.createIssue(owner, repoName, {
        title: newIssueTitle.trim(),
        description: newIssueDescription.trim(),
        priority: newIssuePriority,
        authorId: currentUser.id
      });

      if (res?.issue) {
        addToast(`Issue #${res.issue.number} created!`, 'success');
        setNewIssueModalOpen(false);
        setNewIssueTitle('');
        setNewIssueDescription('');
        setActiveTab('issues');
        handleOpenIssue(res.issue.number);
      }
    } catch (err: any) {
      addToast(err.message || 'Error creating issue.', 'error');
    }
  };

  if (loading || !repository) {
    return (
      <div className="p-12 text-center text-slate-500">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">Connecting to Git Engine & Repository...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Repository Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <button 
                onClick={() => setCurrentView('repositories')}
                className="hover:text-teal-600 dark:hover:text-teal-400 font-semibold flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Repositories
              </button>
              <span>/</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">@{owner}</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <FolderGit2 className="w-7 h-7 text-teal-600 dark:text-teal-400 shrink-0" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight truncate">
                {repoName}
              </h1>

              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                repository.visibility === 'public'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
              }`}>
                {repository.visibility === 'public' ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                {repository.visibility}
              </span>

              {repository.project_title && (
                <Badge variant="indigo" size="sm">
                  Project: {repository.project_title}
                </Badge>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {repository.description || 'No description provided.'}
            </p>
          </div>

          {/* Action buttons (Clone, Star, Fork) */}
          <div className="flex items-center gap-2 relative">
            <Button
              variant="outline"
              size="sm"
              icon={<Star className="w-3.5 h-3.5 text-yellow-500" />}
            >
              Star ({repository.stars_count})
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={<GitFork className="w-3.5 h-3.5" />}
            >
              Fork ({repository.forks_count})
            </Button>

            {/* Code / Clone Dropdown */}
            <div className="relative">
              <Button
                variant="primary"
                size="sm"
                icon={<Download className="w-3.5 h-3.5" />}
                onClick={() => setCloneDropdownOpen(!cloneDropdownOpen)}
              >
                Code ▾
              </Button>

              {cloneDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl z-50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-teal-500" /> Clone with Git
                    </span>
                    <button 
                      onClick={() => setCloneDropdownOpen(false)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 mb-1 block">HTTPS Clone URL</label>
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1.5 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                      <span className="truncate flex-1 px-1">http://localhost:5000/git/{slug}.git</span>
                      <button
                        onClick={() => handleCopyClone('https')}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                        title="Copy URL"
                      >
                        {copiedClone ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Terminal / VS Code Command</label>
                    <div className="bg-slate-900 text-slate-200 p-2 rounded-lg font-mono text-[11px] flex items-center justify-between">
                      <span className="truncate">git clone http://localhost:5000/git/{slug}.git</span>
                      <button
                        onClick={() => handleCopyClone('cli')}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-100"
                        title="Copy command"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-normal">
                    Compatible with all Git tools including VS Code, Git CLI, and JetBrains.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
          {[
            { id: 'code', label: 'Code', icon: FileCode },
            { id: 'pulls', label: `Pull Requests (${repository.open_prs_count || 0})`, icon: GitPullRequest },
            { id: 'issues', label: `Issues (${repository.open_issues_count || 0})`, icon: AlertCircle },
            { id: 'commits', label: 'Commits', icon: GitCommit },
            { id: 'branches', label: `Branches (${branches.length})`, icon: GitBranch },
            { id: 'activity', label: 'Activity', icon: Activity },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedFile(null);
                  setSelectedPR(null);
                  setSelectedIssue(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CODE & EXPLORER */}
      {/* ========================================================================= */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          {/* Action Row: Branch Selector, Path breadcrumb, Add file */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Branch Selector */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <GitBranch className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <select
                  value={currentBranch}
                  onChange={(e) => {
                    setCurrentBranch(e.target.value);
                    setCurrentPath('');
                    setSelectedFile(null);
                  }}
                  className="bg-transparent focus:outline-none cursor-pointer font-mono"
                >
                  {branches.map(b => (
                    <option key={b.name} value={b.name} className="dark:bg-slate-900">
                      {b.name} {b.isDefault ? '(default)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Path Breadcrumbs */}
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400">
                <button 
                  onClick={() => { setCurrentPath(''); setSelectedFile(null); }}
                  className="hover:text-teal-500 font-bold"
                >
                  {repoName}
                </button>
                {currentPath.split('/').filter(Boolean).map((seg, i, arr) => (
                  <React.Fragment key={seg}>
                    <span>/</span>
                    <button
                      onClick={() => {
                        const newPath = arr.slice(0, i + 1).join('/');
                        setCurrentPath(newPath);
                        setSelectedFile(null);
                      }}
                      className="hover:text-teal-500"
                    >
                      {seg}
                    </button>
                  </React.Fragment>
                ))}
                {selectedFile && (
                  <>
                    <span>/</span>
                    <span className="text-teal-600 dark:text-teal-400 font-bold">{selectedFile.path.split('/').pop()}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {!selectedFile && !isEditingFile && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setIsCreatingNewFile(true);
                    setIsEditingFile(true);
                    setNewFilePath('');
                    setEditFileContent('');
                    setEditCommitMessage('Create new file');
                  }}
                >
                  Add File
                </Button>
              )}
            </div>
          </div>

          {/* VIEW MODE: File Editor */}
          {isEditingFile ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-teal-500" />
                  {isCreatingNewFile ? 'Create New File' : `Editing ${selectedFile?.path}`}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditingFile(false);
                    setIsCreatingNewFile(false);
                  }}
                >
                  Cancel
                </Button>
              </div>

              {isCreatingNewFile && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">File Name & Path</label>
                  <Input
                    placeholder="src/utils/logger.ts"
                    value={newFilePath}
                    onChange={(e) => setNewFilePath(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Source Code</label>
                <textarea
                  value={editFileContent}
                  onChange={(e) => setEditFileContent(e.target.value)}
                  rows={16}
                  placeholder="// Enter code here..."
                  className="w-full p-4 font-mono text-xs bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <GitCommit className="w-4 h-4 text-teal-500" /> Commit Changes
                </h4>
                <Input
                  placeholder="Commit message (e.g. Update telemetry WebSocket heartbeat handler)"
                  value={editCommitMessage}
                  onChange={(e) => setEditCommitMessage(e.target.value)}
                  required
                />
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <span>Commit directly to <strong className="font-mono text-teal-500">{currentBranch}</strong></span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveWebCommit}
                  >
                    Commit Changes
                  </Button>
                </div>
              </div>
            </div>
          ) : selectedFile ? (
            /* VIEW MODE: File Viewer */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-800 dark:text-slate-200 font-bold">
                  <FileCode className="w-4 h-4 text-teal-500" />
                  {selectedFile.path}
                  <span className="text-slate-400 font-normal">({selectedFile.size} bytes)</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Copy className="w-3.5 h-3.5" />}
                    onClick={() => {
                      navigator.clipboard.writeText(selectedFile.content);
                      addToast('File content copied!', 'success');
                    }}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Edit3 className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setIsEditingFile(true);
                      setEditFileContent(selectedFile.content);
                      setEditCommitMessage(`Update ${selectedFile.path.split('/').pop()}`);
                    }}
                  >
                    Edit File
                  </Button>
                </div>
              </div>

              {/* Code with line numbers */}
              <div className="p-4 bg-slate-950 font-mono text-xs overflow-x-auto text-slate-200 leading-relaxed max-h-[600px]">
                <table className="w-full border-collapse">
                  <tbody>
                    {selectedFile.content.split('\n').map((line, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/60">
                        <td className="w-10 pr-4 text-right text-slate-600 select-none text-[11px] font-mono">
                          {idx + 1}
                        </td>
                        <td className="whitespace-pre">
                          {line || ' '}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* VIEW MODE: Tree Explorer */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {currentPath && (
                  <div
                    onClick={() => {
                      const segments = currentPath.split('/');
                      segments.pop();
                      setCurrentPath(segments.join('/'));
                    }}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-xs font-bold text-teal-600 dark:text-teal-400"
                  >
                    <span>.. (go up)</span>
                  </div>
                )}

                {treeItems.map(item => (
                  <div
                    key={item.path}
                    onClick={() => handleItemClick(item)}
                    className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-xs group transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.type === 'tree' ? (
                        <Folder className="w-4 h-4 text-sky-500 shrink-0" />
                      ) : (
                        <FileCode className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span className={`font-mono truncate ${
                        item.type === 'tree' ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px] shrink-0">
                      {item.size !== undefined && <span>{item.size} B</span>}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rendered README.md */}
          {!selectedFile && readme && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-slate-100">
                <FileText className="w-4 h-4 text-teal-500" />
                {readme.fileName}
              </div>
              <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed font-sans whitespace-pre-wrap">
                {readme.content}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PULL REQUESTS */}
      {/* ========================================================================= */}
      {activeTab === 'pulls' && (
        <div className="space-y-4">
          {selectedPR ? (
            /* PR Detail View */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <button 
                    onClick={() => setSelectedPR(null)}
                    className="text-xs text-teal-600 dark:text-teal-400 font-bold mb-2 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Pull Requests
                  </button>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {selectedPR.pullRequest.title}
                    <span className="text-slate-400 font-normal">#{selectedPR.pullRequest.number}</span>
                  </h2>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      selectedPR.pullRequest.status === 'merged' 
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        : selectedPR.pullRequest.status === 'open'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {selectedPR.pullRequest.status}
                    </span>
                    <span><strong>{selectedPR.pullRequest.author_name}</strong> wants to merge into</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-teal-500 font-bold">
                      {selectedPR.pullRequest.target_branch}
                    </span>
                    <span>from</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-teal-500 font-bold">
                      {selectedPR.pullRequest.source_branch}
                    </span>
                  </div>
                </div>

                {/* Review Actions */}
                {selectedPR.pullRequest.status === 'open' && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      onClick={() => handleSubmitReview('approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<AlertCircle className="w-4 h-4 text-amber-500" />}
                      onClick={() => handleSubmitReview('changes_requested')}
                    >
                      Request Changes
                    </Button>
                  </div>
                )}
              </div>

              {/* Conflict / Mergeability Banner & Merge Button */}
              {selectedPR.pullRequest.status === 'open' && (
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                  selectedPR.pullRequest.can_merge 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-200' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-900 dark:text-rose-200'
                }`}>
                  <div className="flex items-center gap-3">
                    {selectedPR.pullRequest.can_merge ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-bold">
                        {selectedPR.pullRequest.can_merge 
                          ? 'This branch has no conflicts with the base branch.' 
                          : 'This branch cannot be merged automatically due to conflicts.'}
                      </p>
                      <p className="text-xs opacity-80">
                        {selectedPR.pullRequest.can_merge 
                          ? 'Merging can be performed directly on the server without git rebase.' 
                          : `Conflicts: ${selectedPR.pullRequest.conflicts?.join(', ')}`}
                      </p>
                    </div>
                  </div>

                  {selectedPR.pullRequest.can_merge && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<GitPullRequest className="w-4 h-4" />}
                      onClick={() => handleMergePR(selectedPR.pullRequest.number)}
                    >
                      Merge Pull Request
                    </Button>
                  )}
                </div>
              )}

              {/* PR Description & Discussion */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-500 mb-1">Description</p>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selectedPR.pullRequest.description || 'No description provided.'}
                  </p>
                </div>

                {/* Reviews list */}
                {selectedPR.reviews?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Reviews & Decisions</p>
                    {selectedPR.reviews.map((rev: any) => (
                      <div key={rev.id} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${rev.decision === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <strong className="text-slate-900 dark:text-slate-100">{rev.reviewer_name}</strong>
                          <span className="text-slate-500">marked as <strong className="capitalize">{rev.decision}</strong></span>
                        </div>
                        <span className="text-slate-400 text-[11px]">{new Date(rev.created_at).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comments list */}
                {selectedPR.comments?.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Conversation</p>
                    {selectedPR.comments.map((c: any) => (
                      <div key={c.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <strong className="text-slate-900 dark:text-slate-100">{c.user_name}</strong>
                          <span className="text-slate-400 text-[10px]">{new Date(c.created_at).toLocaleString()}</span>
                        </div>
                        {c.file_path && (
                          <div className="text-[10px] font-mono text-teal-500">
                            Line {c.line_number} on {c.file_path}
                          </div>
                        )}
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{c.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Box */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <Textarea
                    placeholder="Leave a comment on this pull request..."
                    value={prCommentText}
                    onChange={(e) => setPrCommentText(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAddPRComment}
                      icon={<MessageSquare className="w-3.5 h-3.5" />}
                    >
                      Comment
                    </Button>
                  </div>
                </div>

                {/* Unified Code Diff Viewer */}
                {prDiff?.files?.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Files Changed ({prDiff.files.length})
                      </h4>
                      <div className="text-xs font-mono">
                        <span className="text-emerald-500 font-bold">+{prDiff.totalAdditions}</span>{' '}
                        <span className="text-rose-500 font-bold">-{prDiff.totalDeletions}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {prDiff.files.map((file: any) => (
                        <div key={file.newPath} className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                          <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-mono flex items-center justify-between">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{file.newPath}</span>
                            <span>+{file.additions} -{file.deletions}</span>
                          </div>
                          <div className="p-3 bg-slate-950 font-mono text-xs overflow-x-auto text-slate-200 whitespace-pre">
                            {file.patch}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* PRs List View */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Pull Requests</h3>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setNewPRModalOpen(true);
                    setNewPRSourceBranch(branches.find(b => !b.isDefault)?.name || '');
                  }}
                >
                  New Pull Request
                </Button>
              </div>

              {pullRequests.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No pull requests yet. Push a feature branch and open a pull request!
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pullRequests.map(pr => (
                    <div
                      key={pr.id}
                      onClick={() => handleOpenPR(pr.number)}
                      className="py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-3 rounded-xl cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <GitPullRequest className={`w-4 h-4 mt-1 ${
                          pr.status === 'merged' ? 'text-purple-500' : pr.status === 'open' ? 'text-emerald-500' : 'text-rose-500'
                        }`} />
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                            {pr.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span>#{pr.number} by {pr.author_name}</span>
                            <span>•</span>
                            <span className="font-mono text-teal-500">{pr.source_branch} &rarr; {pr.target_branch}</span>
                            <span>•</span>
                            <span>{new Date(pr.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        {pr.approvals_count && pr.approvals_count > 0 ? (
                          <Badge variant="teal" size="sm">✓ Approved</Badge>
                        ) : null}
                        <span className="flex items-center gap-1 text-slate-400">
                          <MessageSquare className="w-3.5 h-3.5" /> {pr.comments_count || 0}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ISSUES & TASKS */}
      {/* ========================================================================= */}
      {activeTab === 'issues' && (
        <div className="space-y-4">
          {selectedIssue ? (
            /* Issue Detail View */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => setSelectedIssue(null)}
                  className="text-xs text-teal-600 dark:text-teal-400 font-bold mb-2 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Issues
                </button>
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {selectedIssue.issue.title}
                    <span className="text-slate-400 font-normal">#{selectedIssue.issue.number}</span>
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    selectedIssue.issue.status === 'open' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    {selectedIssue.issue.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Opened by <strong>{selectedIssue.issue.author_name}</strong> • Priority: <span className="capitalize font-bold">{selectedIssue.issue.priority}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedIssue.issue.description || 'No description provided.'}
              </div>

              {/* Discussion Comments */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Activity & Comments</h4>
                {selectedIssue.comments?.map((c: any) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-slate-900 dark:text-slate-100">{c.user_name}</strong>
                      <span className="text-slate-400 text-[10px]">{new Date(c.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{c.body}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <Textarea
                  placeholder="Leave a comment..."
                  value={issueCommentText}
                  onChange={(e) => setIssueCommentText(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={async () => {
                      if (!issueCommentText.trim()) return;
                      await api.git.addIssueComment(owner, repoName, selectedIssue.issue.number, {
                        userId: currentUser.id,
                        body: issueCommentText.trim()
                      });
                      setIssueCommentText('');
                      handleOpenIssue(selectedIssue.issue.number);
                    }}
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Issues List View */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Project Issues</h3>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setNewIssueModalOpen(true)}
                >
                  New Issue
                </Button>
              </div>

              {issues.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No open issues! Create an issue to track features and bugs.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {issues.map(iss => (
                    <div
                      key={iss.id}
                      onClick={() => handleOpenIssue(iss.number)}
                      className="py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-3 rounded-xl cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className={`w-4 h-4 mt-1 ${
                          iss.status === 'open' ? 'text-emerald-500' : 'text-slate-400'
                        }`} />
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                            {iss.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span>#{iss.number} by {iss.author_name}</span>
                            <span>•</span>
                            <span className="capitalize">{iss.priority} priority</span>
                            <span>•</span>
                            <span>{new Date(iss.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {iss.labels?.map(l => (
                          <span key={l.id} className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${l.color}20`, color: l.color }}>
                            {l.name}
                          </span>
                        ))}
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform ml-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: COMMITS */}
      {/* ========================================================================= */}
      {activeTab === 'commits' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-teal-500" />
              Commit History on <span className="font-mono text-teal-500">{currentBranch}</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">{commits.length} commits</span>
          </div>

          <div className="space-y-3">
            {commits.map(c => (
              <div
                key={c.hash}
                onClick={async () => {
                  const details = await api.git.getCommitDetails(owner, repoName, c.hash);
                  setSelectedCommitDiff(details);
                }}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-teal-500 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{c.message}</p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                    <strong>{c.authorName}</strong> committed on {c.date}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {c.shortHash}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>

          {/* Commit Diff Modal */}
          <Modal
            isOpen={Boolean(selectedCommitDiff)}
            onClose={() => setSelectedCommitDiff(null)}
            title={`Commit ${selectedCommitDiff?.commit?.shortHash}`}
          >
            {selectedCommitDiff && (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedCommitDiff.commit.message}</h4>
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    {selectedCommitDiff.commit.authorName} • {selectedCommitDiff.commit.hash}
                  </p>
                </div>

                <div className="p-3 bg-slate-950 font-mono text-xs rounded-xl overflow-x-auto text-slate-200 whitespace-pre">
                  {selectedCommitDiff.diff}
                </div>
              </div>
            )}
          </Modal>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: BRANCHES */}
      {/* ========================================================================= */}
      {activeTab === 'branches' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-teal-500" />
              Repository Branches ({branches.length})
            </h3>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setNewBranchModalOpen(true)}
            >
              New Branch
            </Button>
          </div>

          <div className="space-y-2">
            {branches.map(b => (
              <div
                key={b.name}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <GitBranch className="w-4 h-4 text-teal-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">{b.name}</span>
                      {b.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-500 border border-teal-500/20">
                          default
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-mono">
                      Last commit: {b.lastCommitMessage} • {b.lastCommit.slice(0, 7)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentBranch(b.name);
                      setActiveTab('code');
                    }}
                  >
                    View Code
                  </Button>
                  {!b.isDefault && (
                    <button
                      onClick={async () => {
                        if (confirm(`Delete branch "${b.name}"?`)) {
                          await api.git.deleteBranch(owner, repoName, b.name, currentUser.id);
                          const bRes = await api.git.getBranches(owner, repoName);
                          if (bRes?.branches) setBranches(bRes.branches);
                          addToast(`Branch "${b.name}" deleted.`, 'info');
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete branch"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: ACTIVITY FEED */}
      {/* ========================================================================= */}
      {activeTab === 'activity' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Activity className="w-5 h-5 text-teal-500" />
            Audit Trail & Activity Log
          </h3>

          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No recorded activity yet.</p>
            ) : (
              activities.map(act => (
                <div key={act.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{act.user_name || 'System'}</span>{' '}
                      <span className="text-slate-500">
                        {act.action_type === 'push' && 'pushed code'}
                        {act.action_type === 'pr_opened' && 'opened pull request'}
                        {act.action_type === 'pr_merged' && 'merged pull request'}
                        {act.action_type === 'branch_created' && 'created branch'}
                        {act.action_type === 'issue_opened' && 'opened issue'}
                        {act.action_type === 'member_added' && 'added collaborator'}
                      </span>
                    </div>
                  </div>
                  <span className="text-slate-400 text-[11px]">{new Date(act.created_at).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: SETTINGS & COLLABORATORS */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
              <Settings className="w-5 h-5 text-teal-500" />
              Repository Settings
            </h3>
            <p className="text-xs text-slate-500">Manage permissions, repository visibility, and collaborator roles.</p>
          </div>

          {/* Collaborator Management */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-500" /> Collaborators & Permissions
            </h4>

            <div className="space-y-2">
              {collaborators.map(c => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={c.avatar} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{c.name}</p>
                      <p className="text-[10px] text-slate-500">@{c.username}</p>
                    </div>
                  </div>
                  <Badge variant={c.role === 'owner' ? 'teal' : 'indigo'} size="sm">
                    {c.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New PR Modal */}
      <Modal
        isOpen={newPRModalOpen}
        onClose={() => setNewPRModalOpen(false)}
        title="Open a Pull Request"
      >
        <form onSubmit={handleCreatePR} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 font-mono text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Base (Target)</label>
              <select
                value={newPRTargetBranch}
                onChange={(e) => setNewPRTargetBranch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-300 dark:border-slate-700 font-mono text-xs"
              >
                {branches.map(b => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Compare (Source)</label>
              <select
                value={newPRSourceBranch}
                onChange={(e) => setNewPRSourceBranch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-300 dark:border-slate-700 font-mono text-xs"
              >
                {branches.map(b => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">PR Title *</label>
            <Input
              placeholder="e.g. Implement WebSocket heartbeat reconnection"
              value={newPRTitle}
              onChange={(e) => setNewPRTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <Textarea
              placeholder="Explain the changes in this pull request and link any relevant issues..."
              value={newPRDescription}
              onChange={(e) => setNewPRDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setNewPRModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" icon={<GitPullRequest className="w-4 h-4" />}>
              Create Pull Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* New Issue Modal */}
      <Modal
        isOpen={newIssueModalOpen}
        onClose={() => setNewIssueModalOpen(false)}
        title="Open a New Issue"
      >
        <form onSubmit={handleCreateIssue} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Title *</label>
            <Input
              placeholder="e.g. Kernel trace map memory leak under high burst"
              value={newIssueTitle}
              onChange={(e) => setNewIssueTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <Textarea
              placeholder="Describe the bug or feature request in detail..."
              value={newIssueDescription}
              onChange={(e) => setNewIssueDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
            <select
              value={newIssuePriority}
              onChange={(e) => setNewIssuePriority(e.target.value as any)}
              className="w-full bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setNewIssueModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" icon={<AlertCircle className="w-4 h-4" />}>
              Submit Issue
            </Button>
          </div>
        </form>
      </Modal>

      {/* New Branch Modal */}
      <Modal
        isOpen={newBranchModalOpen}
        onClose={() => setNewBranchModalOpen(false)}
        title="Create a New Branch"
      >
        <form onSubmit={handleCreateBranch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Branch Name *</label>
            <Input
              placeholder="feature/distributed-tracing"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              required
            />
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              Branch will be branched from <strong className="text-teal-500">{currentBranch}</strong>.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setNewBranchModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" icon={<GitBranch className="w-4 h-4" />}>
              Create Branch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
