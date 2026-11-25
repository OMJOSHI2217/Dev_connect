export interface Repository {
  id: string;
  project_id?: string | null;
  project_title?: string;
  name: string;
  slug: string;
  description: string;
  owner_id: string;
  owner_name?: string;
  owner_username?: string;
  owner_avatar?: string;
  visibility: 'public' | 'private';
  default_branch: string;
  disk_path: string;
  stars_count: number;
  forks_count: number;
  open_issues_count: number;
  open_prs_count: number;
  created_at: string;
  updated_at: string;
}

export interface GitTreeItem {
  mode: string;
  type: 'blob' | 'tree' | 'commit';
  hash: string;
  size?: number;
  name: string;
  path: string;
}

export interface GitCommit {
  hash: string;
  shortHash: string;
  authorName: string;
  authorEmail: string;
  timestamp: number;
  date: string;
  message: string;
}

export interface GitDiffFile {
  oldPath: string;
  newPath: string;
  additions: number;
  deletions: number;
  isNew: boolean;
  isDeleted: boolean;
  isRenamed: boolean;
  patch: string;
}

export interface GitBranch {
  name: string;
  isDefault: boolean;
  lastCommit: string;
  lastCommitDate: string;
  lastCommitMessage: string;
}

export interface PullRequest {
  id: string;
  repository_id: string;
  number: number;
  title: string;
  description: string;
  author_id: string;
  author_name?: string;
  author_username?: string;
  author_avatar?: string;
  source_branch: string;
  target_branch: string;
  status: 'open' | 'merged' | 'closed';
  mergeable_state: 'clean' | 'conflict' | 'unknown';
  can_merge?: boolean;
  conflicts?: string[];
  merged_by?: string;
  merged_by_name?: string;
  merged_at?: string;
  closed_at?: string;
  comments_count?: number;
  approvals_count?: number;
  created_at: string;
  updated_at: string;
}

export interface PullRequestReview {
  id: string;
  pull_request_id: string;
  reviewer_id: string;
  reviewer_name?: string;
  reviewer_username?: string;
  reviewer_avatar?: string;
  decision: 'approved' | 'changes_requested' | 'commented';
  body: string;
  created_at: string;
}

export interface PullRequestComment {
  id: string;
  pull_request_id: string;
  user_id: string;
  user_name?: string;
  user_username?: string;
  user_avatar?: string;
  file_path?: string | null;
  line_number?: number | null;
  diff_hunk?: string | null;
  body: string;
  created_at: string;
}

export interface Issue {
  id: string;
  repository_id: string;
  number: number;
  title: string;
  description: string;
  author_id: string;
  author_name?: string;
  author_username?: string;
  author_avatar?: string;
  assignee_id?: string | null;
  assignee_name?: string;
  assignee_username?: string;
  assignee_avatar?: string;
  status: 'open' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  labels?: IssueLabel[];
  comments_count?: number;
  closed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface IssueLabel {
  id: number;
  repository_id: string;
  name: string;
  color: string;
  description?: string;
}

export interface IssueComment {
  id: string;
  issue_id: string;
  user_id: string;
  user_name?: string;
  user_username?: string;
  user_avatar?: string;
  body: string;
  created_at: string;
}

export interface RepositoryCollaborator {
  id: number;
  repository_id: string;
  user_id: string;
  role: 'owner' | 'collaborator' | 'reviewer';
  can_push: boolean;
  can_merge: boolean;
  joined_at: string;
  name?: string;
  username?: string;
  avatar?: string;
  dev_role?: string;
}

export interface RepositoryActivity {
  id: number;
  repository_id: string;
  user_id: string;
  user_name?: string;
  user_username?: string;
  user_avatar?: string;
  action_type: 'push' | 'branch_created' | 'branch_deleted' | 'pr_opened' | 'pr_merged' | 'pr_closed' | 'issue_opened' | 'issue_closed' | 'member_added';
  details: any;
  created_at: string;
}
